import asyncio

from match.match_manager import MatchManager
from match.player import Player
from match.ball import Ball


class SessionManager:
    def __init__(self, data):
        self._total_score = data.get("total_score", 15)
        self._level = data.get("level", 2)
        self._color = data.get("color", {"paddle": "#5AD7FF", "ball": "#FFD164"})
        self._battle_mode = data.get("battle_mode", 1)
        self._nickname = data.get("nickname", ["player1", "player2"])
        self._headcount = data.get("headcount", len(self._nickname))
        self._bracket = []
        self._match_index = 0
        self._match_cnt = 0
        self._match_manager: MatchManager = None

        self.match_making()

    # 소켓에서 전송할 데이터 반환
    def get_send_data(self, subtype: str):
        if subtype == "tournament_tree":
            data = {"battle_mode": self._battle_mode, "depth": self.get_bracket()}
            return subtype, "3-1 대진표", data

        if subtype == "match_init_setting":
            return subtype, "", self.initialize_match()

        if subtype == "match_run":
            return subtype, "4-4 게임 데이터 전송", self._match_manager.get_send_data()

        if subtype == "match_end":
            data = self._match_manager.get_stat_data()
            winner =
            self.update_bracket()
            return subtype, "5-1 매치 통계 정보 전송", data

        if subtype == "next_match":
            return subtype, "", self.initialize_match()

    def match_making(self):
        """(임시)매치 메이킹 함수"""
        self._bracket.append(self._nickname)
        self._match_cnt = self._headcount // 2
        pass

    # 대진표
    def get_bracket(self):
        return self._bracket
        pass

    def initialize_match(self):
        paddle_height, ball_speed, ball_accel_speed = self.get_level_info()
        self._match_manager = MatchManager(
            total_score=self._total_score,
            paddle_height=paddle_height,
            ball_speed=ball_speed,
            ball_accel_speed=ball_accel_speed,
        )

        return self.get_initial_settings()

    # 매치 진행
    def start_match(self):
        pass

    # 매치 끝난 후 대진표 업데이트
    def update_bracket(self):
        pass

    # 최종 게임 결과 반환
    def get_summary_stat(self):
        pass

    def get_level_info(self):
        """(임시) 패들 길이, 공 속도, 공 가속도 반환"""
        return 0.05, 0.06, 0.005

    def get_initial_settings(self):
        ball: Ball = self.match_manager.ball
        player1: Player = self.match_manager.player1
        player2: Player = self.match_manager.player2

        data = {
            "battle_mode": self._battle_mode,
            "color": self._color,
            "ball": ball.get_stat_data(),
            "paddle1": {
                "x": player1.paddle.x,
                "y": player1.paddle.y,
                "width": player1.paddle.width,
                "height": player1.paddle.height,
            },
            "paddle2": {
                "x": player2.paddle.x,
                "y": player2.paddle.y,
                "width": player2.paddle.width,
                "height": player2.paddle.height,
            },
            "nickname": {
                "player1": player1.name,
                "player2": player2.name,
            },
        }

        return data
