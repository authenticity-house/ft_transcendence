from django.urls import path
from .views import (
    MatchAPIView,
    LocalMatchAPIView,
    MatchListAPIView,
    UserStatSummaryAPIView,
    UserStatAPIView,
)

urlpatterns = [
    path("match/list/<int:user_pk>/", MatchListAPIView.as_view(), name="another_user_match_list"),
    path("match/list/", MatchListAPIView.as_view(), name="my_match_list"),
    path("match/online/", MatchAPIView.as_view(), name="online_match_data"),
    path("match/local/", LocalMatchAPIView.as_view(), name="local_match_data"),
    path(
        "summary/<int:user_pk>/",
        UserStatSummaryAPIView.as_view(),
        name="another_user_game_stat_summary",
    ),
    path("summary/", UserStatSummaryAPIView.as_view(), name="my_game_stat_summary"),
    path("", UserStatAPIView.as_view(), name="my_game_stat"),
]
