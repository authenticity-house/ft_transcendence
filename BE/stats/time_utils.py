from datetime import timedelta

from rest_framework.exceptions import ParseError


def parse_timedelta(time_str):
    try:
        parts = time_str.split(":")
        if len(parts) == 3:
            hours, minutes, seconds = map(int, parts)
            return timedelta(hours=hours, minutes=minutes, seconds=seconds)
        if len(parts) == 2:
            hours, minutes = map(int, parts)
            return timedelta(hours=hours, minutes=minutes)
    except Exception as e:  # pylint: disable=broad-exception-caught
        raise ParseError(detail=str(e)) from e

    return None
