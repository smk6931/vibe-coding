from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from .models import Event, Registration
from .serializers import EventSerializer, EventListSerializer, RegistrationSerializer
from .services import register_event, confirm_payment, mark_attended


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(status='published').order_by('start_at')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        return EventSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        source = self.request.query_params.get('source')
        type_ = self.request.query_params.get('type')
        if source:
            qs = qs.filter(source=source)
        if type_:
            qs = qs.filter(type=type_)
        return qs

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def register(self, request, pk=None):
        event = self.get_object()
        try:
            reg = register_event(event, request.user,
                                 depositor_name=request.data.get('depositor_name', ''))
            return Response(RegistrationSerializer(reg).data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def registrations(self, request, pk=None):
        if request.user.role != 'admin':
            return Response(status=status.HTTP_403_FORBIDDEN)
        regs = Registration.objects.filter(event=self.get_object())
        return Response(RegistrationSerializer(regs, many=True).data)
