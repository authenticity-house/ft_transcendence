from collections import deque
from typing import Final


class Bracket:
    MATCH_PLAYING: Final = "PONG !"
    MATCH_NOT_START: Final = ""

    def __init__(self, nickname, headcount):
        self._nickname: list[str] = nickname
        self._headcount: int = headcount
        self._bracket: list[list[str]] = []
        self._match_queue = deque()
        self._play_match: list[int] = [1, 0, 0]  # [depth, match, idx]
        self._play_match_nickname: tuple = ("none", "none")

        self.match_making()

    def match_making(self):
        """(임시)매치 메이킹 함수 (대진표 초기화)"""
        # depth 0
        depth0 = []
        start = 0
        if self._headcount % 2 == 1:
            depth0.append([self._nickname[0]])
            start = 1

        for i in range(start, self._headcount, 2):
            p1, p2 = self._nickname[i], self._nickname[i + 1]
            depth0.append([p1, p2])
            self._match_queue.append((1, p1))
            self._match_queue.append((1, p2))
        self._bracket.append(depth0)

        match_cnt = len(depth0)
        # depth 1 ~ N - 1
        while 1 < match_cnt:
            depth = [
                [Bracket.MATCH_NOT_START, Bracket.MATCH_NOT_START] for _ in range(match_cnt // 2)
            ]
            if match_cnt % 2 == 1:
                depth.append([Bracket.MATCH_NOT_START])
            self._bracket.append(depth)
            match_cnt = len(depth)

        # depth N
        self._bracket.append([[Bracket.MATCH_NOT_START]])

        # 처음 depth 부전승 확인
        if start == 1:
            self._match_queue.append((2, self._nickname[0]))
            self._bracket[1][0][0] = self._nickname[0]
            self.update_play_match_idx()

    def get_bracket(self) -> list[list[str]]:
        # 게임 종료
        if self.is_end:
            return self._bracket

        p1_depth, p1_nickname = self._match_queue.popleft()
        p2_depth, p2_nickname = self._match_queue.popleft()

        if p1_depth != p2_depth:
            self._bracket[p1_depth + 1][-1][0] = p1_nickname
            self._match_queue.append((p1_depth + 1, p1_nickname))
            p1_depth, p1_nickname = p2_depth, p2_nickname
            p2_depth, p2_nickname = self._match_queue.popleft()

        self.set_play_match_depth(p2_depth)
        self.set_play_match_str(Bracket.MATCH_PLAYING)
        self._play_match_nickname = (p1_nickname, p2_nickname)

        return self._bracket

    def get_match_nickname(self) -> tuple:
        return self._play_match_nickname

    def set_winner_nickname(self, nickname) -> str:
        depth = self._play_match[0]
        self.set_play_match_str(nickname)

        if self.is_end:
            return

        # 부전승 체크하고 대진표 업데이트 (하드코딩중)
        if self.is_walk_over:
            self._bracket[depth + 1][-1][-1] = nickname

        self.update_play_match_idx()
        self._match_queue.append((depth + 1, nickname))

    def set_play_match_depth(self, depth: int) -> None:
        if self._play_match[0] == depth:
            return
        self._play_match[0] = depth
        self._play_match[1] = 0
        self._play_match[2] = 0

    def update_play_match_idx(self) -> None:
        self._play_match[2] += 1
        if self._play_match[2] == 2:
            self._play_match[1] += 1
            self._play_match[2] = 0

    def set_play_match_str(self, string: str) -> None:
        depth, match_num, idx = self._play_match
        self._bracket[depth][match_num][idx] = string

    @property
    def is_walk_over(self):
        depth, match_num, _ = self._play_match
        return len(self._bracket[depth][match_num]) == 1

    @property
    def is_end(self):
        return self._bracket[-1][0][0] not in [Bracket.MATCH_NOT_START, Bracket.MATCH_PLAYING]
