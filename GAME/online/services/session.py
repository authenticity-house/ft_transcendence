import asyncio

from channels.layers import get_channel_layer

from session.session_manager import DuelManager, ASessionManager, TournamentManager
from websocket.backend_api import send_match_result


class Session:
    def __init__(self, session_number, game_info):
        self._session_number = session_number
        self._manager = None
        self._users = []
        self._pks = dict()
        self._total_user = game_info["current_headcount"]

        self._key_maps = None
        self._player_key_sets = None

        self._session_group_name = f"session_{self._session_number}"
        self._match_session = None

    async def add_user(self, nickname, pk):
        self._users.append(nickname)
        self._pks[nickname] = pk

        if len(self._users) == self._total_user:
            self._manager.set_nickname(self._users)
            self._match_session = asyncio.create_task(self._run_game_session())

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

    def _update_player_info(self, player1_nickname, player2_nickname):
        self._current_match_player1 = player1_nickname
        self._current_match_player2 = player2_nickname

        self._key_maps = {
            player1_nickname: {
                "KeyW": "KeyW",
                "ArrowUp": "KeyW",
                "KeyS": "KeyS",
                "ArrowDown": "KeyS",
            },
            player2_nickname: {
                "KeyW": "ArrowUp",
                "ArrowUp": "ArrowUp",
                "KeyS": "ArrowDown",
                "ArrowDown": "ArrowDown",
            },
        }
        self._player_key_sets = {player1_nickname: set(), player2_nickname: set()}

    async def leave_session(self):
        if self._match_session:
            self._match_session.cancel()
            try:
                await self._match_session
            except asyncio.CancelledError:
                msg = {"type": "game", "subtype": "player_leave", "message": "", "mode": "online"}
                await self.__broadcast("player.leave", msg)

    async def _send_message(self, subtype, message, data=None, msg_type="game"):
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


class DuelSession(Session):
    def __init__(self, session_number, game_info):
        super().__init__(session_number, game_info)
        self._manager = DuelManager(game_info)

    async def _run_game_session(self):
        msg = self._manager.get_send_data("match_init_setting")
        self._update_player_info(msg[-1]["nickname"]["player1"], msg[-1]["nickname"]["player2"])
        await self._send_message(*msg)

        await asyncio.sleep(1)

        """매치 시작 후 1초당 60프레임으로 클라이언트에게 현재 상태 전송"""
        sm: ASessionManager = self._manager

        # 매치 프레임 전송
        for message in sm.get_match_frame():
            await self._send_message(*message)
            await asyncio.sleep(1 / 60)

        # 매치 통계 전송
        send_msg = sm.get_send_data("match_end")

        msg = {"player1": self._pks[self._current_match_player1], "player2": self._pks[self._current_match_player2], "data": send_msg[2]}
        await send_match_result(msg)  # 백엔드 서버로 매치 결과 전송

        await self._send_message(*send_msg)


class TournamentSession(Session):
    def __init__(self, session_number, game_info):
        super().__init__(session_number, game_info)

        self._manager = TournamentManager(game_info)

        self._current_match_player1 = "Player1"
        self._current_match_player2 = "Player2"

    async def _run_game_session(self):
        await asyncio.sleep(1)
        msg = self._manager.get_send_data("tournament_tree")
        await self._send_message(*msg)

        while True:
            await asyncio.sleep(3)  # 대진표 출력 후 3초간 대기

            msg = self._manager.get_send_data("match_init_setting")
            self._update_player_info(msg[-1]["nickname"]["player1"], msg[-1]["nickname"]["player2"])
            await self._send_message(*msg)

            await asyncio.sleep(1)

            """매치 시작 후 1초당 60프레임으로 클라이언트에게 현재 상태 전송"""
            sm: ASessionManager = self._manager

            # 매치 프레임 전송
            for message in sm.get_match_frame():
                await self._send_message(*message)
                await asyncio.sleep(1 / 60)

            # 매치 통계 전송
            send_msg = sm.get_send_data("match_end")

            msg = {"player1": self._pks[self._current_match_player1], "player2": self._pks[self._current_match_player2], "data": send_msg[2]}
            await send_match_result(msg)  # 백엔드 서버로 매치 결과 전송

            await self._send_message(*send_msg)

            await asyncio.sleep(3)  # 매치 결과 출력 후 3초간 대기

            msg = self._manager.get_send_data("next_match")
            await self._send_message(*msg)
            if msg[-1] == "game_over":
                break

    def get_summary_stat(self):
        return self._manager.get_summary_stat()

    def get_current_match_player(self):
        return set([self._current_match_player1, self._current_match_player2])
