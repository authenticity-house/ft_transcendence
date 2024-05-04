import aiohttp


async def fetch_nickname(session_id):
    url = f"http://backend:8000/users/session/?sessionid={session_id}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return data.get("pk"), data.get("nickname"), data.get("profile_url")
            return None  # 응답 상태 코드가 200이 아닌 경우


async def send_match_result(data, mode="online"):
    url = f"http://backend:8000/stats/match/{mode}/"
    success_status_code = 204 if mode == "local" else 201

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data) as response:
            if response.status != success_status_code:
                try:
                    response_data = await response.json()
                    print(f"Error: {response_data}")
                except aiohttp.ContentTypeError:
                    print(f"Error: Received status code {response.status}")
