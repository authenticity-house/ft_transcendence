from channels.generic.websocket import AsyncJsonWebsocketConsumer

from online.services import OnlineSessionManager
from websocket.backend_api import fetch_nickname


class OnlineConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.session_number = -1
        self.session_group_name = "session"
        self.session = None

        self.pk = -1
        self.nickname = None

    async def connect(self):
        session_key = self.scope["cookies"].get("sessionid", None)
        self.pk, self.nickname = await fetch_nickname(session_key)

        # 세션 값이 없는 경우 연결 거부
        if not session_key or not self.nickname:
            await self.close()

        self.session_number = int(self.scope["url_route"]["kwargs"]["session_number"])
        self.session_group_name = f"session_{self.session_number}"
        await self.channel_layer.group_add(self.session_group_name, self.channel_name)

        await self.accept()
        await self.send_message("connection_established", "You are now connected!")

        self.session = await OnlineSessionManager.join_session(
            self.session_number, self.nickname, self.pk
        )

    async def send_message(self, subtype, message, data=None, msg_type="game"):
        msg = {
            "type": msg_type,
            "subtype": subtype,
            "mode": "online",
            "message": message,
            "data": data or {},
        }

        await self.send_json(msg)

    async def send_data(self, event):
        await self.send_json(event["data"])

    async def player_leave(self, event):
        await self.send_json(event["data"])
        await self.close(code=1000)

    async def broadcast(self, msg_type, msg_body):
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                "type": msg_type,
                "data": msg_body,
            },
        )


class OnlineDuelConsumer(OnlineConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def receive_json(self, content, **kwargs):
        msg_type = content.get("type", "invalid")
        msg_subtype = content.get("subtype", "")
        msg_data = content.get("data", "")

        if msg_type == "disconnect":
            await self.channel_layer.group_discard(self.session_group_name, self.channel_name)
            await self.session.leave_session()
            OnlineSessionManager.delete_session(self.session_number)
            await self.close(code=1000)

        elif msg_type == "game" and msg_subtype == "key_down":
            key_set = msg_data["key_set"]
            self.session.set_match_key_set(self.nickname, key_set)

        elif msg_type == "game" and msg_subtype == "match_start":
            # self.game_session = asyncio.create_task(self.run_game_session())
            pass
        print(msg_type)
        print(msg_data)


class OnlineTournamentConsumer(OnlineConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def receive_json(self, content, **kwargs):
        msg_type = content.get("type", "invalid")
        msg_subtype = content.get("subtype", "")
        msg_data = content.get("data", "")

        if msg_type == "disconnect":
            await self.channel_layer.group_discard(self.session_group_name, self.channel_name)
            await self.session.leave_session()
            OnlineSessionManager.delete_session(self.session_number)
            await self.close(code=1000)

        elif msg_type == "game" and msg_subtype == "key_down":
            key_set = msg_data["key_set"]
            self.session.set_match_key_set(self.nickname, key_set)

        elif msg_type == "game" and msg_subtype == "match_start":
            # self.game_session = asyncio.create_task(self.run_game_session())
            pass
        print(msg_type)
        print(msg_data)
