from django.urls import re_path
from .room_consumer import RoomConsumer
from .default_consumer import DefaultConsumer

websocket_urlpatterns = [
    re_path(r"^.*$", DefaultConsumer.as_asgi()),
    re_path(r"^ws/room/(?P<room_number>\d+)/$", RoomConsumer.as_asgi()),
]
