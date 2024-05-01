import json

from asgiref.sync import async_to_sync
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from channels.layers import get_channel_layer

from online.services import OnlineSessionManager
from session.session_manager import DuelManager


@csrf_exempt
@require_http_methods(["POST"])
def TestView(request):
    try:
        # JSON 데이터 파싱
        data = json.loads(request.body)
        info = data["info"]
        session_number = OnlineSessionManager.add_session(info)

        return JsonResponse(
            {"detail": "Data processed successfully", "url": f"/online/oneonone/{session_number}/"}, status=200
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
