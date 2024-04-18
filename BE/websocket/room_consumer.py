from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from rooms.services import RoomManager


class RoomConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.user = None
        self.room_number = -1
        self.room_group_name = "room"

        self.room = None

    def connect(self):
        self.user = self.scope["user"]
        # 비인증 유저 거부
        if not self.user.is_authenticated:
            self.close()

        self.room_number = self.scope["url_route"]["kwargs"]["room_number"]
        self.room_group_name = f"room_{self.room_number}"

        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()

        self.room = RoomManager.get_room(int(self.room_number))
        self.broadcast("room.info", "get room info")

    def receive_json(self, content, **kwargs):
        msg_type = content.get("type", "invalid")
        msg_body = content.get("data", "")
        if msg_type == "room.exit":
            self.room_exit()

    def room_exit(self):
        self.room.delete_user(self.user)
        self.broadcast("room.info", "get room info")
        self.close()

    def room_info(self, event):
        info = self.room.room_info()
        self.send_json(info)

    def broadcast(self, msg_type, msg_body):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": msg_type,
                "data": msg_body,
            },
        )

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)
