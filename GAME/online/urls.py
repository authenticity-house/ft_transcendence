from django.urls import path

from .views import online_oneonone_view

urlpatterns = [
    path("", online_oneonone_view),
]
