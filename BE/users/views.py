from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from allauth.account.adapter import get_adapter
from allauth.account.utils import send_email_confirmation

from dj_rest_auth.registration.views import RegisterView

from users.models import User
from users.serializers import FriendshipSerializer


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
            print(user_profile.friends.all())
            serializer = FriendshipSerializer(user_profile.friends.all(), many=True)
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
