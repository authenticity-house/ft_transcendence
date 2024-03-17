from typing import Final

import math
import random

from .constants import SCREEN_HEIGHT


class Ball:
    INIT_BALL_SPEED: Final = 0.04
    REFLECT_BALL_SPEED: Final = 0.06
    BALL_RADIUS: Final = 0.04

    def __init__(self, speed: float = REFLECT_BALL_SPEED, radius: float = BALL_RADIUS) -> None:
        self.DEFAULT_BALL_SPEED: Final = speed  # pylint: disable=invalid-name

        self._radius: float = radius
        self._speed: float = speed
        self._x: float = 0
        self._y: float = 0
        self._dx: float = 0
        self._dy: float = 0

        self._max_speed_list: list = []

        self.reset()

    def reset(self) -> None:
        self._x = 0
        self._y = 0
        self._speed = Ball.INIT_BALL_SPEED

        angle: float = math.pi * (3 / 4) + (random.random() * math.pi) / 2
        self._dx = math.cos(angle) * self._speed
        self._dy = math.sin(angle) * self._speed

    def move_pos(self) -> None:
        self._x += self._dx
        self._y += self._dy

        ball_y_bound = self.ball_y_bound
        if ball_y_bound <= self._y:
            self._y = ball_y_bound
        elif self._y <= -ball_y_bound:
            self._y = -ball_y_bound

    def increase_speed(self) -> None:
        if self._speed == Ball.INIT_BALL_SPEED:
            self._speed = self.DEFAULT_BALL_SPEED
            return
        self._speed += 0.005

    def update_direction(self, new_dx: float, new_dy: float) -> None:
        self._dx = new_dx
        self._dy = new_dy

    def update_max_speed_list(self) -> None:
        self._max_speed_list.append(self.speed)

    def get_max_speed_stat(self) -> list:
        """[최대, 평균, 최소] 공 최대 속도 리스트 반환"""

        max_value, min_value = max(self.max_speed_list), min(self.max_speed_list)
        avg_value = sum(self.max_speed_list) / len(self.max_speed_list)

        return [max_value, avg_value, min_value]

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
    def dx(self) -> float:
        return self._dx

    @property
    def dy(self) -> float:
        return self._dy

    @property
    def radius(self) -> float:
        return self._radius

    @property
    def speed(self) -> float:
        return self._speed

    @property
    def max_speed_list(self) -> list:
        return self._max_speed_list

    @property
    def ball_y_bound(self) -> float:
        """실제 멤버변수 getter가 아닌 계산 값 반환"""
        return SCREEN_HEIGHT / 2 - self._radius
