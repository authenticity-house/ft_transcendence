from django.urls import re_path
from . import consumers

websocket_urlpatterns = [re_path(r"ws/game-server/", consumers.GameConsumer.as_asgi())]
