from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'showcase', views.ShowcaseViewSet, basename='showcase')
router.register(r'posts',    views.PostViewSet, basename='post')
urlpatterns = router.urls
