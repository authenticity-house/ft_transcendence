from rest_framework import serializers
from .room_manager import RoomManager


class RoomSerializer(serializers.Serializer):
    room_name = serializers.CharField(max_length=255)
    battle_mode = serializers.IntegerField()
    headcount = serializers.IntegerField()
    total_score = serializers.IntegerField()
    level = serializers.IntegerField()
    color = serializers.DictField(child=serializers.CharField())

    def create(self, validated_data):
        RoomManager.add_room(validated_data)
        return validated_data
