import requests


def request_game_session(room_info):
    url = "http://game:8000/online/"
    data = {"info": room_info}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=data, headers=headers).json()
    # 400 예외 처리 추가
    return response["url"]
