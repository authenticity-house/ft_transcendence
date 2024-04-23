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
    profile_url = models.CharField(max_length=250, null=False, default="/image/default-profile.png")
    date_updated = models.DateTimeField(auto_now=True)
    friends = models.ManyToManyField(
        "self", through="Friendship", through_fields=("user1", "user2"), blank=True
    )

    first_name = None
    last_name = None

    REQUIRED_FIELDS = ["email", "nickname", "provider"]

    def __str__(self):
        return self.nickname


class Friendship(models.Model):
    user1 = models.ForeignKey(User, related_name="user1_friendship", on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name="user2_friendship", on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)
