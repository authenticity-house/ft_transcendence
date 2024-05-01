import asyncio

from channels.layers import get_channel_layer

from session.session_manager import DuelManager, ASessionManager


class Session:
    def __init__(self, session_number, game_info):
        self._session_number = session_number
        self._manager = DuelManager(game_info)
        self._users = []
        self._total_user = game_info["current_headcount"]

        self._session_group_name = f"session_{self._session_number}"

        self._match_session = None

    async def add_user(self, nickname):
        self._users.append(nickname)

        if len(self._users) == self._total_user:
            self._manager.set_nickname(self._users)
            msg = self._manager.get_send_data("match_init_setting")
            await self.__broadcast("send.data", msg)

            self._match_session = asyncio.create_task(self.__run_game_session())

    async def __run_game_session(self):
        """매치 시작 후 1초당 60프레임으로 클라이언트에게 현재 상태 전송"""
        sm: ASessionManager = self._manager

        # 매치 프레임 전송
        for message in sm.get_match_frame():
            await self.__send_message(*message)
            await asyncio.sleep(1 / 60)

        # 매치 통계 전송
        send_msg = sm.get_send_data("match_end")
        await self.__send_message(*send_msg)

    async def __send_message(self, subtype, message, data=None, msg_type="game"):
        msg = {
            "type": msg_type,
            "subtype": subtype,
            "mode": "online",
            "message": message,
            "data": data or {},
        }

        await self.__broadcast("send.data", msg)

    async def __broadcast(self, msg_type, msg_data):
        channel_layer = get_channel_layer()

        await channel_layer.group_send(
            self._session_group_name,
            {"type": msg_type, "data": msg_data},
        )
