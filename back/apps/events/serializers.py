from rest_framework import serializers
from .models import Event, EventRegistration, EventTestimonial


class EventSerializer(serializers.ModelSerializer):
    """공개 회차 정보."""

    class Meta:
        model = Event
        fields = [
            'id', 'slug', 'curriculum_slug',
            'source', 'type', 'status',
            'title', 'description', 'thumbnail',
            'start_at', 'end_at',
            'region', 'level',
            'price', 'capacity', 'remaining', 'min_heads',
            'host_name', 'host_handle',
            'external_source', 'external_url',
            'venue', 'payment', 'policies', 'tags',
            'apply_url',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EventRegistrationSerializer(serializers.ModelSerializer):
    """회차 신청. event_slug 로 받음."""
    event_slug = serializers.SlugRelatedField(
        source='event', slug_field='slug', queryset=Event.objects.all(), write_only=True,
    )

    class Meta:
        model = EventRegistration
        fields = [
            'id', 'token', 'event_slug', 'event',
            'author_name', 'author_phone',
            'status', 'source',
            'amount', 'payment_method', 'depositor_name',
            'paid_at', 'attended_at', 'cancelled_at',
            'refund_amount', 'memo',
            'created_at',
        ]
        read_only_fields = ['id', 'token', 'event', 'status', 'created_at']
        extra_kwargs = {
            'author_name':  {'required': False, 'allow_blank': True},
            'author_phone': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        request = self.context['request']
        member = request.user if request.user.is_authenticated else None
        if member:
            if not validated_data.get('author_name'):
                validated_data['author_name'] = member.name
            if not validated_data.get('author_phone'):
                validated_data['author_phone'] = member.phone
        validated_data['member'] = member
        return super().create(validated_data)


class EventTestimonialSerializer(serializers.ModelSerializer):
    """회차 후기. 회원만 작성 가능."""
    event_slug = serializers.SlugRelatedField(
        source='event', slug_field='slug', queryset=Event.objects.all(), write_only=True,
    )

    class Meta:
        model = EventTestimonial
        fields = [
            'id', 'event_slug', 'event',
            'author_name', 'author_role',
            'content', 'rating',
            'is_published',
            'created_at',
        ]
        read_only_fields = ['id', 'event', 'created_at']

    def create(self, validated_data):
        request = self.context['request']
        member = request.user
        validated_data['member'] = member
        validated_data.setdefault('author_name', member.display)
        return super().create(validated_data)
