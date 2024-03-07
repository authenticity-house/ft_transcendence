from django.http import HttpResponse
from .match_manager import MatchManager


def start(request):
    # 가로: 6, 세로: 4 의 화면에서 좌표를 화면 중앙으로 생각
    match_manager = MatchManager()
    match_manager.start_game()

    return HttpResponse("임시 반환값")
