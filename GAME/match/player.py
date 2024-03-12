from .paddle import Paddle
from .attack_stat import AttackStat
from .constants import Position


class Player:
    def __init__(self, paddle: Paddle, pos: Position, name: str, score: int = 0) -> None:
        self._paddle: Paddle = paddle
        self._pos: Position = pos
        self._name: str = name
        self._score: int = score
        self._key_cnt: int = 0
        self._attack_stat: AttackStat = AttackStat(paddle.height)

    def get_match_stat(self) -> dict[str, str | int]:
        stat_data: dict[str, str | int] = {
            "nickname": self.name,
            "score": self.score,
            "attack_type": self._attack_stat.get_attack_type(),
            "power_up_cnt": self._attack_stat.power_up,
            "key_cnt": self._attack_stat.get_key_cnt_avg(),
            "attack_pos": 3,
        }

        return stat_data

    def store_key_cnt(self) -> None:
        self._attack_stat.store_key_cnt(self._key_cnt)
        self._key_cnt = 0

    def increase_score(self) -> None:
        self._score += 1

    def increase_key_cnt(self) -> None:
        self._key_cnt += 1

    @property
    def paddle(self) -> Paddle:
        return self._paddle

    @property
    def pos(self) -> int:
        return self._pos.value

    @property
    def name(self) -> str:
        return self._name

    @property
    def score(self) -> int:
        return self._score
