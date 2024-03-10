import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from match.match_manager import MatchManager


class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.match_manager = None

    async def connect(self):
        await self.accept()

        await self.send(
            text_data=json.dumps(
                {"type": "connection_established", "message": "You are now connected!"}
            )
        )

        self.match_manager = MatchManager(self)
        asyncio.create_task(self.match_manager.start_game())

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        key_set = text_data_json["key_set"]
        await self.match_manager.local_move_paddles(key_set)
