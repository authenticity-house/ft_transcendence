import asyncio
import json
from json.decoder import JSONDecodeError

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import StopConsumer
from match.match_manager import MatchManager
from match.player import Player
from match.ball import Ball


class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.match_manager = None
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

        if msg_type == "disconnect":
            await self.close(code=1000)

        elif msg_type == "game":
            await self.handle_game_message(msg)

    async def handle_game_message(self, msg):
        msg_subtype = msg.get("subtype", "")
        msg_data = msg.get("data", {})

        if msg_subtype == "key_down":
            try:
                key_set = msg_data["key_set"]
                self.match_manager.keys = set(key_set)
            except KeyError:
                await self.send_error("key_set not provided")

        elif msg_subtype == "session_info":
            await self.initialize_session(msg_data)

        elif msg_subtype == "match_start":
            self.game_session = asyncio.create_task(self.match_manager.start_game())

    # 세션 초기화 로직
    async def initialize_session(self, msg_data):
        total_score = msg_data.get("total_score")
        # msg_data["battle_mode"] 여기서 보고 토너먼트, 1대1 분기

        # 레벨 정보는 MatchManager가 받아서 알맞은 패들 크기, 공속도 설정하기
        self.match_manager = MatchManager(socket=self, total_score=total_score)
        # 추가 설정 및 초기화 로직
        await self.send_initial_settings(msg_data)

    # 초기 설정 메시지 전송 로직
    async def send_initial_settings(self, msg_data):
        color_info = msg_data.get("color")
        paddle_color = color_info["paddle"]
        ball_color = color_info["ball"]
        # 아직 공 색 정보는 클라이언트에게 안받음

        ball: Ball = self.match_manager.ball
        player1: Player = self.match_manager.player1
        player2: Player = self.match_manager.player2

        data = {
            "battle_mode": msg_data.get("battle_mode"),
            "color": {
                "paddle": paddle_color,
                "ball": ball_color,
            },
            "ball": {
                "status": "in",
                "x": ball.x,
                "y": ball.y,
                "radius": ball.radius,
            },
            "paddle1": {
                "x": player1.paddle.x,
                "y": player1.paddle.y,
                "width": player1.paddle.width,
                "height": player1.paddle.height,
            },
            "paddle2": {
                "x": player2.paddle.x,
                "y": player2.paddle.y,
                "width": player2.paddle.width,
                "height": player2.paddle.height,
            },
            "nickname": {
                "player1": player1.name,
                "player2": player2.name,
            },
        }
        await self.send_message("match_init_setting", "", data)

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

    async def send_message(self, subtype, message, data=None):
        if not self.connected:
            print("GameConsumer: WebSocket is not connected. Message not sent.")
            return

        msg = {
            "type": "game",
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
