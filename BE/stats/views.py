from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from stats.serializers import MatchSerializer


class MatchAPIView(APIView):
    def post(self, request):
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
