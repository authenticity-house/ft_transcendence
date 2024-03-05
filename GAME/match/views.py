from time import sleep
from django.http import HttpResponse
from .ball import Ball


def start(request):
    ball = Ball()

    # 가로: 6, 세로: 4 의 화면에서 좌표를 화면 중앙으로 생각
    while True:
        ball.move_pos()

        # 벽 충돌
        if ball.y <= -2 + ball.radius or 2 - ball.radius <= ball.y:
            ball.update_direction(ball.dx, -ball.dy)

        # (임시) 왼쪽 오른쪽 벽 충돌
        if ball.x <= -3 + ball.radius or 3 - ball.radius <= ball.x:
            ball.update_direction(-ball.dx, ball.dy)

        # FPS 설정 (60프레임)
        sleep(1 / 60)

    return HttpResponse("임시 반환값")
