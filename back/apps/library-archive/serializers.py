from rest_framework import serializers
from .models import LibraryItem


class LibraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class LibraryItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryItem
        fields = ['id', 'format', 'title', 'summary', 'thumbnail', 'category',
                  'level', 'access', 'price', 'read_min', 'duration_min', 'pages',
                  'tags', 'published_at']
