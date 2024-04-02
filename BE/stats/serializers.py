from rest_framework import serializers

from .models import Match


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        exclude = ["create_date"]
