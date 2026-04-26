from rest_framework import serializers
from .models import Member


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Member
        fields = ['email', 'nickname', 'password']

    def create(self, validated_data):
        return Member.objects.create_user(**validated_data)


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'email', 'nickname', 'avatar_url', 'role', 'bio', 'stack',
                  'looking_for_study', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class MemberPublicSerializer(serializers.ModelSerializer):
    """공개 프로필 (이메일 제외)"""
    class Meta:
        model = Member
        fields = ['id', 'nickname', 'avatar_url', 'bio', 'stack', 'looking_for_study']
