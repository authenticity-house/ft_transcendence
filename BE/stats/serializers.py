from rest_framework import serializers

from .models import Match  # , AttackType


class MatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Match
        exclude = ["create_date"]

    # def create(self, validated_data):
    #     validated_data = validated_data["data"]
    #     player1, player2 = validated_data['player1'], validated_data['player2']
    #
    #     player1_attack_type = AttackType.map_number_to_attack_type(player1['attack_type'])
    #     player2_attack_type = AttackType.map_number_to_attack_type(player2['attack_type'])
    #
    #     match_instance = Match.objects.create(
    #         data=validated_data,
    #         player1_rating=player1['score'],
    #         player2_rating=player2['score'],
    #         player1_attack_type=player1_attack_type,
    #         player2_attack_type=player2_attack_type,
    #     )
    #
    #     return match_instance
