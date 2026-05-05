from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from . import views

urlpatterns = [
    path('signup/',  views.signup,                 name='auth-signup'),
    path('login/',   TokenObtainPairView.as_view(), name='auth-login'),    # email + password (USERNAME_FIELD)
    path('refresh/', TokenRefreshView.as_view(),    name='auth-refresh'),
    path('logout/',  TokenBlacklistView.as_view(),  name='auth-logout'),
    path('me/',      views.me,                      name='auth-me'),
]
