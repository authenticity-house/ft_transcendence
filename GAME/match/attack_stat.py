from typing import Final

from .constants import SCREEN_HEIGHT


class AttackStat:
    SCREEN_DIV_SIX: Final = SCREEN_HEIGHT / 6

    def __init__(self, paddle_height: float) -> None:
        self._paddle_div_four: float = paddle_height / 4

        self._offensive_style: int = 0
        self._defensive_style: int = 0

        self._power_up: int = 0
        self._key_cnt_list: list = []
        self._attack_pos: dict[str, int] = {"top": 0, "mid": 0, "bottom": 0}

    def get_attack_type(self) -> int:
        """0: 공격형 / 1: 방어형 / 2: 혼합형 중 하나를 반환"""
        if self._defensive_style < self._offensive_style:
            return 0
        if self._offensive_style < self._defensive_style:
            return 1
        return 2

    def get_attack_pos(self) -> int:
        """
        0: 중앙 / 1: 상단 / 2: 하단 / 3: 전체 중 하나를 반환
        전체: 중앙 == 상단 == 하단 /  상단 == 하단 > 중앙
        중앙: 중앙이 가장 큰 경우
        상단: 상단이 가장 큰 경우 / 중앙 == 상단 > 하단
        하단: 하단이 가장 큰 경우 / 중앙 == 하단 > 상단
        """
        pos_idx: dict[str, int] = {"mid": 0, "top": 1, "bottom": 2}

        attack_pos: dict[str, int] = self._attack_pos
        max_value = max(attack_pos.values())
        key_max: list = [pos_idx[key] for key, value in attack_pos.items() if value == max_value]

        key_max_len = len(key_max)
        if key_max_len == 1:
            return key_max[0]
        if key_max_len == 3 or 0 not in key_max:
            return 3
        return max(key_max)

    def get_key_cnt_avg(self) -> float:
        cnt = len(self._key_cnt_list)
        if cnt == 0:
            return 0
        return sum(self._key_cnt_list) / cnt

    def update_attack_type(self, paddle_y: float, ball_y: float) -> None:
        # 패들 상단(1/4) / 중앙(1/2) / 하단(1/4) 부딪힌 경우 판단
        if paddle_y - self._paddle_div_four <= ball_y <= paddle_y + self._paddle_div_four:
            self.increase_defensive_style()
        else:
            self.increase_offensive_style()

    def update_attack_pos(self, ball_y: float):
        screen_div_six: float = AttackStat.SCREEN_DIV_SIX

        if screen_div_six < ball_y:
            self.increase_attack_pos("top")
        elif -screen_div_six < ball_y:
            self.increase_attack_pos("mid")
        else:
            self.increase_attack_pos("bottom")

    def store_key_cnt(self, cnt: int) -> None:
        self._key_cnt_list.append(cnt)

    def increase_power_up_cnt(self) -> None:
        self._power_up += 1

    def increase_offensive_style(self) -> None:
        self._offensive_style += 1

    def increase_defensive_style(self) -> None:
        self._defensive_style += 1

    def increase_attack_pos(self, key: str) -> None:
        self._attack_pos[key] += 1

    @property
    def power_up(self) -> int:
        return self._power_up
