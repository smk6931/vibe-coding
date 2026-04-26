from rest_framework import serializers
from .models import Event, Registration


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class EventListSerializer(serializers.ModelSerializer):
    """목록용 — 필드 최소화"""
    class Meta:
        model = Event
        fields = ['id', 'source', 'type', 'status', 'title', 'thumbnail',
                  'start_at', 'end_at', 'price', 'remaining', 'capacity',
                  'venue_name', 'venue_lat', 'venue_lng', 'tags', 'level']


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'member']
