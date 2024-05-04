from django.urls import path

from .views import online_game_view

urlpatterns = [
    path("", online_game_view),
]
