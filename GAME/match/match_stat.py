import datetime as dt
from django.utils import timezone


class MatchStat:
    def __init__(self):
        self._start_date: dt = timezone.now()
        self._end_date: dt = None

        self._rally_count_list: list = []
