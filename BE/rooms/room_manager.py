from .room import Room


class RoomManager:
    def __init__(self) -> None:
        self._rooms: dict = {}
        self._last_room_number: int = -1

    def add_room(self, room_info) -> None:
        room_number = self.next_room_number()
        room = Room(
            room_number=room_number,
            room_name=room_info["room_name"],
            battle_mode=room_info["battle_mode"],
            max_player=room_info["headcount"],
            total_score=room_info["total_score"],
            level=room_info["level"],
            paddle_color=room_info["color"]["paddle"],
            ball_color=room_info["color"]["paddle"],
        )
        self._rooms[room_number] = room

    def next_room_number(self):
        self._last_room_number += 1
        return self._last_room_number

    def attend(self, room_number, user):
        room = self._rooms[room_number]
        room.add_user(user)
