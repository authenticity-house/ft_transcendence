from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from rooms.services import RoomManager
from rooms.services.exceptions import RoomError
from .game_server import request_game_session


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

        self.room_number = int(self.scope["url_route"]["kwargs"]["room_number"])
        self.room_group_name = f"room_{self.room_number}"

        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()
        self.broadcast("room.info", "get room info")

    def receive_json(self, content, **kwargs):
        msg_type = content.get("type", "invalid")
        msg_body = content.get("data", "")
        if msg_type == "room.exit":
            self.room_exit()
        elif msg_type == "room.change.state":
            self.change_state()
        elif msg_type == "room.change.profile":
            self.change_profile()
        elif msg_type == "room.change.info":
            self.change_info(msg_body)
        elif msg_type == "room.start.request":
            room = self.__get_room()
            room_info = room.room_info()
            url = request_game_session(room_info)
            self.game_start(url)

    def room_exit(self):
        room = self.__get_room()
        if RoomManager.is_host(self.room_number, self.user):
            self.broadcast("room.end", "get room info")
            RoomManager.delete_room(self.room_number)
            self.close()
            return

        room.delete_user(self.user)
        self.broadcast("room.info", "get room info")
        self.close()

    def room_end(self, event):  # pylint: disable=unused-argument
        msg = {"type": "room.end"}
        self.send_json(msg)
        self.close()

    def room_info(self, event):  # pylint: disable=unused-argument
        try:
            info = RoomManager.room_info(self.room_number, self.user)
        except RoomError:
            return
        info["type"] = "room.info"
        self.send_json(info)

    def room_game_start(self, event):
        msg = {"type": "room.game.start", "url": event["data"]}
        self.send_json(msg)
        self.close()

    def change_state(self):
        room = self.__get_room()
        room.change_state(self.user)
        self.broadcast("room.info", "get room info")

    def change_profile(self):
        room = self.__get_room()
        room.change_profile(self.user)
        self.broadcast("room.info", "get room info")

    def change_info(self, data):
        room = self.__get_room()
        room.change_info(data)
        self.broadcast("room.info", "get room info")

    def game_start(self, url):
        RoomManager.delete_room(self.room_number)
        self.broadcast("room.game.start", url)

    def broadcast(self, msg_type, msg_body):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": msg_type,
                "data": msg_body,
            },
        )

    def leave_group(self):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def disconnect(self, code):
        self.leave_group()

    def __get_room(self):
        return RoomManager.get_room(self.room_number)
