from channels.generic.websocket import AsyncJsonWebsocketConsumer


class OnlineDuelConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.session_number = -1
        self.session_group_name = "session"

    async def connect(self):
        self.session_number = int(self.scope["url_route"]["kwargs"]["session_number"])
        self.session_group_name = f"session_{self.session_number}"

        self.channel_layer.group_add(self.session_group_name, self.channel_name)

        await self.accept()
        await self.send_message("connection_established", "You are now connected!")

    async def send_message(self, subtype, message, data=None, msg_type="game"):
        msg = {
            "type": msg_type,
            "subtype": subtype,
            "mode": "online",
            "message": message,
            "data": data or {},
        }

        await self.send_json(msg)
