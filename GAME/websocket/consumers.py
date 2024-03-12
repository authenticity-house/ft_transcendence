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

        self.match_manager = MatchManager(self)
        self.game_session = asyncio.create_task(self.match_manager.start_game())

    async def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)
        msg_type, msg_subtype, msg_data = msg["type"], msg["subtype"], msg["data"]
        if msg_type == "game" and msg_subtype == "key_down":
            key_set = msg_data["key_set"]
            self.match_manager.keys = key_set

    async def disconnect(self, code):
        # code: 1000 정상 종료 1001 상대방이 떠남 1002 프로토콜 오류 (로깅 시 사용)
        if self.game_session:
            self.game_session.cancel()
            try:
                await self.game_session
            except asyncio.CancelledError:
                # 게임 세션 취소 성공
                pass
