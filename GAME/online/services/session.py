import asyncio

from channels.layers import get_channel_layer

from session.session_manager import DuelManager, ASessionManager
from websocket.backend_api import send_match_result


class Session:
    def __init__(self, session_number, game_info):
        self._session_number = session_number
        self._manager = DuelManager(game_info)
        self._users = []
        self._pks = []
        self._total_user = game_info["current_headcount"]

        self._key_maps = None
        self._player_key_sets = None

        self._session_group_name = f"session_{self._session_number}"
        self._match_session = None

    async def add_user(self, nickname, pk):
        self._users.append(nickname)
        self._pks.append(pk)

        if len(self._users) == self._total_user:
            self._manager.set_nickname(self._users)
            self._key_maps = {
                self._users[0]: {
                    "KeyW": "KeyW",
                    "ArrowUp": "KeyW",
                    "KeyS": "KeyS",
                    "ArrowDown": "KeyS",
                },
                self._users[1]: {
                    "KeyW": "ArrowUp",
                    "ArrowUp": "ArrowUp",
                    "KeyS": "ArrowDown",
                    "ArrowDown": "ArrowDown",
                },
            }
            self._player_key_sets = {self._users[0]: set(), self._users[1]: set()}

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

        msg = {
            "player1": self._pks[0],
            "player2": self._pks[1],
            "data": send_msg[2]
        }
        await send_match_result(msg)  # 백엔드 서버로 매치 결과 전송

        await self.__send_message(*send_msg)

    def set_match_key_set(self, nickname, key_set):
        if nickname not in self._users:
            return

        self._player_key_sets[nickname] = set(key_set)

        mapping_key_set = []
        for player, keys in self._player_key_sets.items():
            map_dict = self._key_maps[player]
            mapped_keys = [map_dict.get(key) for key in keys if key in map_dict]
            mapping_key_set.extend(mapped_keys)

        self._manager.set_match_key_set(mapping_key_set)

    async def leave_session(self):
        if self._match_session:
            self._match_session.cancel()
            try:
                await self._match_session
            except asyncio.CancelledError:
                msg = {"type": "game", "subtype": "player_leave", "message": "", "mode": "online"}
                await self.__broadcast("player.leave", msg)

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