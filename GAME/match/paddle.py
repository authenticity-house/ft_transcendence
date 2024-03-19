from typing import Final

from .ball import Ball
from .constants import SCREEN_WIDTH, SCREEN_HEIGHT, Position
from .coor_util import Point, calculate_bounds_rect, line_intersect


class Paddle:
    PADDLE_SPEED: Final = 0.05
    PADDLE_DEFAULT_WIDTH: Final = 0.1
    PADDLE_DEFAULT_HEIGHT: Final = 0.5

    def __init__(
        self,
        pos: Position,
        speed: float = PADDLE_SPEED,
        width: float = PADDLE_DEFAULT_WIDTH,
        height: float = PADDLE_DEFAULT_HEIGHT,
    ) -> None:
        self._pos: Position = pos
        self._speed: float = speed
        self._width: float = width
        self._height: float = height
        self._x: float = SCREEN_WIDTH / 2 * 0.933 * pos.value
        self._y: float = 0

        self.reset()

    def reset(self) -> None:
        self._y = 0

    def move_paddle_up(self) -> None:
        self._y += self._speed
        if SCREEN_HEIGHT / 2 < self._y + self._height / 2:
            self._y = SCREEN_HEIGHT / 2 - self._height / 2

    def move_paddle_down(self) -> None:
        self._y -= self._speed
        if self._y - self._height / 2 < -1 * SCREEN_HEIGHT / 2:
            self._y = -1 * (SCREEN_HEIGHT / 2 - self._height / 2)

    def is_collides_with_ball(self, ball: Ball) -> bool:
        """공과 패들의 충돌 여부를 반환"""

        # 공이 부딪히는 방향 확인
        if ball.dx * self.pos < 0:
            return False

        # 공의 이전 좌표
        prev_ball_x, prev_ball_y = ball.x - ball.dx, ball.y - ball.dy
        seg1_start = Point(prev_ball_x, prev_ball_y)
        seg1_end = Point(ball.x, ball.y)

        # 패들 테두리 좌표
        paddle_bounds: list = calculate_bounds_rect(
            Point(self.x, self.y), self._width, self._height, ball.radius
        )

        for i in range(2):
            seg2_start = Point(paddle_bounds[i], paddle_bounds[2])
            seg2_end = Point(paddle_bounds[i], paddle_bounds[3])
            if line_intersect(seg1_start, seg1_end, seg2_start, seg2_end):
                return True

        for i in range(2, 4):
            seg2_start = Point(paddle_bounds[0], paddle_bounds[i])
            seg2_end = Point(paddle_bounds[1], paddle_bounds[i])
            if line_intersect(seg1_start, seg1_end, seg2_start, seg2_end):
                return True

        return False

    @property
    def x(self) -> float:
        return self._x

    @x.setter
    def x(self, x) -> None:
        self._x = x

    @property
    def y(self) -> float:
        return self._y

    @y.setter
    def y(self, y) -> None:
        self._y = y

    @property
    def width(self) -> float:
        return self._width

    @property
    def height(self) -> float:
        return self._height

    @property
    def pos(self) -> int:
        return self._pos.value
