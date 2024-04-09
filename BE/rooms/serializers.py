from rest_framework import serializers
from .room_manager import RoomManager


class RoomCreateSerializer(serializers.Serializer):
    room_name = serializers.CharField(max_length=255)
    battle_mode = serializers.IntegerField()
    max_player = serializers.IntegerField()
    total_score = serializers.IntegerField()
    level = serializers.IntegerField()
    color = serializers.DictField(child=serializers.CharField())

    def create(self, validated_data):
        room_number = RoomManager.add_room(validated_data)
        return room_number


class RoomListSerializer(serializers.Serializer):
    room_number = serializers.IntegerField()
    room_name = serializers.CharField(max_length=255)
    battle_mode = serializers.IntegerField()
    max_player = serializers.IntegerField()
