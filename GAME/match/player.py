from .paddle import Paddle
from .score import Score
from .attack_stat import AttackStat
from .constants import Position


class Player:
    def __init__(self, paddle: Paddle, pos: Position, name: str) -> None:
        self._paddle: Paddle = paddle
        self._pos: Position = pos
        self._name: str = name
        self._key_cnt: int = 0
        self._score: Score = Score()
        self._attack_stat: AttackStat = AttackStat(paddle.height)

    def get_match_stat(self) -> dict[str, str | int]:
        stat_data: dict[str, str | int] = {
            "nickname": self.name,
            "score": self.score_point,
            "attack_type": self._attack_stat.get_attack_type(),
            "power_up_cnt": self._attack_stat.power_up,
            "key_cnt": self._attack_stat.get_key_cnt_avg(),
            "attack_pos": self._attack_stat.get_attack_pos(),
        }

        return stat_data

    def get_graph_stat(self) -> dict[str, list]:
        return self._score.get_score_stat()

    def update_attack_type(self, ball_y: float) -> None:
        self._attack_stat.update_attack_type(self._paddle.y, ball_y)

    def update_attack_pos(self, ball_y: float) -> None:
        self._attack_stat.update_attack_pos(ball_y)

    def store_key_cnt(self) -> None:
        self._attack_stat.store_key_cnt(self._key_cnt)
        self._key_cnt = 0

    def update_score_trend(self) -> None:
        self._score.store_score_trend()

    def update_score_pos(self, ball_x: float, ball_y: float) -> None:
        self._score.store_score_pos(ball_x, ball_y)

    def increase_score(self) -> None:
        self._score.increase_point()

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
    def score_point(self) -> int:
        return self._score.point
