from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data) -> User:
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = ["password", "username", "email", "nickname"]


class CustomRegisterSerializer(RegisterSerializer):  # pylint: disable=abstract-method
    nickname = serializers.CharField(min_length=1, max_length=12)

    def custom_signup(self, request, user):
        user.nickname = self.data.get("nickname")
        user.save()
