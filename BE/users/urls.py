from django.conf.urls.static import static
from django.urls import path, include, re_path

from backend.settings import MEDIA_URL, MEDIA_ROOT
from .views import (
    ConfirmEmailView,
    CustomRegisterView,
    FriendAPIView,
    CheckDuplicateAPIView,
    UserPrefixSearchView,
    UserProfileView,
    OAuthView,
    CheckLoginStatusAPIView,
    SentFriendRequestsAPIView,
    ReceivedFriendRequestsAPIView,
    ReceivedFriendRequestDetailAPIView,
    SentFriendRequestDetailAPIView,
    UpdateUserView,
    SessionAPIView,
    UpdateUserView,
    ImageUploadAPIView,
)

urlpatterns = [
    path("", include("dj_rest_auth.urls")),
    path("check/", CheckDuplicateAPIView.as_view(), name="check_field_duplicates"),
    # path("registration/", include("dj_rest_auth.registration.urls")),
    path("registration/", CustomRegisterView.as_view(), name="rest_register"),
    # 유저가 클릭한 이메일(=링크) 확인
    re_path(
        r"^users-confirm-email/(?P<key>[-:\w]+)/$",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("friends/", FriendAPIView.as_view(), name="friends"),
    path(
        "friends/sent/<int:friend_pk>/",
        SentFriendRequestDetailAPIView.as_view(),
        name="sent_friend_request",
    ),
    path("friends/sent/", SentFriendRequestsAPIView.as_view()),
    path(
        "friends/received/<int:friend_pk>/",
        ReceivedFriendRequestDetailAPIView.as_view(),
        name="received_friend_request",
    ),
    path("friends/received/", ReceivedFriendRequestsAPIView.as_view()),
    path("search/", UserPrefixSearchView.as_view(), name="search_user_with_nickname_prefix"),
    path("detail/<int:user_pk>/", UserProfileView.as_view(), name="another_user_profile"),
    path("oauth/", OAuthView.as_view(), name="oauth"),
    path("check-login/", CheckLoginStatusAPIView.as_view(), name="check_login_status"),
    path("update/", UpdateUserView.as_view(), name="update_user_profile"),
    path("session/", SessionAPIView.as_view(), name="session"),
    path("upload-image/", ImageUploadAPIView.as_view(), name="upload-image"),
]
urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
