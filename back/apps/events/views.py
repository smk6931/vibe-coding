from django.utils import timezone
from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Event, EventRegistration, EventTestimonial
from .serializers import (
    EventSerializer,
    EventRegistrationSerializer,
    EventTestimonialSerializer,
)


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'admin'
        )


class EventViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/event/                   목록 (?source=&type=&q=&page=)
    GET    /api/v1/event/:slug/             상세
    GET    /api/v1/event/upcoming/          가까운 미래 회차
    POST/PATCH/DELETE                       admin 만
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'upcoming']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        if v := params.get('source'):
            qs = qs.filter(source=v)
        if v := params.get('type'):
            qs = qs.filter(type=v)
        if v := params.get('region'):
            qs = qs.filter(region=v)
        if v := params.get('q'):
            qs = qs.filter(title__icontains=v)
        if not (self.request.user.is_authenticated and getattr(self.request.user, 'role', None) == 'admin'):
            qs = qs.filter(status='published')
        return qs

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        qs = self.get_queryset().filter(end_at__gte=timezone.now()).order_by('start_at')[:10]
        return Response(self.get_serializer(qs, many=True).data)


class EventRegistrationViewSet(mixins.CreateModelMixin,
                               mixins.RetrieveModelMixin,
                               mixins.ListModelMixin,
                               mixins.UpdateModelMixin,
                               viewsets.GenericViewSet):
    """
    POST   /api/v1/registration/            신청 (JWT 필수)
    GET    /api/v1/registration/            전체 (admin)
    GET    /api/v1/registration/me/         내 신청 이력
    GET    /api/v1/registration/:token/     단일
    PATCH  /api/v1/registration/:token/     상태 변경 (admin 또는 본인 cancel)
    """
    serializer_class = EventRegistrationSerializer
    lookup_field = 'token'

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        if self.action == 'list':
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if getattr(self.request.user, 'role', None) == 'admin':
            return EventRegistration.objects.select_related('event', 'member').all()
        return EventRegistration.objects.filter(member=self.request.user).select_related('event')

    @action(detail=False, methods=['get'], url_path='me')
    def mine(self, request):
        qs = EventRegistration.objects.filter(member=request.user).select_related('event')
        return Response(self.get_serializer(qs, many=True).data)


class EventTestimonialViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/testimonial/             공개 후기 (?event_slug=&q=)
    POST   /api/v1/testimonial/             작성 (회원만)
    PATCH/DELETE /api/v1/testimonial/:id/   admin
    """
    serializer_class = EventTestimonialSerializer
    queryset = EventTestimonial.objects.select_related('event', 'member').all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [IsAdminRole()]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        if v := params.get('event_slug'):
            qs = qs.filter(event__slug=v)
        if v := params.get('q'):
            qs = qs.filter(content__icontains=v)
        if not (self.request.user.is_authenticated and getattr(self.request.user, 'role', None) == 'admin'):
            qs = qs.filter(is_published=True)
        return qs
