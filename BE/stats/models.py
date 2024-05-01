from datetime import timedelta
from django.db import models

from users.models import User


class AttackType(models.TextChoices):
    """공격 성향 choices"""

    OFFENSIVE = "TYPE0", "공격형"
    DEFENSIVE = "TYPE1", "방어형"
    MIXED = "TYPE2", "혼합형"

    def map_number_to_attack_type(self, num):
        mapping = {0: self.OFFENSIVE, 1: self.DEFENSIVE, 2: self.MIXED}
        return mapping.get(num, self.MIXED)


class Match(models.Model):
    id = models.BigAutoField(primary_key=True)
    data = models.JSONField(null=False)
    player1 = models.ForeignKey(
        User, on_delete=models.SET_DEFAULT, default=1, related_name="player1_stats"
    )
    player2 = models.ForeignKey(
        User, on_delete=models.SET_DEFAULT, default=1, related_name="player2_stats"
    )
    winner = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=1, related_name="winner")
    player1_rating = models.IntegerField(null=False)
    player2_rating = models.IntegerField(null=False)
    player1_attack_type = models.CharField(max_length=5, choices=AttackType.choices, null=False)
    player2_attack_type = models.CharField(max_length=5, choices=AttackType.choices, null=False)
    create_date = models.DateTimeField(auto_now_add=True)


class UserStat(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    wins_count = models.IntegerField(default=0)
    losses_count = models.IntegerField(default=0)
    rating = models.IntegerField(default=2000)
    local_play_time = models.DurationField(default=timedelta(seconds=0))
    online_play_time = models.DurationField(default=timedelta(seconds=0))
    max_rating = models.IntegerField(default=0)
    max_ball_speed = models.FloatField(default=0)
    max_rally_cnt = models.IntegerField(default=0)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.max_rating = max(self.rating, self.max_rating)
        super().save(*args, **kwargs)
