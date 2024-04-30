from rest_framework import serializers
from rest_framework.fields import IntegerField
from rest_framework.relations import PrimaryKeyRelatedField

from users.models import User
from users.serializers import UserProfileSerializer
from .models import Match

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

        additional_data = {
            "player1_attack_type": player1_attack_type,
            "player2_attack_type": player2_attack_type,
            "player1_rating": player1_rating,
            "player2_rating": player2_rating,
        }

        validated_data.update(**additional_data)
        match = Match.objects.create(**validated_data)
        return match

    class Meta:
        model = Match
        fields = ["player1", "player2", "data"]
