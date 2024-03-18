from typing import Final

from .ball import Ball
from .constants import SCREEN_WIDTH, SCREEN_HEIGHT, Position


def calculate_bounds_rect(
    x: float, y: float, width: float, height: float, ball_radius: float
) -> list:
    left_x = x - (width / 2 + ball_radius)
    right_x = x + (width / 2 + ball_radius)
    top_y = y + (height / 2 + ball_radius)
    bottom_y = y - (height / 2 + ball_radius)
    return [left_x, right_x, top_y, bottom_y]


def line_intersect(
    x1: float, y1: float, x2: float, y2: float, x3: float, y3: float, x4: float, y4: float
) -> bool:
    """선분 (x1, y1)-(x2, y2)와 선분 (x3, y3)-(x4, y4)가 교차하는지 확인"""

    def ccw(x1: float, y1: float, x2: float, y2: float, x3: float, y3: float) -> float:
        return x1 * y2 + x2 * y3 + x3 * y1 - x2 * y1 - x3 * y2 - x1 * y3 > 0

    case1: bool = ccw(x1, y1, x2, y2, x3, y3) != ccw(x1, y1, x2, y2, x4, y4)
    case2: bool = ccw(x1, y1, x3, y3, x4, y4) != ccw(x2, y2, x3, y3, x4, y4)

    return case1 and case2


def calculate_bounds_circle(x: float, y: float, radius: float) -> list:
    left_x: float = x - radius
    right_x: float = x + radius
    top_y: float = y + radius
    bottom_y: float = y - radius
    return [left_x, right_x, top_y, bottom_y]


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
        # 패들 테두리 좌표
        paddle_bounds: list = calculate_bounds_rect(self.x, self.y, self._width, self._height, ball.radius)

        for i in range(2):
            if line_intersect(
                prev_ball_x,
                prev_ball_y,
                ball.x,
                ball.y,
                paddle_bounds[i],
                paddle_bounds[2],
                paddle_bounds[i],
                paddle_bounds[3],
            ):
                return True

        for i in range(2, 4):
            if line_intersect(
                prev_ball_x,
                prev_ball_y,
                ball.x,
                ball.y,
                paddle_bounds[0],
                paddle_bounds[i],
                paddle_bounds[1],
                paddle_bounds[i],
            ):
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
