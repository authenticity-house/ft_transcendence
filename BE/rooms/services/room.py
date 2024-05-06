from stats.models import UserStat
from .room_user import RoomUser
from .exceptions import RoomError


class Room:  # pylint: disable=R0902
    DEFAULT_ROOM_NAME = "내 방으로 들어와!"
    DEFAULT_PADDLE_COLOR = "5AD7FF"
    DEFAULT_BALL_COLOR = "FFD164"

    def __init__(  # pylint: disable=R0913
        self,
        room_number: int = -1,
        room_name: str = DEFAULT_ROOM_NAME,
        battle_mode: int = 0,
        max_headcount: int = 2,
        total_score: int = 15,
        level: int = 2,
        paddle_color: str = DEFAULT_PADDLE_COLOR,
        ball_color: str = DEFAULT_BALL_COLOR,
    ) -> None:
        self._room_name: str = room_name
        self._battle_mode: int = battle_mode
        self._max_headcount: int = max_headcount
        self._total_score: int = total_score
        self._level: int = level
        self._paddle_color: str = paddle_color
        self._ball_color: str = ball_color

        self._room_number: int = room_number
        self._users: list = []
        self._total_rating: int = 0

    def add_user(self, user) -> None:
        if self.__is_full():
            raise RoomError("Room is full")
        if any(usr._nickname == user.nickname for usr in self._users):  # pylint: disable=W0212
            raise RoomError("User already joined")

        pk = user.pk
        nickname = user.nickname
        user_stat, _ = UserStat.objects.get_or_create(user=user)
        rating = user_stat.rating
        img_url = user.profile_url

        user = RoomUser(pk, nickname, rating, img_url)
        self._users.append(user)

        self._total_rating += rating

    def delete_user(self, user) -> None:
        user_stat, _ = UserStat.objects.get_or_create(user=user)
        rating = user_stat.rating

        for idx, room_user in enumerate(self._users):
            if room_user.is_same(user):
                self._users.pop(idx)
                self._total_rating -= rating
                return

        raise RoomError(f"Can not found such user: {user.nickname}")

    def room_info(self) -> dict:
        return {
            "room_number": self._room_number,
            "battle_mode": self._battle_mode,
            "level": self._level,
            "total_score": self._total_score,
            "color": {"paddle": self._paddle_color, "ball": self._ball_color},
            "current_headcount": self.__current_headcount(),
            "max_headcount": self._max_headcount,
            "room_name": self._room_name,
            "rating": (
                0
                if self.__current_headcount() == 0
                else self._total_rating // self.__current_headcount()
            ),
        }

    def users_info(self) -> list:
        users = []

        for idx, room_user in enumerate(self._users):
            info = room_user.info()
            info["host"] = idx == 0
            info["room_position"] = idx

            users.append(info)

        return users

    def my_info(self, user) -> dict:
        for idx, room_user in enumerate(self._users):
            if room_user.is_same(user):
                info = room_user.info()
                info["host"] = idx == 0
                info["room_position"] = idx
                return info

        raise RoomError(f"Can not found such user: {user.nickname}")

    def is_host(self, user) -> bool:
        host_user = self._users[0]
        return host_user.is_same(user)

    def change_state(self, user):
        for room_user in self._users:
            if room_user.is_same(user):
                room_user.change_ready_state()
                break

    def change_profile(self, user):
        for room_user in self._users:
            if room_user.is_same(user):
                room_user.change_profile()
                break

    def change_info(self, info):
        self._level = info["level"]
        self._total_score = info["total_score"]
        self._paddle_color = info["color"]["paddle"]
        self._ball_color = info["color"]["ball"]

    def __current_headcount(self) -> int:
        return len(self._users)

    def __is_full(self) -> bool:
        return self.__current_headcount() >= self._max_headcount
