from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from rest_framework import serializers
from rest_framework.exceptions import NotFound
from rest_framework.fields import IntegerField
from rest_framework.relations import PrimaryKeyRelatedField

from users.models import User
from users.serializers import UserProfileSerializer
from .models import Match, UserStat
from .time_utils import parse_timedelta

attack_type_mapping: dict = {
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

    def update_stat_online_data(self, player_stat: UserStat, data: dict, winner_id: int):
        play_time = parse_timedelta(data.get("play_time", "00:00"))
        rally = data.get("rally", [])
        ball_speed = data.get("max_ball_speed", [])

        update_match_data = {
            "rating": player_stat.rating,
            "play_time": play_time,
            "max_rally_cnt": max(rally) if len(rally) > 0 else 0,
            "max_ball_speed": max(ball_speed) if len(ball_speed) > 0 else 0,
            "is_winner": winner_id == player_stat.user_id,
        }

        player_stat.save(online_match_data=update_match_data)

    def get_additional_data(self, data: dict, player1_pk: int, player2_pk: int) -> dict:
        player1_data: dict = dict(data["player1"])
        player2_data: dict = dict(data["player2"])

        player1_attack_type = attack_type_mapping.get(player1_data.get("attack_type", 2), "TYPE2")
        player2_attack_type = attack_type_mapping.get(player2_data.get("attack_type", 2), "TYPE2")

        player1_score = player1_data.get("score", 0)
        player2_score = player2_data.get("score", 0)

        winner_id = player1_pk if player1_score > player2_score else player2_pk

        # 레이팅 업데이트 관련 로직 추가 필요
        player1_rating = 2001
        player2_rating = 1999

        return {
            "player1_attack_type": player1_attack_type,
            "player2_attack_type": player2_attack_type,
            "player1_rating": player1_rating,
            "player2_rating": player2_rating,
            "winner_id": winner_id,
        }

    @transaction.atomic
    def create(self, validated_data) -> Match:
        data = validated_data.get("data")
        player1_pk = validated_data["player1"].pk
        player2_pk = validated_data["player2"].pk

        try:
            player1_stat, _ = UserStat.objects.get_or_create(user_id=player1_pk)
            player2_stat, _ = UserStat.objects.get_or_create(user_id=player2_pk)
        except ObjectDoesNotExist as exc:
            raise NotFound(
                detail=f"UserStat does not exist: pk={player1_pk} or {player2_pk}"
            ) from exc

        additional_data = self.get_additional_data(data, player1_pk, player2_pk)
        winner_id = additional_data["winner_id"]

        validated_data.update(**additional_data)
        match = Match.objects.create(**validated_data)
        self.update_stat_online_data(player1_stat, data, winner_id)
        self.update_stat_online_data(player2_stat, data, winner_id)

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

        return round(obj.wins_count / (obj.wins_count + obj.losses_count) * 100, 2)

    class Meta:
        model = UserStat
        fields = ["total_count", "wins_count", "losses_count", "winning_rate", "rating"]


class PlayTimeField(serializers.DurationField):
    def to_representation(self, value):
        duration_string = super().to_representation(value)
        duration_string = duration_string.replace(" ", ":")
        components = list(map(int, duration_string.split(":")))

        hours, minutes, seconds = components[-3:]
        if len(components) == 4:
            hours += 24 * components[0]

        formatted_duration = self._format_duration(hours, minutes, seconds)
        return formatted_duration

    def _format_duration(self, hours, minutes, seconds):
        duration_parts = []

        if hours:
            duration_parts.append(f"{hours}h")
        if minutes:
            duration_parts.append(f"{minutes}m")
        if seconds:
            duration_parts.append(f"{seconds}s")

        return " ".join(duration_parts)


class UserStatSerializer(UserStatSummarySerializer):
    nickname = serializers.SerializerMethodField(method_name="get_nickname")
    local_play_time = PlayTimeField(read_only=True)
    online_play_time = PlayTimeField(read_only=True)
    max_rating = serializers.IntegerField(read_only=True)
    max_ball_speed = serializers.FloatField(read_only=True)
    max_rally_cnt = serializers.IntegerField(read_only=True)

    def get_user_pk(self, obj) -> int:
        return obj.user.pk

    def get_nickname(self, obj) -> str:
        return obj.user.nickname

    class Meta(UserStatSummarySerializer.Meta):
        fields = [
            "nickname",
            "local_play_time",
            "online_play_time",
            "max_rating",
            "max_ball_speed",
            "max_rally_cnt",
        ] + UserStatSummarySerializer.Meta.fields
