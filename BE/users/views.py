from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound, ParseError, APIException
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from allauth.account.adapter import get_adapter
from allauth.account.utils import send_email_confirmation

from dj_rest_auth.registration.views import RegisterView

from users.models import User
from users.serializers import UserProfileSerializer


class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, *args, **kwargs):
        self.object = confirmation = (  # pylint: disable=attribute-defined-outside-init
            self.get_object()
        )
        confirmation.confirm(self.request)
        # A React Router Route will handle the failure scenario
        return HttpResponseRedirect("/")

    def get_object(self, queryset=None):
        key = self.kwargs["key"]
        email_confirmation = EmailConfirmationHMAC.from_key(key)
        if not email_confirmation:
            if queryset is None:
                queryset = self.get_queryset()
            try:
                email_confirmation = queryset.get(key=key.lower())
            except EmailConfirmation.DoesNotExist:
                # A React Router Route will handle the failure scenario
                return HttpResponseRedirect("/login/failure/")
        return email_confirmation

    def get_queryset(self):
        qs = EmailConfirmation.objects.all_valid()
        qs = qs.select_related("email_address__user")
        return qs


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = self.get_response_data(user)

        # 세션 강제 제거
        get_adapter().unstash_user(request)
        get_adapter().unstash_verified_email(request)
        request.session.pop("account_user", None)
        request.session.pop("account_verified_email", None)

        if data:
            response = Response(
                data,
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        else:
            response = Response(status=status.HTTP_204_NO_CONTENT, headers=headers)

        return response

    def perform_create(self, serializer):
        user = serializer.save(self.request)

        # 이메일 인증 진행
        send_email_confirmation(
            self.request._request, user, signup=True  # pylint: disable=protected-access
        )
        return user


class FriendAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_pk = request.user.pk

        try:
            user_profile = User.objects.get(pk=user_pk)
            serializer = UserProfileSerializer(user_profile.friends.all(), many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"User does not exist: pk={user_pk}") from exc

    def post(self, request):
        user_pk = request.user.pk
        friend_pk = request.data.get("friend_pk")

        try:
            user_profile = User.objects.get(pk=user_pk)
            friend_profile = User.objects.get(pk=friend_pk)

            user_profile.friends.add(friend_profile)
            return Response(
                {"detail": "success"},
                status=status.HTTP_201_CREATED,
            )
        except ObjectDoesNotExist as exc:
            raise NotFound(
                detail=f"User does not exist: pk={user_pk} or friend_pk={friend_pk}"
            ) from exc


class InvalidQueryParams(APIException):
    status_code = 400

    def __init__(self, key_str=""):
        super().__init__(detail=f"Query Params key should be {key_str}.")


class CheckDuplicateAPIView(APIView):
    allowed_keys = ["email", "nickname", "username"]

    def get(self, request):
        query_params = request.query_params

        if not request.query_params:
            raise ParseError(detail="query param is empty")

        if not all(key in self.allowed_keys for key in query_params.keys()):
            raise InvalidQueryParams("'email', 'nickname', or 'username'")

        data = self.check_duplicate(**query_params)
        if True in data.values():
            return Response(data, status=status.HTTP_409_CONFLICT)

        return Response(data, status=status.HTTP_200_OK)

    def check_duplicate(self, **kwargs):
        data = {key: False for key in self.allowed_keys}

        if "email" in kwargs:
            data["email"] = User.objects.filter(email=kwargs["email"][0]).exists()
        if "nickname" in kwargs:
            data["nickname"] = User.objects.filter(nickname=kwargs["nickname"][0]).exists()
        if "username" in kwargs:
            data["username"] = User.objects.filter(username=kwargs["username"][0]).exists()

        return data


class UserPrefixSearchView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query_params = request.query_params
        if "prefix" not in query_params.keys():
            raise InvalidQueryParams("'prefix'")

        prefix = query_params["prefix"]

        user_profile_list = User.objects.filter(nickname__startswith=prefix)
        serializer = UserProfileSerializer(user_profile_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_pk):
        try:
            user_profile = User.objects.get(pk=user_pk)
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data)
        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"User does not exist: pk={user_pk}") from exc
