class AttackStat:
    def __init__(self, paddle_height: float) -> None:
        self._paddle_height: float = paddle_height
        self._paddle_div_six: float = paddle_height / 6

        self._top: int = 0
        self._center: int = 0
        self._bottom: int = 0

        self._power_up: int = 0

    def get_attack_type(self) -> int:
        """0: 공격형 / 1: 방어형 / 2: 혼합형 중 하나를 반환"""

        offensive_style_cnt = self._top + self._bottom
        defensive_style_cnt = self._center

        if defensive_style_cnt < offensive_style_cnt:
            return 0
        if offensive_style_cnt < defensive_style_cnt:
            return 1
        return 2

    def update_pos_cnt(self, paddle_y: float, ball_y: float) -> None:
        # 패들 상단 / 중앙 / 하단 부딪힌 경우 판단
        if paddle_y + self._paddle_div_six < ball_y:
            self.increase_top_pos()
        elif paddle_y - self._paddle_div_six < ball_y:
            self.increase_center_pos()
        else:
            self.increase_bottom_pos()

    def increase_power_up_cnt(self) -> None:
        self._power_up += 1

    def increase_top_pos(self) -> None:
        self._top += 1

    def increase_center_pos(self) -> None:
        self._center += 1

    def increase_bottom_pos(self) -> None:
        self._bottom += 1

    @property
    def power_up(self) -> int:
        return self._power_up
