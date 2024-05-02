from datetime import timedelta


def parse_timedelta(time_str):
    parts = time_str.split(":")
    if len(parts) == 3:
        hours, minutes, seconds = map(int, parts)
        return timedelta(hours=hours, minutes=minutes, seconds=seconds)
    if len(parts) == 2:
        hours, minutes = map(int, parts)
        return timedelta(hours=hours, minutes=minutes)

    return timedelta(seconds=0)
