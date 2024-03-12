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
        msg = json.loads(text_data)
        msg_type, msg_subtype, msg_data = msg["type"], msg["subtype"], msg["data"]
        if msg_type == "game" and msg_subtype == "key_down":
            key_set: set = set(msg_data["key_set"])
            self.match_manager.keys = key_set
