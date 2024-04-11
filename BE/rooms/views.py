from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rooms.services import RoomManager
from rooms.services.exceptions import RoomError
from .serializers import RoomCreateSerializer, RoomListSerializer


class RoomView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

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


class JoinRoomView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, room_number):
        try:
            user = request.user
            RoomManager.join_room(room_number, user)
            return Response(
                {"message": "Joined room successfully", "room_id": room_number},
                status=status.HTTP_200_OK,
            )
        except RoomError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
