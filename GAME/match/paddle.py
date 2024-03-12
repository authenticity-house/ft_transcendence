from typing import Final

from .ball import Ball
from .constants import SCREEN_WIDTH, SCREEN_HEIGHT, Position


def calculate_bounds_rect(x: float, y: float, width: float, height: float) -> list:
    left_x = x - width / 2
    right_x = x + width / 2
    top_y = y + height / 2
    bottom_y = y - height / 2
    return [left_x, right_x, top_y, bottom_y]


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
        LEFT, RIGHT, TOP, BOTTOM = 0, 1, 2, 3  # pylint: disable=invalid-name

        ball_bounds: list = calculate_bounds_circle(ball.x, ball.y, ball.radius)
        paddle_bounds: list = calculate_bounds_rect(self.x, self.y, self._width, self._height)

        if not (
            ball_bounds[LEFT] <= paddle_bounds[RIGHT] <= ball_bounds[RIGHT]
            or ball_bounds[LEFT] <= paddle_bounds[LEFT] <= ball_bounds[RIGHT]
        ):
            return False

        if paddle_bounds[TOP] < ball_bounds[BOTTOM] or ball_bounds[TOP] < paddle_bounds[BOTTOM]:
            return False

        return (ball.dx < 0) == (self.pos < 0)

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
