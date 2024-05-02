from django.urls import re_path
from .consumers import GameConsumer, DefaultConsumer
from .online_consumers import OnlineDuelConsumer, OnlineTournamentConsumer

websocket_urlpatterns = [
    re_path(r"ws/game-server/", GameConsumer.as_asgi()),
    re_path(r"^ws/online/oneonone/(?P<session_number>\d+)/$", OnlineDuelConsumer.as_asgi()),
    re_path(r"^ws/online/tournament/(?P<session_number>\d+)/$", OnlineTournamentConsumer.as_asgi()),
    re_path(r"^.*$", DefaultConsumer.as_asgi()),
]
