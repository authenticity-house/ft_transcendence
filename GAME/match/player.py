from .paddle import Paddle
from .constants import Position


class Player:
    def __init__(self, paddle: Paddle, pos: Position, name: str, score: int = 0) -> None:
        self._paddle = paddle
        self._pos = pos
        self._name = name
        self._score = score

    def increase_score(self) -> None:
        self._score += 1

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
