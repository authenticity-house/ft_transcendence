from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from allauth.account.adapter import get_adapter
from allauth.account.utils import send_email_confirmation, perform_login

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.contrib.sessions.models import Session
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.db import transaction

from dj_rest_auth.registration.views import RegisterView

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound, ParseError, APIException
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from stats.models import UserStat
from users.models import User, Friendship
from users.serializers import UserProfileSerializer, UpdateUserSerializer, ImageUploadSerializer
from users.oauth import get_access_token, get_user_data, get_or_create_user

from backend.settings import MEDIA_URL


class SelfFriendException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    _custom_detail = {"code": "FRIEND_ERROR_0", "detail": "You cannot add yourself as a friend"}

    def __init__(self, **kwargs):
        super().__init__(detail=self._custom_detail)


class AlreadyFriendException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    _custom_detail = {"code": "FRIEND_ERROR_1", "detail": "Already friends."}

    def __init__(self, **kwargs):
        super().__init__(detail=self._custom_detail)


class InvalidQueryParams(APIException):
    status_code = 400

    def __init__(self, key_str=""):
        super().__init__(
            detail={"code": "PARSE_ERROR", "detail": f"Query Params key should be {key_str}."}
        )


def get_friend_pk(friend_pk_str: str) -> int:
    if friend_pk_str is None:
        raise ParseError(detail={"code": "PARSE_ERROR", "detail": "friend_pk is empty"})

    if not friend_pk_str.isdigit():
        raise ParseError(detail={"code": "PARSE_ERROR", "detail": "friend_pk can only be int type"})

    return int(friend_pk_str)


def get_query_param(request, key):
    query_params = request.query_params
    if key not in query_params.keys():
        raise InvalidQueryParams(f"'{key}'")

    value = query_params[key]
    if value == "":
        raise ParseError(detail={"code": "PARSE_ERROR", "detail": f"{key} value is empty"})

    return value


def are_they_friend(from_to: Friendship, to_from: Friendship) -> bool:
    return from_to.are_we_friend is True and to_from.are_we_friend is True


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
    @transaction.atomic
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
        UserStat.objects.create(user=user)

        # 이메일 인증 진행
        send_email_confirmation(
            self.request._request, user, signup=True  # pylint: disable=protected-access
        )
        return user


class FriendAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def find_all_friends_with_each_other(self, login_user_id):
        friendships = Friendship.objects.filter(
            from_user_id=login_user_id,
            are_we_friend=True,
            to_user__sender__to_user_id=login_user_id,
            to_user__sender__are_we_friend=True,
        )

        friends = []
        for friendship in friendships:
            friends.append(friendship.to_user)

        return friends

    def get(self, request):
        user_pk = request.user.pk

        try:
            friends = self.find_all_friends_with_each_other(login_user_id=user_pk)
            serializer = UserProfileSerializer(friends, many=True)
            return Response(serializer.data)

        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"User does not exist: pk={user_pk}") from exc

    def post(self, request):
        user_pk: int = request.user.pk
        friend_pk: int = (
            request.data.get("friend_pk")
            if isinstance(request.data.get("friend_pk"), int)
            else get_friend_pk(str(request.data.get("friend_pk")))
        )

        if user_pk == friend_pk:
            raise SelfFriendException()

        try:
            user_profile = User.objects.get(pk=user_pk)
            friend_profile = User.objects.get(pk=friend_pk)

            from_user_to_friend, _ = Friendship.objects.get_or_create(
                from_user=user_profile, to_user=friend_profile
            )
            from_friend_to_user, _ = Friendship.objects.get_or_create(
                from_user=friend_profile, to_user=user_profile
            )

            if are_they_friend(from_user_to_friend, from_friend_to_user):
                raise AlreadyFriendException()

            if from_user_to_friend.are_we_friend is True:
                return Response(
                    {"code": "FRIEND_ERROR_2", "detail": "Friend request already sent."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            from_user_to_friend.are_we_friend = True
            from_user_to_friend.save()

            return Response(
                {"detail": "success"},
                status=status.HTTP_200_OK,
            )
        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"User does not exist: friend_pk={friend_pk}") from exc


class SentFriendRequestsAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_pk = request.user.pk

        sent_friends = Friendship.objects.filter(
            to_user_id=user_pk, are_we_friend=False
        ).values_list("from_user", flat=True)
        sent_friends_object = [User.objects.get(pk=user_pk) for user_pk in sent_friends]
        serializer = UserProfileSerializer(sent_friends_object, many=True)
        return Response(serializer.data)


class ReceivedFriendRequestsAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_pk = request.user.pk

        received_friends = Friendship.objects.filter(
            from_user_id=user_pk, are_we_friend=False
        ).values_list("to_user", flat=True)
        received_friends_object = [User.objects.get(pk=user_pk) for user_pk in received_friends]
        serializer = UserProfileSerializer(received_friends_object, many=True)
        return Response(serializer.data)


class SentFriendRequestDetailAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, friend_pk: int):
        user_pk: int = request.user.pk

        if user_pk == friend_pk:
            raise SelfFriendException()

        friendship = Friendship.objects.filter(
            Q(from_user_id=user_pk, to_user_id=friend_pk)
            | Q(from_user_id=friend_pk, to_user_id=user_pk)
        )

        if friendship.count() == 2 and are_they_friend(*friendship):
            raise AlreadyFriendException()

        friendship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReceivedFriendRequestDetailAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_pk: int):
        user_pk: int = request.user.pk

        if user_pk == friend_pk:
            raise SelfFriendException()

        try:
            from_to_friendship = Friendship.objects.get(from_user_id=user_pk, to_user_id=friend_pk)
            from_to_friendship.are_we_friend = True
            from_to_friendship.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist as exc:
            raise NotFound(
                detail=f"Friendship does not exist: pk={user_pk}, friend_pk={friend_pk}"
            ) from exc

    def delete(self, request, friend_pk: int):
        user_pk: int = request.user.pk

        if user_pk == friend_pk:
            raise SelfFriendException()

        friendship = Friendship.objects.filter(
            Q(from_user_id=user_pk, to_user_id=friend_pk)
            | Q(from_user_id=friend_pk, to_user_id=user_pk)
        )

        if friendship.count() == 2 and are_they_friend(*friendship):
            raise AlreadyFriendException()

        friendship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        prefix = get_query_param(request, "prefix")
        if prefix == "":
            raise ParseError(detail="prefix value is empty")

        user_profile_list = User.objects.filter(nickname__startswith=prefix)
        if user_profile_list.exists():
            serializer = UserProfileSerializer(user_profile_list, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)


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


class OAuthView(APIView):
    @transaction.atomic
    def get(self, request):
        query_params = request.query_params
        code = query_params.get("code")

        if not code:
            return Response({"detail": "Failed to get code."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            access_token = get_access_token(code)
            if access_token is None:
                raise Exception("Access token is None")  # pylint: disable=broad-exception-raised
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:  # pylint: disable=broad-exception-caught
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            user_data = get_user_data(access_token)
            if user_data is None:
                raise Exception("User data is None")  # pylint: disable=broad-exception-raised
        except Exception as e:  # pylint: disable=broad-except
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            user, is_created = get_or_create_user(user_data)
            if is_created:
                UserStat.objects.create(user=user)
            perform_login(request, user, email_verification="none")
            return HttpResponseRedirect("/")

        except Exception:  # pylint: disable=broad-exception-caught
            return Response(
                {"detail": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CheckLoginStatusAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "user_id": request.user.id,
                "username": request.user.username,
                "is_authenticated": True,
            }
        )


class UpdateUserView(RetrieveUpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = UpdateUserSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        serializer_data = request.data

        if not serializer_data:
            return Response(
                {"detail": "Please enter the information you want to change."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.serializer_class(request.user, data=serializer_data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            detail = serializer.save()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(detail, status=status.HTTP_200_OK)


class SessionAPIView(APIView):
    def get(self, request, *args, **kwargs):
        session_id = request.query_params.get("sessionid")
        if not session_id:
            return Response({"error": "Session ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            session = Session.objects.get(session_key=session_id)
            user_id = session.get_decoded().get("_auth_user_id")
            user = get_user_model().objects.get(id=user_id)
            user_data = {"pk": user_id, "nickname": user.nickname}
            return Response(user_data)
        except (Session.DoesNotExist, get_user_model().DoesNotExist):
            return Response(
                {"error": "Invalid session or user not found"}, status=status.HTTP_400_BAD_REQUEST
            )


class ImageUploadAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = ImageUploadSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()

            instance = serializer.instance
            image = instance.image
            image_url = MEDIA_URL + str(image)

            request.user.profile_url = image_url
            request.user.save()

            return Response({"url": image_url}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
