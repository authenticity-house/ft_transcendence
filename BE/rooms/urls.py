from django.urls import path
from .views import RoomView, JoinRoomView

urlpatterns = [
    path("", RoomView.as_view(), name="room"),
    path("<int:room_number>/", JoinRoomView.as_view(), name="join-room"),
]
