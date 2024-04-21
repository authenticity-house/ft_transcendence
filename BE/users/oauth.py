import requests
from requests.exceptions import RequestException

from backend.settings import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

from .models import User


def get_access_token(code):
    if not all([CLIENT_ID, CLIENT_SECRET, REDIRECT_URI]):
        raise ValueError("Missing environment variables for OAuth configuration")

    url = "https://api.intra.42.fr/oauth/token"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "scope": "public",
    }

    try:
        response = requests.post(url, data=data, timeout=5)
    except RequestException as e:
        raise Exception(  # pylint: disable=broad-exception-raised
            "Failed to communicate with OAuth server"
        ) from e

    if response.status_code == 200:
        token_data = response.json()
        return token_data.get("access_token")

    return None


def get_user_data(access_token):
    url = "https://api.intra.42.fr/v2/me"
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.get(url, headers=headers, timeout=5)
    except RequestException as e:
        raise Exception(  # pylint: disable=broad-exception-raised
            "Failed to communicate with OAuth server"
        ) from e

    if response.status_code == 200:
        data = response.json()
        return {
            "username": data.get("id"),
            "nickname": data.get("login"),
            "email": data.get("email"),
            "profile_url": data.get("image", {}).get("link"),
        }
    return None


def generate_unique_nickname(nickname):
    max_length = 12
    new_nickname = nickname[:max_length]
    counter = 1
    while User.objects.filter(nickname=new_nickname).exists():
        counter_str = f"_{counter}"
        base_nickname_length = max_length - len(counter_str)
        base_nickname = nickname[:base_nickname_length]
        new_nickname = f"{base_nickname}{counter_str}"
        counter += 1
    return new_nickname


def get_or_create_user(data):
    user, created = User.objects.get_or_create(
        email=data["email"],
        defaults={
            "username": data["username"],
            "nickname": generate_unique_nickname(data["nickname"]),
            "profile_url": data.get("profile_url", "/profile/default.png"),
            "provider": data.get("provider", "42"),
        },
    )
    if created:
        user.set_unusable_password()
        user.save()
    return user, created
