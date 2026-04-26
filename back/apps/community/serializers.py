from rest_framework import serializers
from apps.accounts.serializers import MemberPublicSerializer
from .models import ShowcaseItem, Post, Comment


class ShowcaseSerializer(serializers.ModelSerializer):
    member = MemberPublicSerializer(read_only=True)

    class Meta:
        model = ShowcaseItem
        fields = '__all__'
        read_only_fields = ['id', 'likes_count', 'created_at', 'updated_at', 'member']


class PostSerializer(serializers.ModelSerializer):
    author = MemberPublicSerializer(read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['id', 'views', 'created_at', 'updated_at', 'author']


class CommentSerializer(serializers.ModelSerializer):
    author = MemberPublicSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'author']
