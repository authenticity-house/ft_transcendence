from .session import TournamentSession, DuelSession


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
    def add_session(cls, game_info, battle_mode) -> int:
        session_number = cls.__next_room_number()

        if battle_mode == 1:
            cls._sessions[session_number] = DuelSession(session_number, game_info)
        else:
            cls._sessions[session_number] = TournamentSession(session_number, game_info)

        return session_number

    @classmethod
    async def join_session(cls, session_number, nickname, pk, profile_url):
        session = cls._sessions[session_number]
        await session.add_user(nickname, pk, profile_url)
        return session

    @classmethod
    def delete_session(cls, session_number):
        cls._sessions.pop(session_number, None)

    @classmethod
    def __next_room_number(cls) -> int:
        cls._last_session_number += 1
        return cls._last_session_number
