from channels.layers import get_channel_layer

from session.session_manager import DuelManager


class Session:
    def __init__(self, session_number, game_info):
        self._session_number = session_number
        self._manager = DuelManager(game_info)
        self._users = []
        self._total_user = game_info["current_headcount"]

        self._session_group_name = f"session_{self._session_number}"

    async def add_user(self, nickname):
        self._users.append(nickname)

        if len(self._users) == self._total_user:
            self._manager.set_nickname(self._users)
            msg = self._manager.get_send_data("match_init_setting")
            await self.__send_message(*msg)

    async def __send_message(self, subtype, message, data=None, msg_type="game"):
        msg = {
            "type": msg_type,
            "subtype": subtype,
            "mode": "online",
            "message": message,
            "data": data or {},
        }

        await self.__broadcast("match.init.setting", msg)

    async def __broadcast(self, msg_type, msg_data):
        channel_layer = get_channel_layer()

        await channel_layer.group_send(
            self._session_group_name,
            {"type": msg_type, "data": msg_data},
        )
