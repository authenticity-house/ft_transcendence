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
