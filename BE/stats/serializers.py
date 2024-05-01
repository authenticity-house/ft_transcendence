from rest_framework import serializers
from rest_framework.fields import IntegerField
from rest_framework.relations import PrimaryKeyRelatedField

from users.models import User
from users.serializers import UserProfileSerializer
from .models import Match, UserStat

attack_type_mapping = {
    0: "TYPE0",
    1: "TYPE1",
    2: "TYPE2",
}


class MatchListSerializer(serializers.ModelSerializer):
    player1 = UserProfileSerializer()
    player2 = UserProfileSerializer()
    data = serializers.JSONField()
    winner_id = IntegerField(read_only=True)

    class Meta:
        model = Match
        fields = ["player1", "player2", "data", "winner_id"]


class MatchSerializer(serializers.ModelSerializer):
    player1 = PrimaryKeyRelatedField(queryset=User.objects.all())
    player2 = PrimaryKeyRelatedField(queryset=User.objects.all())
    data = serializers.JSONField()

    def create(self, validated_data) -> Match:
        data = validated_data.get("data")
        player1_data = data.get("player1")
        player2_data = data.get("player2")

        player1_attack_type = attack_type_mapping.get(player1_data.get("attack_type", 2), "TYPE2")
        player2_attack_type = attack_type_mapping.get(player2_data.get("attack_type", 2), "TYPE2")

        player1_rating = 2001
        player2_rating = 2002

        player1_score = player1_data.get("score", 0)
        player2_score = player2_data.get("score", 0)

        winner_id = (
            validated_data["player1"].pk
            if player1_score > player2_score
            else validated_data["player2"].pk
        )

        additional_data = {
            "player1_attack_type": player1_attack_type,
            "player2_attack_type": player2_attack_type,
            "player1_rating": player1_rating,
            "player2_rating": player2_rating,
            "winner_id": winner_id,
        }

        validated_data.update(**additional_data)
        match = Match.objects.create(**validated_data)
        return match

    class Meta:
        model = Match
        fields = ["player1", "player2", "data"]


class UserStatSummarySerializer(serializers.ModelSerializer):
    total_count = serializers.SerializerMethodField(method_name="get_total_count")
    winning_rate = serializers.SerializerMethodField(method_name="get_winning_rate")
    wins_count = IntegerField(read_only=True)
    losses_count = IntegerField(read_only=True)
    rating = IntegerField(read_only=True)

    def get_total_count(self, obj) -> int:
        return obj.wins_count + obj.losses_count

    def get_winning_rate(self, obj) -> float:
        if obj.wins_count + obj.losses_count == 0:
            return 0

        return round(obj.wins_count / (obj.wins_count + obj.losses_count), 2)

    class Meta:
        model = UserStat
        fields = ["total_count", "wins_count", "losses_count", "winning_rate", "rating"]
