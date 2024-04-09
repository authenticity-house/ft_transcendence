from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoomCreateSerializer, RoomListSerializer
from .room_manager import RoomManager


class RoomView(APIView):
    def get(self, request):
        rooms = RoomManager.room_list()
        serializer = RoomListSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RoomCreateSerializer(data=request.data)
        if serializer.is_valid():
            room_number = serializer.save()
            return Response(
                {"message": "Room created successfully", "room_number": room_number},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
