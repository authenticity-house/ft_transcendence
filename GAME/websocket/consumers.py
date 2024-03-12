import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from match.match_manager import MatchManager


class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.match_manager = None
        self.game_session = None

    async def connect(self):
        await self.accept()

        await self.send(
            text_data=json.dumps(
                {"type": "connection_established", "message": "You are now connected!"}
            )
        )

    async def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)
        msg_type, msg_subtype, msg_data = msg["type"], msg["subtype"], msg["data"] # Todo: json에 해당 헤더가 없는 경우 예외 발생
        if msg_type == "game":
            if msg_subtype == "key_down":
                key_set = msg_data["key_set"]
                self.match_manager.keys = key_set
            elif msg_subtype == "session_info": # 게임 초기 정보
                print(msg_data["battle_mode"])
                print(msg_data["total_score"])
                print(msg_data["battle_mode"])
                print(msg_data["level"])
                print(msg_data["color"]["paddle"])
                print(msg_data["color"]["background"])

                self.match_manager = MatchManager(self)
                self.game_session = asyncio.create_task(self.match_manager.start_game())

                # await self.send(
                #     text_data=json.dumps(
                #         {
                #             "type": "game",
                #             "subtype": "match_init_setting",
                #             "message": "",
                #             "match_id": 123,
                #             "data": {
                #                 "battle_mode": 1,
                #                 "color": {
                #                     "paddle": "#FFFFFF",
                #                     "background": "#FFFFFF",
                #                     "ball": "#FFFFFF",
                #                 },
                #                 "ball": {
                #                     "status": "in",
                #                     "x": 0.0,
                #                     "y": 0.0,
                #                     "radius": 0.04,
                #                 },
                #                 "paddle1": {
                #                     "x": -2.8,
                #                     "y": 0.0,
                #                     "width": 0.1,
                #                     "height": 0.5,
                #                 },
                #                 "paddle2": {
                #                     "x": 2.8,
                #                     "y": 0.0,
                #                     "width": 0.1,
                #                     "height": 0.5,
                #                 },
                #                 "nickname": {
                #                     "player1": "wonyang",
                #                     "player2": "jeongmin"
                #                 }
                #             },
                #         }
                #     )
                # )

                pass

    async def disconnect(self, code):
        # code: 1000 정상 종료 1001 상대방이 떠남 1002 프로토콜 오류 (로깅 시 사용)
        if self.game_session:
            self.game_session.cancel()
            try:
                await self.game_session
            except asyncio.CancelledError:
                # 게임 세션 취소 성공
                pass
