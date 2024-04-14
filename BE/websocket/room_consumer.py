from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
import json

class RoomConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def connect(self):
        self.accept()
        async_to_sync(self.channel_layer.group_add)("room", self.channel_name)

    # def receive(self, text_data=None, bytes_data=None):
    #     msg = json.loads(text_data)
    #     text = msg.get("message")

    def receive(self, text_data):
        print(text_data)
        async_to_sync(self.channel_layer.group_send)(
            "room",
            {
                "type": "room.message",
                "text": text_data,
            },
        )

    def room_message(self, event):
        self.send(text_data=event["text"])

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)("room", self.channel_name)
