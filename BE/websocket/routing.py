from django.urls import re_path
from . import room_consumer

websocket_urlpatterns = [re_path(r"ws/game-server/", room_consumer.RoomConsumer.as_asgi())]
