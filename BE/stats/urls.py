from django.urls import path
from .views import MatchAPIView

urlpatterns = [
    path("match/", MatchAPIView.as_view(), name="match"),
]
