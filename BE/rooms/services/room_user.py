from enum import Enum

from django.core.exceptions import ObjectDoesNotExist

from users.models import User


class RoomUser:
    class Status(Enum):
        WAIT = 0
        READY = 1

    def __init__(self, pk, nickname, rating, img_url) -> None:
        self._pk: int = pk
        self._nickname: str = nickname
        self._rating: int = rating
        self._img_url: str = img_url

        self._ready_state: RoomUser.Status = RoomUser.Status.WAIT

    def change_ready_state(self) -> None:
        if self._ready_state == RoomUser.Status.WAIT:
            self._ready_state = RoomUser.Status.READY
        else:
            self._ready_state = RoomUser.Status.WAIT

    def change_profile(self) -> None:
        try:
            user = User.objects.get(pk=self._pk)
            self._nickname = user.nickname
            self._img_url = user.profile_url
        except ObjectDoesNotExist as exc:
            pass

    def info(self) -> dict:
        return {
            "image": self._img_url,
            "nickname": self._nickname,
            "rating": self._rating,
            "ready_state": self._ready_state == RoomUser.Status.READY,
        }

    def is_same(self, user) -> bool:
        return self._pk == user.pk
