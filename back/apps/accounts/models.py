"""
Member — 회원.

설계:
  - email 로 로그인 (USERNAME_FIELD)
  - handle 은 URL 노출용 (자동 생성, 사용자 수정 가능, 중복 시 _N suffix)
  - AbstractBaseUser + PermissionsMixin 표준 (password 해싱 자동)
  - role: 'member' / 'admin' (admin 은 운영자, is_staff 와 별개로 비즈 룰)

선행 문서:
  - docs/plan/2026-05-05/2014_백엔드_5차_기획안_FINAL.md (§ 1, § 10)
"""
import re

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


def generate_handle(email):
    """이메일 prefix → URL 친화 handle. 중복 시 _2, _3 ... suffix."""
    base = email.split('@')[0].lower()
    base = re.sub(r'[^a-z0-9_]', '_', base)[:18] or 'user'
    candidate, suffix = base, 1
    while Member.objects.filter(handle=candidate).exists():
        suffix += 1
        candidate = f'{base}_{suffix}'[:20]
    return candidate


class MemberManager(BaseUserManager):
    def create_user(self, email, name, phone, password=None, **extra):
        if not email:
            raise ValueError('이메일은 필수입니다.')
        if not name:
            raise ValueError('이름은 필수입니다.')
        if not phone:
            raise ValueError('전화번호는 필수입니다.')

        email = self.normalize_email(email)
        # handle 자동 생성 (사용자가 직접 안 줬으면)
        if not extra.get('handle'):
            extra['handle'] = generate_handle(email)

        user = self.model(email=email, name=name, phone=phone, **extra)
        user.set_password(password)  # PBKDF2 해싱 (Django 기본)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, phone, password, **extra):
        extra.setdefault('role', 'admin')
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, name, phone, password, **extra)


class Member(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [('member', '회원'), ('admin', '어드민')]
    PROVIDER_CHOICES = [('email', '이메일'), ('kakao', '카카오'), ('google', '구글')]

    id           = models.BigAutoField(primary_key=True)
    email        = models.EmailField(unique=True)                              # 로그인 키
    handle       = models.SlugField(max_length=20, unique=True)                # URL 용 (자동 생성)
    name         = models.CharField(max_length=50)                             # 실명 (입금자 확인)
    phone        = models.CharField(max_length=20)
    age          = models.PositiveSmallIntegerField(null=True, blank=True)
    display_name = models.CharField(max_length=50, blank=True)                 # 한국어 표시명 (선택)
    role         = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    provider     = models.CharField(max_length=10, choices=PROVIDER_CHOICES, default='email')
    provider_id  = models.CharField(max_length=100, blank=True)
    avatar_url   = models.URLField(blank=True)
    bio          = models.TextField(blank=True)

    # AbstractBaseUser 자동: password, last_login
    # PermissionsMixin 자동: is_superuser, groups, user_permissions
    is_staff   = models.BooleanField(default=False)
    is_active  = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = MemberManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    class Meta:
        db_table = 'member'

    def __str__(self):
        return f'{self.handle} ({self.name})'

    @property
    def display(self):
        """UI 표시: display_name 있으면 그것, 없으면 handle."""
        return self.display_name or self.handle
