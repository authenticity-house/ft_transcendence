from channels.generic.websocket import JsonWebsocketConsumer


class RoomConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass
