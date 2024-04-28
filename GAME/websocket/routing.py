from django.urls import re_path
from .consumers import GameConsumer, DefaultConsumer

websocket_urlpatterns = [
    re_path(r"ws/game-server/", GameConsumer.as_asgi()),
    # re_path(r"^ws/room/(?P<room_number>\d+)/$", RoomConsumer.as_asgi()),
    re_path(r"^.*$", DefaultConsumer.as_asgi()),
]
