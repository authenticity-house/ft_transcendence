class AttackStat:
    def __init__(self, paddle_height: float) -> None:
        self._paddle_height: float = paddle_height
        self._paddle_div_four: float = paddle_height / 4

        self._offensive_style: int = 0
        self._defensive_style: int = 0

        self._power_up: int = 0

        self._key_cnt_list: list = []

    def get_attack_type(self) -> int:
        """0: 공격형 / 1: 방어형 / 2: 혼합형 중 하나를 반환"""
        if self._defensive_style < self._offensive_style:
            return 0
        if self._offensive_style < self._defensive_style:
            return 1
        return 2

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

    def store_key_cnt(self, cnt: int) -> None:
        self._key_cnt_list.append(cnt)

    def increase_power_up_cnt(self) -> None:
        self._power_up += 1

    def increase_offensive_style(self) -> None:
        self._offensive_style += 1

    def increase_defensive_style(self) -> None:
        self._defensive_style += 1

    @property
    def power_up(self) -> int:
        return self._power_up
