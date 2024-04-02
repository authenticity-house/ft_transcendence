from django.db import models
from django.contrib.auth.models import AbstractUser


class Provider(models.TextChoices):
    """정보 제공자 choices"""

    PONG = "PONG", "Pong"
    FT = "FT", "42"


class User(AbstractUser):
    """유저 테이블"""

    nickname = models.CharField(max_length=12, default="", null=False, unique=True)
    provider = models.CharField(
        max_length=4, choices=Provider.choices, default=Provider.PONG, null=False
    )
    profile_url = models.CharField(max_length=250)
    date_updated = models.DateTimeField(auto_now=True)

    first_name = None
    last_name = None

    REQUIRED_FIELDS = ["email", "nickname", "provider"]

    def __str__(self):
        return self.nickname
