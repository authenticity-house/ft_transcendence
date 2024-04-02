from django.urls import path
from . import views

urlpatterns = [
    path("match/", views.MatchList.as_view()),
]
