import asyncio
import json
from json.decoder import JSONDecodeError

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import StopConsumer
from session.session_manager import SessionManager


class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.session_manager: SessionManager = None
        self.game_session = None
        self.connected = False

    async def connect(self):
        await self.accept()
        self.connected = True
        await self.send_message("connection_established", "You are now connected!")

    async def receive(self, text_data=None, bytes_data=None):
        try:
            msg = json.loads(text_data)
            await self.handle_message(msg)
        except JSONDecodeError:
            await self.send_error("Invalid JSON format")
        except KeyError as e:
            await self.send_error(f"Missing key: {e}")
        except Exception as e:  # pylint: disable=broad-exception-caught
            await self.send_error(f"Unexpect exception: {e}")

    async def handle_message(self, msg):
        msg_type = msg.get("type")
        msg_subtype = msg.get("subtype", "")

        if msg_type == "disconnect":
            await self.close(code=1000)

        elif msg_type == "game":
            msg_data = msg.get("data", {})

            if msg_subtype == "session_info":
                await self.initialize_session(msg_data)
            else:
                await self.handle_game_message(msg)

        elif msg_type == "game_over" and msg_subtype == "summary":
            data = self.session_manager.get_summary_stat()
            await self.send_message("summary", "6-4 최종 정보 전송", data, "game_over_response")

    async def initialize_session(self, msg_data):
        self.session_manager = SessionManager(msg_data)

        battle_mode = self.session_manager.battle_mode

        if battle_mode == 1:  # 1vs1
            send_msg = self.session_manager.get_send_data("match_init_setting")
            await self.send_message(*send_msg)
        elif battle_mode == 2:  # 토너먼트
            send_msg = self.session_manager.get_send_data("tournament_tree")
            await self.send_message(*send_msg)

    async def handle_game_message(self, msg):
        msg_subtype = msg.get("subtype", "")
        msg_data = msg.get("data", {})

        if msg_subtype == "key_down":
            try:
                key_set = msg_data["key_set"]
                self.session_manager.set_match_key_set(key_set)
            except KeyError:
                await self.send_error("key_set not provided")

        elif msg_subtype == "match_start":
            self.game_session = asyncio.create_task(self.run_game_session())

        else:
            send_msg = self.session_manager.get_send_data(msg_subtype)
            await self.send_message(*send_msg)

        # elif msg_subtype == "session_info":
        #     await self.initialize_session(msg_data)

    async def run_game_session(self):
        """매치 시작 후 1초당 60프레임으로 클라이언트에게 현재 상태 전송"""
        sm: SessionManager = self.session_manager

        # 매치 프레임 전송
        for message in sm.get_match_frame():
            await self.send_message(*message)
            await asyncio.sleep(1 / 60)

        # 매치 통계 전송
        send_msg = sm.get_send_data("match_end")
        await self.send_message(*send_msg)

    async def disconnect(self, code):
        self.connected = False
        # code: 1000 정상 종료 1001 상대방이 떠남 1002 프로토콜 오류 (로깅 시 사용)
        if self.game_session:
            self.game_session.cancel()
            try:
                await self.game_session
            except asyncio.CancelledError:
                pass  # 게임 세션 취소 성공
        await super().disconnect(code)

    async def send_message(self, subtype, message, data=None, msg_type="game"):
        if not self.connected:
            print("GameConsumer: WebSocket is not connected. Message not sent.")
            return

        msg = {
            "type": msg_type,
            "subtype": subtype,
            "message": message,
            "data": data or {},
        }
        await self.send(text_data=json.dumps(msg))

    async def send_error(self, error_message):
        if not self.connected:
            print("GameConsumer: WebSocket is not connected. Error message not sent.")
            return

        try:
            await self.send_message("error", error_message)
        except Exception as e:  # pylint: disable=broad-exception-caught
            print(f"Error sending message: {e}")
        finally:
            await self.disconnect(1002)
            await self.close()
            raise StopConsumer()
