from enum import Enum


class RoomUser:
    class Status(Enum):
        WAIT = 0
        READY = 1

    def __init__(self, nickname, rating, img_url) -> None:
        self._nickname: str = nickname
        self._rating: int = rating
        self._img_url: str = img_url

        self._ready_state: RoomUser.Status = RoomUser.Status.WAIT

    def change_ready_state(self) -> None:
        if self._ready_state == RoomUser.Status.WAIT:
            self._ready_state = RoomUser.Status.READY
        else:
            self._ready_state = RoomUser.Status.WAIT

    def info(self) -> dict:
        return {
            "image": self._img_url,
            "nickname": self._nickname,
            "rating": self._rating,
            "ready_state": self._ready_state == RoomUser.Status.READY,
        }

    def is_same(self, user) -> bool:
        return self._nickname == user.nickname
