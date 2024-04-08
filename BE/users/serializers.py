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


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """

    class Meta:
        model = User
        fields = ("pk", "username", "email", "nickname", "provider", "profile_url")
        read_only_fields = ("pk", "username", "provider")


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("pk", "nickname", "profile_url")
        read_only_fields = ("pk", "nickname", "profile_url")
