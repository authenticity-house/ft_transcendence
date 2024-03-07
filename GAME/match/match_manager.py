import asyncio
import math
import json
from channels.generic.websocket import AsyncWebsocketConsumer

from .player import Player
from .paddle import Paddle
from .ball import Ball
from .constants import Position, SCREEN_HEIGHT, SCREEN_WIDTH


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

    async def start_game(self) -> None:
        self.is_run = True
        while self.is_run:
            # print("check!!")
            self.ball.move_pos()

            # 벽 충돌
            if self.is_ball_colliding_with_wall():
                self.ball.update_direction(self.ball.dx, -self.ball.dy)

            # 패들 충돌
            if self.player1.paddle.is_collides_with_ball(self.ball):
                print("left --------- paddle reflect!")
                self.bounce_ball_off_paddle(self.player1.paddle)
            if self.player2.paddle.is_collides_with_ball(self.ball):
                print("right ---------- paddle reflect!")
                self.bounce_ball_off_paddle(self.player2.paddle)

            # 오른쪽 득점
            if self.is_player2_scored():
                print("player2 win!")
                self.update_score(self.player2)
                self.reset()

            # 왼쪽 득점
            if self.is_player1_scored():
                print("player1 win!")
                self.update_score(self.player1)
                self.reset()

            if self.TOTAL_SCORE in (self.player1.score, self.player2.score):
                self.end_game()

            await self.socket.send(
                text_data=json.dumps(
                    {
                        "ball": {"x": self.ball.x, "y": self.ball.y},
                        "paddle1": {"x": self.player1.paddle.x, "y": self.player1.paddle.y},
                        "paddle2": {"x": self.player2.paddle.x, "y": self.player2.paddle.y},
                        "score": {"player1": self.player1.score, "player2": self.player2.score},
                        "message": "data",
                    }
                )
            )
            # FPS 설정 (60프레임)
            await asyncio.sleep(1 / 60)

    def end_game(self) -> None:
        self.is_run = True

    def update_score(self, player) -> None:
        player.increase_score()

    def is_ball_colliding_with_wall(self) -> bool:
        """벽 충돌 확인"""
        half_width = SCREEN_HEIGHT / 2
        return (
            self.ball.y <= -half_width + self.ball.radius
            or half_width - self.ball.radius <= self.ball.y
        )

    def is_player1_scored(self) -> bool:
        return SCREEN_WIDTH / 2 - self.ball.radius <= self.ball.x

    def is_player2_scored(self) -> bool:
        return self.ball.x <= -SCREEN_WIDTH / 2 + self.ball.radius

    def calculate_reflection(self, paddle: Paddle) -> float:
        relative_intersect_y = self.ball.y - paddle.y
        normalized_relative_intersection_y = relative_intersect_y / (paddle.width / 2)
        bounce_angle = normalized_relative_intersection_y * (math.pi / 2.5)
        return bounce_angle

    def bounce_ball_off_paddle(self, paddle: Paddle) -> None:

        angle: float = self.calculate_reflection(paddle)

        dx: float = math.cos(angle) * self.ball.speed * paddle.pos
        dy: float = math.sin(angle) * self.ball.speed
        print(angle, dx, dy)
        self.ball.update_direction(dx, dy)

    async def local_move_paddles(self, keys: list) -> None:
        for key in keys:
            if key == "w":
                self.player1.paddle.move_paddle_up()
            if key == "s":
                self.player1.paddle.move_paddle_down()
            if key == "ArrowUp":
                self.player2.paddle.move_paddle_up()
            if key == "ArrowDown":
                self.player2.paddle.move_paddle_down()

    def reset(self):
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
    def is_run(self, is_run) -> None:
        self._is_run = is_run
