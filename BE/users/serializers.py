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


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("pk", "nickname", "profile_url")
        read_only_fields = ("pk", "nickname", "profile_url")


class UpdateUserSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(required=False, min_length=2, max_length=12)
    old_password = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["nickname", "password", "old_password"]

    def validate(self, attrs):
        if "nickname" in attrs and ("old_password" in attrs or "password" in attrs):
            raise serializers.ValidationError(
                {"detail": "Nickname and password cannot be changed at the same time."}
            )

        if "old_password" in attrs and "password" not in attrs:
            raise serializers.ValidationError(
                {"detail": "Please enter the password you want to change."}
            )

        if "password" in attrs:
            if "old_password" not in attrs:
                raise serializers.ValidationError(
                    {"detail": "Please enter your existing password."}
                )

            user = self.instance
            if not user.check_password(attrs["old_password"]):
                raise serializers.ValidationError({"detail": "The existing password is incorrect."})

        return super().validate(attrs)

    def update(self, instance, validated_data):
        detail = {}

        if "nickname" in validated_data:
            nickname = validated_data.get("nickname", instance.nickname)
            instance.nickname = nickname
            detail = {"nickname": nickname}

        if "password" in validated_data:
            password = validated_data.pop("password")
            instance.set_password(password)
            detail = {"password": "Password changed successfully."}

        instance.save()
        return detail
