from typing import NamedTuple


class Point(NamedTuple):
    x: float
    y: float


def calculate_bounds_rect(point: Point, width: float, height: float, ball_radius: float) -> list:
    left_x = point.x - (width / 2 + ball_radius)
    right_x = point.x + (width / 2 + ball_radius)
    top_y = point.y + (height / 2 + ball_radius)
    bottom_y = point.y - (height / 2 + ball_radius)
    return [left_x, right_x, top_y, bottom_y]


def line_intersect(seg1_start: Point, seg1_end: Point, seg2_start: Point, seg2_end: Point) -> bool:
    """선분 (seg1_start)-(seg1_end)와 선분 (seg2_start)-(seg2_end)가 교차하는지 확인"""

    def ccw(p1: Point, p2: Point, p3: Point) -> float:
        return p1.x * p2.y + p2.x * p3.y + p3.x * p1.y - p2.x * p1.y - p3.x * p2.y - p1.x * p3.y > 0

    case1: bool = ccw(seg1_start, seg1_end, seg2_start) != ccw(seg1_start, seg1_end, seg2_end)
    case2: bool = ccw(seg1_start, seg1_end, seg2_start) != ccw(seg1_end, seg2_end, seg2_start)

    return case1 and case2
