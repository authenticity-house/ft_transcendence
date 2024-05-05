from typing import Final

import math
import random

from .coor_util import Point, line_intersect
from .constants import SCREEN_HEIGHT
from .paddle import Paddle
from .player import Player


class Ball:
    INIT_BALL_SPEED: Final = 0.04
    REFLECT_BALL_SPEED: Final = 0.06
    ACCEL_BALL_SPEED: Final = 0.005
    BALL_RADIUS: Final = 0.04

    def __init__(
        self, speed: float = REFLECT_BALL_SPEED, accel_speed: float = ACCEL_BALL_SPEED
    ) -> None:
        self.DEFAULT_BALL_SPEED: Final = speed  # pylint: disable=invalid-name

        self._speed: float = speed
        self._accel_speed: float = accel_speed
        self._x: float = 0
        self._y: float = 0
        self._dx: float = 0
        self._dy: float = 0

        self._power_up = False
        self._before_speed = self._speed

        self._max_speed_list: list = []

        self.reset(1)

    def reset(self, player: int) -> None:
        self._x = 0
        self._y = 0
        self._speed = Ball.INIT_BALL_SPEED
        print(self._speed)

        self._power_up = False
        self._before_speed = self._speed

        if player == 1:
            angle: float = math.pi * (3 / 4) + (random.random() * math.pi) / 2
        else:
            angle: float = math.pi * (7 / 4) + (random.random() * math.pi) / 2
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

    def increase_speed(self, player: Player) -> None:
        if self._speed == Ball.INIT_BALL_SPEED:
            self._speed = self.DEFAULT_BALL_SPEED
            return
        self._speed += self._accel_speed

        paddle = player.paddle

        if paddle.power_up is True:
            player.increase_power_up_cnt()
            if self._power_up is False:
                self._before_speed = self._speed
                self._speed = self._speed * 1.5
                self._power_up = True
            paddle.power_up_off()
        else:
            if self._power_up is True:
                self._speed = self._before_speed
                self._power_up = False

    def update_direction(self, new_dx: float, new_dy: float) -> None:
        self._dx = new_dx
        self._dy = new_dy

    def update_max_speed_list(self) -> None:
        self._max_speed_list.append(self._speed)

    def get_max_speed_stat(self) -> list:
        """[최대, 평균, 최소] 공 최대 속도 리스트 반환"""

        max_value, min_value = max(self.max_speed_list), min(self.max_speed_list)
        avg_value = sum(self.max_speed_list) / len(self.max_speed_list)

        return [max_value, avg_value, min_value]

    def calculate_reflection(self, paddle: Paddle) -> float:
        relative_intersect_y = self._y - paddle.y
        normalized_relative_intersection_y = relative_intersect_y / (paddle.height / 2)
        bounce_angle = normalized_relative_intersection_y * (math.pi / 3)
        return bounce_angle

    def bounce_off_paddle(self, paddle: Paddle) -> None:
        angle: float = self.calculate_reflection(paddle)

        dx: float = math.cos(angle) * self._speed * paddle.pos * -1
        dy: float = math.sin(angle) * self._speed
        self.update_direction(dx, dy)

    def bounce_off_wall(self) -> None:
        self.update_direction(self._dx, -self._dy)

    def is_colliding_with_wall(self) -> bool:
        """벽과 공의 충돌 여부 확인"""
        ball_y_bound = self.ball_y_bound

        return (self._y <= -ball_y_bound and self._dy < 0) or (
            ball_y_bound <= self._y and 0 < self._dy
        )

    def is_collides_with_paddle(self, paddle: Paddle) -> bool:
        """공과 패들의 충돌 여부를 반환"""

        # 공이 부딪히는 방향 확인
        if self._dx * paddle.pos < 0:
            return False

        # 공의 이전 좌표
        seg1_start = Point(self.prev_x, self.prev_y)
        seg1_end = Point(self.x, self.y)

        # 패들 테두리 좌표
        edges: list = paddle.get_edges(self.radius)

        for i in range(2):
            seg2_start = Point(edges[i], edges[2])
            seg2_end = Point(edges[i], edges[3])
            if line_intersect(seg1_start, seg1_end, seg2_start, seg2_end):
                return True

        for i in range(2, 4):
            seg2_start = Point(edges[0], edges[i])
            seg2_end = Point(edges[1], edges[i])
            if line_intersect(seg1_start, seg1_end, seg2_start, seg2_end):
                return True

        return False

    def get_stat_data(self) -> dict[str, str | float]:
        return {"status": "in", "x": self._x, "y": self._y, "radius": Ball.BALL_RADIUS}

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
    def prev_x(self) -> float:
        """실제 멤버 변수가 아닌 계산 값 반환"""
        return self._x - self._dx

    @property
    def prev_y(self) -> float:
        """실제 멤버 변수가 아닌 계산 값 반환"""
        return self._y - self._dy

    @property
    def radius(self) -> float:
        return Ball.BALL_RADIUS

    @property
    def max_speed_list(self) -> list:
        return self._max_speed_list

    @property
    def ball_y_bound(self) -> float:
        """실제 멤버 변수가 아닌 계산 값 반환"""
        return SCREEN_HEIGHT / 2 - self.radius
