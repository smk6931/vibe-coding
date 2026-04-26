from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/v1/auth/',      include('apps.accounts.urls')),
    path('api/v1/events/',    include('apps.events.urls')),
    path('api/v1/library/',   include('apps.library.urls')),
    path('api/v1/community/', include('apps.community.urls')),
]
