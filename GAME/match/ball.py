import math
import random


class Ball:
    BALL_SPEED: float = 0.06
    BALL_RADIUS: float = 0.04

    def __init__(self, speed: float = BALL_SPEED, radius: float = BALL_RADIUS) -> None:
        self._radius: float = radius
        self._speed: float = speed
        self._x: float = 0
        self._y: float = 0
        self._dx: float = 0
        self._dy: float = 0

        self.reset()

    def reset(self) -> None:
        self._x = 0
        self._y = 0

        angle: float = math.pi / 2 + random.random() * math.pi
        self._dx = math.cos(angle) * self._speed
        self._dy = math.sin(angle) * self._speed

    def move_pos(self) -> None:
        self._x += self._dx
        self._y += self._dy

    def update_direction(self, new_dx: float, new_dy: float) -> None:
        self._dx = new_dx
        self._dy = new_dy

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
