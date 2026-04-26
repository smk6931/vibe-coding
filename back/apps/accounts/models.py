from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class MemberManager(BaseUserManager):
    def create_user(self, email, nickname, password=None, **extra):
        if not email:
            raise ValueError('이메일은 필수입니다.')
        user = self.model(email=self.normalize_email(email), nickname=nickname, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nickname, password, **extra):
        extra.setdefault('role', 'admin')
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, nickname, password, **extra)


class Member(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [('member', '회원'), ('admin', '어드민')]
    PROVIDER_CHOICES = [('email', '이메일'), ('kakao', '카카오'), ('google', '구글')]

    email       = models.EmailField(unique=True, null=True, blank=True)
    nickname    = models.CharField(max_length=50)
    avatar_url  = models.URLField(blank=True)
    role        = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    provider    = models.CharField(max_length=10, choices=PROVIDER_CHOICES, default='email')
    provider_id = models.CharField(max_length=100, blank=True)
    bio         = models.TextField(blank=True)
    stack       = models.JSONField(default=list)           # 관심 스택 태그 배열
    looking_for_study = models.BooleanField(default=False)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects = MemberManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

    class Meta:
        db_table = 'members'

    def __str__(self):
        return f'{self.nickname} ({self.email})'
