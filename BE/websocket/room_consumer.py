from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from rooms.services import RoomManager


class RoomConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.user = None
        self.room_number = -1
        self.room_group_name = "room"

    def connect(self):
        self.user = self.scope["user"]
        # 비인증 유저 거부
        if not self.user.is_authenticated:
            self.close()

        self.room_number = self.scope["url_route"]["kwargs"]["room_number"]
        self.room_group_name = f"room_{self.room_number}"

        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()

    def receive_json(self, content, **kwargs):
        msg_type = content.get("type", "invalid")
        msg_body = content.get("data", "")
        if msg_type == "room.join":
            self.room_join()

        # self.broadcast("update.state", msg_body)  # Todo: 방 정보 갱신 함수 구현
        print(RoomManager.room_list())

    def room_join(self):
        RoomManager.join_room(int(self.room_number), self.user)

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
