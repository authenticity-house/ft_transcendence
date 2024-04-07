from django.urls import path, include, re_path
from .views import ConfirmEmailView, CustomRegisterView

urlpatterns = [
    path("", include("dj_rest_auth.urls")),
    # path("registration/", include("dj_rest_auth.registration.urls")),
    path("registration/", CustomRegisterView.as_view(), name="rest_register"),
    # 유저가 클릭한 이메일(=링크) 확인
    re_path(
        r"^users-confirm-email/(?P<key>[-:\w]+)/$",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
]
