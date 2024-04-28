import requests


def request_game_session(room_info):
    url = 'http://game:8000/online/'
    data = {'test_key': 'hello game!'}
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=data, headers=headers).json()
    return response["url"]
