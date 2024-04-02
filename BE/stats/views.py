from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from stats.models import Match
from stats.serializers import MatchSerializer


class MatchList(APIView):
    def get(self, request):
        """Match 목록 조회"""
        matches = Match.objects.all()
        # 여러 개의 객체를 serialization하기 위해 many=True로 설정
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Match 기록 생성"""
        # request.data는 사용자의 입력 데이터
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():  # 유효성 검사
            serializer.save()  # 저장
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
