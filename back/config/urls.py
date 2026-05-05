from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('django-admin/',     admin.site.urls),
    path('api/v1/auth/',      include('apps.accounts.urls')),
    path('api/v1/',           include('apps.events.urls')),
    # apps.library / apps.community 는 5차 기획안에서 폐기 (Phase 2 결정 후 부활 가능)
]
