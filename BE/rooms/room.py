from django.shortcuts import get_object_or_404

from .room_user import RoomUser
from users.models import User

class Room:
    DEFAULT_ROOM_NAME = "내 방으로 들어와!"
    DEFAULT_PADDLE_COLOR = "5AD7FF"
    DEFAULT_BALL_COLOR = "FFD164"

    def __init__(
        self,
        room_number: int = -1,
        room_name: str = DEFAULT_ROOM_NAME,
        battle_mode: int = 0,
        max_player: int = 2,
        total_score: int = 15,
        level: int = 2,
        paddle_color: str = DEFAULT_PADDLE_COLOR,
        ball_color: str = DEFAULT_BALL_COLOR,
    ) -> None:
        self._room_name: str = room_name
        self._battle_mode: int = battle_mode
        self._max_player: int = max_player
        self._total_score: int = total_score
        self._level: int = level
        self._paddle_color: str = paddle_color
        self._ball_color: str = ball_color

        self._room_number: int = room_number
        self._users: list = []
        self._total_rating: int = 0

        if self._head_count > 2 and game_mode == 0:
            raise Exception()

    def addUser(self, user) -> None:
        nickname = user.nickname
        rating = user.stats.rating
        img_url = user.profile_url

        user = RoomUser(nickname, rating, img_url)
        _users.append(user)

        self._total_rating += rating

    def deleteUser(self, user) -> None:
        nickname = user.nickname
        rating = user.stats.rating

        for idx, room_user in enumerate(users):
            if room_user.nickname == nickname:
                users.pop(idx)
                self._total_rating -= rating
                return

        raise Exception()

    def room_info(self) -> dict:
        info = {
            "battle_mode": self._battle_mode,
            "level": self._level,
            "total_score": self._total_score,
            "color": {
                "paddle": self._paddle_color,
                "ball": self._ball_color
            },
            "maxPlayer": self._max_player,
            "roomName": self._room_name,
            "rating": 0 if len(self._users) == 0 else self._total_rating // len(self._users)
        }

