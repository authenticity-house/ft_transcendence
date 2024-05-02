from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer

from backend.settings import SERVER_IP, SERVER_PORT

from .models import User


def transform_profile_url(profile_url):
    return f"http://{SERVER_IP}:{SERVER_PORT}{profile_url}"


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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(data)
        if data["provider"] == "PONG":
            data['profile_url'] = transform_profile_url(data['profile_url'])
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("pk", "nickname", "profile_url", "provider")
        read_only_fields = ("pk", "nickname", "profile_url", "provider")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data["provider"] == "PONG":
            data['profile_url'] = transform_profile_url(data['profile_url'])
        data.pop("provider")
        return data
