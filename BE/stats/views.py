from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from stats.models import Match, UserStat
from stats.serializers import MatchSerializer, MatchListSerializer, UserStatSummarySerializer


class MatchListAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_pk=None):
        if user_pk is None:
            user_pk: int = request.user.pk

        match_list = Match.objects.filter(Q(player1_id=user_pk) | Q(player2_id=user_pk)).order_by(
            "-create_date"
        )[:12]
        if match_list.exists():
            serializer = MatchListSerializer(match_list, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MatchAPIView(APIView):
    def post(self, request):
        try:
            serializer = MatchSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:  # pylint: disable=broad-exception-caught
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserStatSummaryAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_pk=None):
        if user_pk is None:
            user_pk: int = request.user.pk

        try:
            stat_summary = UserStat.objects.get(user_id=user_pk)
            serializer = UserStatSummarySerializer(stat_summary)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"UserStat does not exist: pk={user_pk}") from exc
