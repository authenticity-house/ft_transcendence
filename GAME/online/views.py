import json

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from online.services import OnlineSessionManager


@csrf_exempt
@require_http_methods(["POST"])
def online_oneonone_view(request):
    try:
        # JSON 데이터 파싱
        data = json.loads(request.body)
        info = data["info"]
        session_number = OnlineSessionManager.add_session(info)

        return JsonResponse(
            {"detail": "Data processed successfully", "url": f"/online/oneonone/{session_number}/"},
            status=200,
        )
    except Exception as e:  # pylint: disable=broad-exception-caught
        return JsonResponse({"error": str(e)}, status=400)
