import asyncio
import json
import datetime as dt
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer

from .player import Player
from .paddle import Paddle
from .ball import Ball
from .constants import Position, SCREEN_WIDTH


class MatchManager:
    def __init__(
        self,
        socket: AsyncWebsocketConsumer,
        total_score: int = 15,
        player1_name: str = "player1",
        player2_name: str = "player2",
    ):
        self.socket = socket
        self.TOTAL_SCORE = total_score  # pylint: disable=invalid-name
        self._player1: Player = Player(Paddle(Position.LEFT), Position.LEFT, player1_name)
        self._player2: Player = Player(Paddle(Position.RIGHT), Position.RIGHT, player2_name)

        self._ball: Ball = Ball()
        self._is_run = False
        self._keys: set = set()

        self._start_date: dt = timezone.now()
        self._end_date: dt = None
        self._last_scored_time: dt = None
        self._rally_count_list: list = []

    async def start_game(self) -> None:
        """매치 시작 후 1초당 60프레임으로 클라이언트에게 현재 상태 전송"""
        for _ in range(300):
            self.local_move_paddles()
            await self.send_data()

        self.is_run = True
        rally_cnt: int = 0
        while self.is_run:
            self.ball.move_pos()
            self.local_move_paddles()

            # 벽 충돌
            if self.ball.is_colliding_with_wall():
                self.ball.bounce_off_wall()

            # 패들 충돌
            if self.ball.is_collides_with_paddle(self.player1.paddle):
                print("left --------- paddle reflect!")
                rally_cnt += self.handle_paddle_collision(self.player1, self.player2)
            if self.ball.is_collides_with_paddle(self.player2.paddle):
                print("right ---------- paddle reflect!")
                rally_cnt += self.handle_paddle_collision(self.player2, self.player1)

            # 오른쪽 득점
            if self.is_player2_score():
                print("player2 win!")
                self._rally_count_list.append(rally_cnt)
                rally_cnt = self.handle_scoring(self.player2, self.player1)

            # 왼쪽 득점
            if self.is_player1_score():
                print("player1 win!")
                self._rally_count_list.append(rally_cnt)
                rally_cnt = self.handle_scoring(self.player1, self.player2)

            if self.TOTAL_SCORE in (self.player1.score_point, self.player2.score_point):
                await self.end_game()
            else:
                await self.send_data()

    async def send_data(self) -> None:
        data = {
            "ball": self.ball.get_stat_data(),
            "paddle1": {"x": self.player1.paddle.x, "y": self.player1.paddle.y},
            "paddle2": {"x": self.player2.paddle.x, "y": self.player2.paddle.y},
            "score": {
                "player1": self.player1.score_point,
                "player2": self.player2.score_point,
                "latest": 1,
            },
        }
        await self.socket.send(
            text_data=json.dumps(
                {
                    "type": "game",
                    "subtype": "match_run",
                    "message": "local match running!",
                    "match_id": 1,
                    "data": data,
                }
            )
        )
        # FPS 설정 (60프레임)
        await asyncio.sleep(1 / 60)

    async def end_game(self) -> None:
        self.is_run = False
        self._end_date = timezone.now()

        data = {
            "date": self._start_date.strftime("%Y-%m-%d"),
            "play_time": self.get_play_time(),
            "rally": self.get_rally_cnt_stat(),
            "max_ball_speed": self.ball.get_max_speed_stat(),
            "player1": self.player1.get_match_stat(),
            "player2": self.player2.get_match_stat(),
            "graph": {
                "player1": self.player1.get_graph_stat(),
                "player2": self.player2.get_graph_stat(),
            },
        }
        print(data)

        await self.socket.send(
            text_data=json.dumps(
                {
                    "type": "game",
                    "subtype": "match_end",
                    "message": "local match end!",
                    "match_id": 1,
                    "data": data,
                }
            )
        )

    def handle_paddle_collision(self, owner: Player, other: Player) -> int:
        self.ball.increase_speed()
        self.ball.bounce_off_paddle(owner.paddle)
        owner.update_attack_type(self.ball.y)
        other.update_attack_pos(self.ball.y)

        return 1

    def handle_scoring(self, winner: Player, other: Player) -> int:
        self.update_score(winner)
        winner.update_attack_type(self.ball.y)
        winner.update_score_pos(self.ball.x, self.ball.y)
        winner.store_key_cnt()
        winner.update_score_trend()

        other.store_key_cnt()
        other.update_score_trend()

        self.reset()
        return 0

    def update_score(self, player) -> None:
        player.increase_score()
        self._last_scored_time = timezone.now()
        self.ball.update_max_speed_list()

    def is_player1_score(self) -> bool:
        return SCREEN_WIDTH / 2 - self.ball.radius <= self.ball.x

    def is_player2_score(self) -> bool:
        return self.ball.x <= -SCREEN_WIDTH / 2 + self.ball.radius

    def local_move_paddles(self) -> None:
        for key in self.keys:
            if key == "KeyW":
                self.player1.paddle.move_paddle_up()
            if key == "KeyS":
                self.player1.paddle.move_paddle_down()
            if key == "ArrowUp":
                self.player2.paddle.move_paddle_up()
            if key == "ArrowDown":
                self.player2.paddle.move_paddle_down()

    def local_update_key_cnt(self, keys: set) -> None:
        for key in keys:
            if key in ["KeyW", "KeyS"]:
                self.player1.increase_key_cnt()
            elif key in ["ArrowUp", "ArrowDown"]:
                self.player2.increase_key_cnt()

    def get_play_time(self) -> str:
        if self._end_date is None:
            self._end_date = dt.datetime.now()

        td: dt.timedelta = self._end_date - self._start_date

        hours, remainder = divmod(td.seconds, 3600)
        minutes, seconds = divmod(remainder, 60)

        play_time = f"{hours:02}:{minutes:02}:{seconds:02}"
        return play_time

    def get_rally_cnt_stat(self) -> list:
        """[최대, 평균, 최소] 공 최대 속도 리스트 반환"""

        max_value, min_value = max(self._rally_count_list), min(self._rally_count_list)
        avg_value = sum(self._rally_count_list) / len(self._rally_count_list)

        return [max_value, avg_value, min_value]

    def reset(self) -> None:
        self.ball.reset()

    @property
    def player1(self) -> Player:
        return self._player1

    @property
    def player2(self) -> Player:
        return self._player2

    @property
    def ball(self) -> Ball:
        return self._ball

    @property
    def is_run(self) -> bool:
        return self._is_run

    @is_run.setter
    def is_run(self, is_run: bool) -> None:
        self._is_run = is_run

    @property
    def keys(self) -> set:
        return self._keys

    @keys.setter
    def keys(self, keys: set) -> None:
        new_down_key: set = keys - self._keys
        self.local_update_key_cnt(new_down_key)
        self._keys = keys
