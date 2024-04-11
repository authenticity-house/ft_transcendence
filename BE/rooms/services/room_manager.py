from .room import Room
from .exceptions import RoomError


class RoomManager:
    _instance = None
    _rooms: dict = {}
    _last_room_number: int = -1

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
        if room_number not in cls._rooms.keys():
            raise RoomError("Invalid room number")
        room = cls._rooms[room_number]
        room.add_user(user)

    @classmethod
    def room_list(cls) -> list:
        # debug
        test_room_info1 = {
            "room_number": 998,
            "room_name": "1대1 한 판 붙자!",
            "battle_mode": 1,
            "current_headcount": 1,
            "max_headcount": 2,
            "rating": 1487,
        }
        test_room_info2 = {
            "room_number": 999,
            "room_name": "내 방으로 들어와!!",
            "battle_mode": 2,
            "current_headcount": 5,
            "max_headcount": 7,
            "rating": 2398,
        }
        lst = [test_room_info1, test_room_info2]
        for room in cls._rooms.values():
            info = room.room_info()
            lst.append(info)
        return lst
