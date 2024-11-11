from django.http import HttpResponse
import os

def index(request):
    # Serve the index.html directly from static
    with open(os.path.join('volunmatch/static', 'index.html')) as f:
        return HttpResponse(f.read())
