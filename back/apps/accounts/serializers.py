from rest_framework import serializers
from .models import Member


class SignupSerializer(serializers.ModelSerializer):
    """회원가입 — email/password/name/phone 필수, 나머지 선택."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Member
        fields = ['email', 'password', 'name', 'phone', 'age', 'handle', 'display_name']
        extra_kwargs = {
            'handle': {'required': False, 'allow_blank': True},  # 안 주면 자동 생성
            'age': {'required': False},
            'display_name': {'required': False, 'allow_blank': True},
        }

    def validate_handle(self, value):
        if value and Member.objects.filter(handle=value).exists():
            raise serializers.ValidationError('이미 사용 중인 handle 입니다.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        # handle 비어있으면 manager 가 자동 생성
        if not validated_data.get('handle'):
            validated_data.pop('handle', None)
        return Member.objects.create_user(password=password, **validated_data)


class MemberSerializer(serializers.ModelSerializer):
    """본인 정보 (이메일 포함). PATCH 시 일부 필드만 수정 가능."""
    display = serializers.ReadOnlyField()  # display_name or handle

    class Meta:
        model = Member
        fields = [
            'id', 'email', 'handle', 'name', 'phone', 'age',
            'display_name', 'display', 'role', 'provider',
            'avatar_url', 'bio', 'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'email', 'role', 'provider', 'is_active', 'created_at']


class MemberPublicSerializer(serializers.ModelSerializer):
    """공개 프로필 (이메일·전화·실명 제외)."""
    display = serializers.ReadOnlyField()

    class Meta:
        model = Member
        fields = ['id', 'handle', 'display_name', 'display', 'avatar_url', 'bio']
