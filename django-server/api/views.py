from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.core import serializers
from api.models import URL
from django.http import Http404
import json
from django.views.decorators.csrf import csrf_exempt
from helpers import hash_url
import datetime

def index(request):
    return HttpResponse("api index")

# GET, DELETE /api/redirects/[id]
@csrf_exempt
def crud(request, id=""):
    if request.method == "DELETE":
        try:
            url = URL.objects.get(id=id)
            url.delete()
            return HttpResponse(status=200)
        except URL.DoesNotExist:
            return HttpResponse(status=400)
        
    if request.method == "GET":
        try:
            url = URL.objects.get(id=id)
            url.save()
            data = {
                'id': url.id,
                'target': url.target,
                'count': url.count
            }
            
            return JsonResponse(data, status=200)
        except URL.DoesNotExist:
            raise Http404("No such link exists")
    
    if request.method == "PUT":
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            new_id = body.get("id")  # Get id from body
            target = body.get("target")  # Get target from body
    
            url = URL.objects.get(id=id)
            
            _id = new_id or id
            _target = target or url.target
            _count = url.count

            url.delete()

            new_url = URL(id=_id, target=_target, count=_count)
            new_url.save()

            data = {
                'id': new_url.id,
                'target': new_url.target,
                'count': new_url.count
            }
            
            return JsonResponse(data, status=200)
        except URL.DoesNotExist:
            raise Http404("No such link exists")


    return HttpResponse(status=404)


@csrf_exempt
def post(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    id = body.get("id")  # Get id from body
    target = body.get("target")  # Get target from body

    if not target:  # Check if both id and target are provided
        return JsonResponse({"error": "target is required"}, status=400)
    
    if not id:
        # get unused 5 character hash
        now = datetime.datetime.now().timestamp()
        test_id = hash_url(now)
        url = URL(id=test_id, target=target)
        url.save()
        return JsonResponse({"id": test_id, "target": target, "count": 0})

    try:
        url = URL.objects.get(id=id)
        return JsonResponse({"error": "Link is already being used"}, status=400)
    except URL.DoesNotExist:
        url = URL(id=id, target=target)
        url.save()
        return JsonResponse({"id": id, "target": target, "count": url.count})

    


def _redirect(request, id):
    try:
        url = URL.objects.get(id=id)  # use get() instead of filter() here
        url.count += 1
        url.save()
        return redirect(url.target)
    except URL.DoesNotExist:
        raise Http404("No such link exists")