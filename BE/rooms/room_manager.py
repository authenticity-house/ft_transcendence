from .room import Room


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
    def add_room(cls, room_info) -> None:
        room_number = cls.next_room_number()
        room = Room(
            room_number=room_number,
            room_name=room_info["room_name"],
            battle_mode=room_info["battle_mode"],
            max_player=room_info["max_player"],
            total_score=room_info["total_score"],
            level=room_info["level"],
            paddle_color=room_info["color"]["paddle"],
            ball_color=room_info["color"]["paddle"],
        )
        cls._rooms[room_number] = room

    @classmethod
    def next_room_number(cls):
        cls._last_room_number += 1
        return cls._last_room_number

    @classmethod
    def attend(cls, room_number, user):
        room = cls._rooms[room_number]
        room.add_user(user)

    @classmethod
    def room_list(cls):
        lst = []
        for room in cls._rooms.values():
            info = room.room_info()
            lst.append(info)
        return lst
