from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('event',        views.EventViewSet,             basename='event')
router.register('registration', views.EventRegistrationViewSet, basename='registration')
router.register('testimonial',  views.EventTestimonialViewSet,  basename='testimonial')

urlpatterns = router.urls
