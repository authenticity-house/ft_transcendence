import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_http_methods(["POST"])
def TestView(request):
    try:
        # JSON 데이터 파싱
        data = json.loads(request.body)
        # 여기에서 데이터를 처리하는 로직을 추가하세요.
        # 예제에서는 입력된 데이터를 그대로 반환합니다.
        return JsonResponse({'detail': 'Data processed successfully', 'url': "/ws/online/123/"}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
