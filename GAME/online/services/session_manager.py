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
        return session

    @classmethod
    def __next_room_number(cls) -> int:
        cls._last_session_number += 1
        return cls._last_session_number
