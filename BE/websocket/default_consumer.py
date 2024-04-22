from channels.generic.websocket import WebsocketConsumer


class DefaultConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data="잘못된 웹소켓 경로입니다.")
        self.close(code=4001)
