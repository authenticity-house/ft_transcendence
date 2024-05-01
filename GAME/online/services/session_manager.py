from .session import Session


class OnlineSessionManager:
    _instance = None
    _sessions: dict = {}
    _last_session_number: int = 0

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(OnlineSessionManager, cls).__new__(cls)
            cls._sessions = {}
            cls._last_session_number = -1
        return cls._instance

    @classmethod
    def add_session(cls, game_info) -> int:
        session_number = cls.__next_room_number()

        session = Session(session_number, game_info)
        cls._sessions[session_number] = session

        return session_number

    @classmethod
    async def join_session(cls, session_number, nickname):
        session = cls._sessions[session_number]
        await session.add_user(nickname)

    @classmethod
    def __next_room_number(cls) -> int:
        cls._last_session_number += 1
        return cls._last_session_number


"""

    @classmethod
    def delete_room(cls, room_number) -> None:
        cls._rooms.pop(room_number)

    @classmethod
    def is_host(cls, room_number, user) -> bool:
        room = cls.get_room(room_number)
        return room.is_host(user)

    @classmethod
    def room_list(cls) -> list:
        lst = []
        for room in cls._rooms.values():
            info = room.room_info()
            lst.append(info)
        return lst

    @classmethod
    def room_info(cls, room_number, user):
        room = cls.get_room(room_number)
        info = {
            "room_info": room.room_info(),
            "user_info": room.users_info(),
            "my_info": room.my_info(user),
        }
        return info

    @classmethod
    def get_room(cls, room_number) -> Room:
        if room_number not in cls._rooms:
            raise RoomError("Invalid room number")
        return cls._rooms[room_number]
"""
