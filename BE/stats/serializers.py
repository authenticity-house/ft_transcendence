from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from users.models import User
from .models import Match

attack_type_mapping = {
    0: "TYPE0",
    1: "TYPE1",
    2: "TYPE2",
}


class MatchSerializer(serializers.ModelSerializer):
    player1_id = PrimaryKeyRelatedField(queryset=User.objects.all())
    player2_id = PrimaryKeyRelatedField(queryset=User.objects.all())
    data = serializers.JSONField()

    def create(self, validated_data) -> Match:
        print(validated_data)
        data = validated_data.get("data")
        player1 = data.get("player1")
        player2 = data.get("player2")

        player1_attack_type = attack_type_mapping[player1.get("attack_type", 2)]
        player2_attack_type = attack_type_mapping[player2.get("attack_type", 2)]

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
        fields = ["player1_id", "player2_id", "data"]
