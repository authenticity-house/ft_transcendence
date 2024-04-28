from channels.generic.websocket import AsyncJsonWebsocketConsumer


class OnlineDuelConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.user = None
        self.session_number = -1
        self.session_group_name = "room"

    async def connect(self):
        self.user = self.scope["user"]
        # 비인증 유저 거부
        if not self.user.is_authenticated:
            self.close()

        self.session_number = int(self.scope["url_route"]["kwargs"]["session_number"])
        self.session_group_name = f"session_{self.room_number}"

        # self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        await self.send_message("connection_established", "You are now connected!")

    async def send_message(self, subtype, message, data=None, msg_type="game"):
        if not self.connected:
            print("GameConsumer: WebSocket is not connected. Message not sent.")
            return

        msg = {
            "type": msg_type,
            "subtype": subtype,
            "mode": "online",
            "message": message,
            "data": data or {},
        }

        await self.send_json(msg)
