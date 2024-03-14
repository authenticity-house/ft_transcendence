class Score:
    def __init__(self) -> None:
        self._point: int = 0
        self._score_trend: list = [0]
        self._score_pos: list[tuple] = []

    def get_score_stat(self) -> dict[str, list]:
        stat_data: dict[str, list] = {
            "score_trend": self._score_trend,
            "score_pos": self._score_pos,
        }

        return stat_data

    def increase_point(self) -> None:
        self._point += 1

    def store_score_trend(self) -> None:
        self._score_trend.append(self.point)

    def store_score_pos(self, ball_x: float, ball_y: float):
        self._score_pos.append((round(ball_x, 3), round(ball_y, 3)))

    @property
    def point(self) -> int:
        return self._point
