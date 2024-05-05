from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound, ParseError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from stats.models import Match, UserStat
from stats.serializers import (
    MatchSerializer,
    MatchListSerializer,
    UserStatSummarySerializer,
    UserStatSerializer,
)
from stats.time_utils import parse_timedelta
from users.models import User


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


class LocalMatchAPIView(APIView):
    def post(self, request):
        data = request.data
        if list(data.keys()) != ["player", "play_time"]:
            raise ParseError("Include both 'player' and 'play_time' keys in body")

        user_pk = int(data["player"])
        play_time = parse_timedelta(data.get("play_time", "00:00"))
        try:
            user = User.objects.get(pk=user_pk)
        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"UserStat does not exist: pk={user_pk}") from exc

        try:
            user_stat, _ = UserStat.objects.get_or_create(user=user)
            user_stat.save(local_match_data={"play_time": play_time})
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:  # pylint: disable=broad-exception-caught
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserStatSummaryAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_pk=None):
        try:
            user = request.user
            if user_pk is None:
                user_pk: int = request.user.pk
            else:
                user = User.objects.get(pk=user_pk)

            stat_summary, _ = UserStat.objects.get_or_create(user=user)
            serializer = UserStatSummarySerializer(stat_summary)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"UserStat does not exist: pk={user_pk}") from exc


class UserStatAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_pk: int = request.user.pk

        try:
            user_stat, _ = UserStat.objects.get_or_create(user=request.user)
            serializer = UserStatSerializer(user_stat)
            data = serializer.data
            data["graph"] = self._get_graph_data(user_pk)
            return Response(data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as exc:
            raise NotFound(detail=f"UserStat does not exist: pk={user_pk}") from exc

    def _get_graph_data(self, user_pk):
        rating_change: list = []
        attack_type: dict = {key: 0 for key in ["TYPE0", "TYPE1", "TYPE2"]}

        match_list = Match.objects.filter(Q(player1_id=user_pk) | Q(player2_id=user_pk)).order_by(
            "-create_date"
        )[:12]

        match_cnt = len(match_list)
        if match_cnt < 12:
            rating_change.append(2000)

        for match in reversed(match_list):
            if user_pk == match.player1_id:
                rating_change.append(match.player1_rating)
                attack_type[match.player1_attack_type] += 1
            else:
                rating_change.append(match.player2_rating)
                attack_type[match.player2_attack_type] += 1

        return {
            "match_cnt": match_cnt,
            "rating_change": rating_change,
            "attack_type": attack_type,
        }
