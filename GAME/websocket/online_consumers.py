from channels.generic.websocket import AsyncJsonWebsocketConsumer

from online.services import OnlineSessionManager


class OnlineDuelConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.session_number = -1
        self.session_group_name = "session"

    async def connect(self):
        session_key = self.scope['cookies'].get('sessionid', None)
        print(session_key)

        # 세션 값이 없는 경우 연결 거부
        if not session_key:
            await self.close()

        self.session_number = int(self.scope["url_route"]["kwargs"]["session_number"])
        self.session_group_name = f"session_{self.session_number}"
        await self.channel_layer.group_add(self.session_group_name, self.channel_name)

        await self.accept()
        await self.send_message("connection_established", "You are now connected!")

        await OnlineSessionManager.join_session(self.session_number, "test_user")

    async def send_message(self, subtype, message, data=None, msg_type="game"):
        msg = {
            "type": msg_type,
            "subtype": subtype,
            "mode": "online",
            "message": message,
            "data": data or {},
        }

        await self.send_json(msg)

    async def receive_json(self, content, **kwargs):
        msg_type = content.get("type", "invalid")
        msg_body = content.get("data", "")
        print(msg_type)
        print(msg_body)

    async def match_init_setting(self, event):
        await self.send_json(event["data"])
