from abc import ABCMeta, abstractmethod

from match.match_manager import MatchManager
from match.player import Player
from match.ball import Ball
from .bracket import Bracket


class ASessionManager(metaclass=ABCMeta):
    def __init__(self, data, battle_mode: int):
        self._battle_mode = battle_mode
        self._total_score = data.get("total_score", 15)
        self._level = data.get("level", 2)
        self._color = data.get("color", {"paddle": "#5AD7FF", "ball": "#FFD164"})

        self._match_manager: MatchManager = None

    # 소켓에서 전송할 데이터 반환
    @abstractmethod
    def get_send_data(self, subtype: str):
        pass

    @abstractmethod
    def get_match_nickname(self):
        pass

    @abstractmethod
    def get_first_message(self):
        pass

    def get_match_frame(self):
        yield from self._match_manager.get_match_frame()

    def initialize_match(self):
        paddle_height, ball_speed, ball_accel_speed = self.get_level_info()
        print(self.get_match_nickname())
        player1_nickname, player2_nickname = self.get_match_nickname()

        self._match_manager = MatchManager(
            total_score=self._total_score,
            paddle_height=paddle_height,
            ball_speed=ball_speed,
            ball_accel_speed=ball_accel_speed,
            player1_name=player1_nickname,
            player2_name=player2_nickname,
        )

        return self.get_initial_settings()

    def set_match_key_set(self, key_set):
        if self._match_manager is None:
            return
        self._match_manager.keys = set(key_set)

    def get_level_info(self):
        """패들 길이, 공 속도, 공 가속도 반환"""
        if self._level == 1:
            return 0.5, 0.045, 0.003
        if self._level == 2:
            return 0.4, 0.05, 0.004

        return 0.3, 0.055, 0.004

    def get_initial_settings(self):
        ball: Ball = self._match_manager.ball
        player1: Player = self._match_manager.player1
        player2: Player = self._match_manager.player2

        data = {
            "battle_mode": self._battle_mode,
            "color": self._color,
            "ball": ball.get_stat_data(),
            "paddle1": player1.paddle.get_stat_data(),
            "paddle2": player2.paddle.get_stat_data(),
            "nickname": {
                "player1": player1.name,
                "player2": player2.name,
            },
        }

        return data

    @property
    def battle_mode(self) -> int:
        return self._battle_mode


class TournamentManager(ASessionManager):
    def __init__(self, data):
        super().__init__(data, 2)
        self._summary_stat = []
        self._latest_winner = ""

        nickname = data["nickname"]
        headcount = data.get("headcount", len(nickname))
        self._bracket: Bracket = Bracket(nickname, headcount)

    # 소켓에서 전송할 데이터 반환
    def get_send_data(self, subtype: str):
        if subtype == "tournament_tree":
            data = {
                "battle_mode": self._battle_mode,
                "winner": self._latest_winner,
                "bracket": self._bracket.get_bracket(),
            }
            return subtype, "3-1 대진표", data

        if subtype == "match_init_setting":
            return subtype, "", self.initialize_match()

        if subtype == "match_end":
            data = self._match_manager.get_match_stat()
            self._summary_stat.append(data)

            # 이긴 사람에 대해 업데이트
            self._latest_winner = self.get_winner_nickname(data)
            self._bracket.set_winner_nickname(self._latest_winner)
            return subtype, "5-1 매치 통계 정보 전송", data

        if subtype == "next_match":
            data = {
                "battle_mode": self._battle_mode,
                "winner": self._latest_winner,
                "bracket": self._bracket.get_bracket(),
            }

            if self._bracket.is_end:
                return "tournament_tree", "6-1 대진표", data, "game_over"

            return "tournament_tree", "3-1 대진표", data

        return "error", "not match subtype", {}

    def get_winner_nickname(self, data) -> str:
        player1, player2 = data["player1"], data["player2"]

        if player1["score"] == self._total_score:
            return player1["nickname"]

        if player2["score"] == self._total_score:
            return player2["nickname"]

        return "error"

    def get_match_nickname(self):
        return self._bracket.get_match_nickname()

    def get_first_message(self):
        return self.get_send_data("tournament_tree")

    # 최종 게임 결과 반환
    def get_summary_stat(self):
        return self._summary_stat


class DuelManager(ASessionManager):
    def __init__(self, data):
        super().__init__(data, 1)

        self._nickname = data.get("nickname", ["player1", "player2"])

    # 소켓에서 전송할 데이터 반환
    def get_send_data(self, subtype: str):
        if subtype == "match_init_setting":
            return subtype, "2-2", self.initialize_match()

        if subtype == "match_end":
            data = self._match_manager.get_match_stat()
            return subtype, "4-1", data

        return "error", "not match subtype", {}

    def get_match_nickname(self):
        return self._nickname

    def get_first_message(self):
        return self.get_send_data("match_init_setting")
