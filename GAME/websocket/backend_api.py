import aiohttp


async def fetch_nickname(session_id):
    url = f'http://backend:8000/users/session/?sessionid={session_id}'
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return data.get('pk'), data.get('nickname')  # 'nickname' 키로 닉네임 반환
            return None  # 응답 상태 코드가 200이 아닌 경우
