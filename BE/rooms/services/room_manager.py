from .room import Room
from .exceptions import RoomError


class RoomManager:
    _instance = None
    _rooms: dict = {}
    _last_room_number: int = 0

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RoomManager, cls).__new__(cls)
            cls._rooms = {}
            cls._last_room_number = -1
        return cls._instance

    @classmethod
    def add_room(cls, room_info) -> int:
        room_number = cls.__next_room_number()
        room = Room(
            room_number=room_number,
            room_name=room_info["room_name"],
            battle_mode=room_info["battle_mode"],
            max_headcount=room_info["max_headcount"],
            total_score=room_info["total_score"],
            level=room_info["level"],
            paddle_color=room_info["color"]["paddle"],
            ball_color=room_info["color"]["ball"],
        )
        cls._rooms[room_number] = room

        return room_number

    @classmethod
    def __next_room_number(cls) -> int:
        cls._last_room_number += 1
        return cls._last_room_number

    @classmethod
    def join_room(cls, room_number, user) -> None:
        room = cls.get_room(room_number)
        room.add_user(user)

    @classmethod
    def room_list(cls) -> list:
        lst = []
        for room in cls._rooms.values():
            info = room.room_info()
            lst.append(info)
        return lst

    @classmethod
    def room_info(cls, room_number):
        room = cls.get_room(room_number)
        return room.room_info()

    @classmethod
    def get_room(cls, room_number) -> Room:
        if room_number not in cls._rooms:
            raise RoomError("Invalid room number")
        return cls._rooms[room_number]
