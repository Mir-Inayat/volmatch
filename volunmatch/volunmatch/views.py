from django.http import HttpResponse
import os
from django.conf import settings

def index(request):
    # Serve the index.html directly from static
    index_path = os.path.join(settings.BASE_DIR, 'volunmatch/static', 'index.html')
    with open(index_path) as f:
        return HttpResponse(f.read())
