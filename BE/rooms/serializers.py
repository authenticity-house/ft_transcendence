from rest_framework import serializers
from rooms.services import RoomManager


class RoomCreateSerializer(serializers.Serializer):
    room_name = serializers.CharField(max_length=255)
    battle_mode = serializers.IntegerField()
    max_headcount = serializers.IntegerField()
    total_score = serializers.IntegerField()
    level = serializers.IntegerField()
    color = serializers.DictField(child=serializers.CharField())

    def create(self, validated_data):
        room_number = RoomManager.add_room(validated_data)
        return room_number

    def update(self, instance, validated_data):
        pass


class RoomListSerializer(serializers.Serializer):
    room_number = serializers.IntegerField()
    room_name = serializers.CharField(max_length=255)
    battle_mode = serializers.IntegerField()
    current_headcount = serializers.IntegerField()
    max_headcount = serializers.IntegerField()
    rating = serializers.IntegerField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass
