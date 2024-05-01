from django.urls import path
from .views import MatchAPIView, MatchListAPIView

urlpatterns = [
    path("match/list/<int:user_pk>/", MatchListAPIView.as_view(), name="another_user_match_list"),
    path("match/list/", MatchListAPIView.as_view(), name="my_match_list"),
    path("match/online/", MatchAPIView.as_view(), name="match"),
]
