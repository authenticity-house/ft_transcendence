import requests


def request_game_session(room_info):
    url = "http://game:8000/online/"
    data = {"info": room_info}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=data, headers=headers, timeout=10).json()
    return response["url"]
