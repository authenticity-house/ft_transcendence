import math


def get_update_rating(rating_self: int, rating_opponent: int, is_winner: int, k=32) -> int:
    expected = _expected_score(rating_self, rating_opponent)
    new_rating = rating_self + k * (is_winner - expected)
    print(is_winner)
    return round(new_rating)


def _expected_score(rating_self: int, rating_opponent: int):
    return 1 / (1 + math.pow(10, (rating_opponent - rating_self) / 400))
