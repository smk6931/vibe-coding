"""
Event — 회차 (Class instance).

설계:
  - int PK + slug unique 컬럼 (URL 노출 = slug, 내부 join = int FK)
  - curriculum_slug = string (jsx 의 Week*/meta.js META.id 매칭, FK 검증 X)
  - venue / payment / policies / tags = JSONB (Phase 1 단순화, Phase 2 정규화 가능)
  - source: 'internal' (자체) / 'external' (외부 이벤트 스크랩)

선행 문서:
  - docs/plan/2026-05-05/2014_백엔드_5차_기획안_FINAL.md (§ 4 ERD)
"""
from django.conf import settings
from django.db import models


class Event(models.Model):
    SOURCE_CHOICES = [('internal', '자체'), ('external', '외부')]
    TYPE_CHOICES = [
        ('oneday_class', '원데이 클래스'),
        ('study',        '스터디'),
        ('hackathon',    '해커톤'),
        ('seminar',      '세미나'),
        ('mogakco',      '모각코'),
    ]
    STATUS_CHOICES = [
        ('draft',     '임시저장'),
        ('published', '공개'),
        ('cancelled', '취소'),
    ]

    id              = models.BigAutoField(primary_key=True)
    slug            = models.SlugField(max_length=50, unique=True)              # 'evt-w1-20260510-1400'
    curriculum_slug = models.CharField(max_length=50, blank=True)               # 'oneday-week-1' (jsx 매칭, soft ref)

    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    type   = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail   = models.CharField(max_length=500, blank=True)

    start_at    = models.DateTimeField()
    end_at      = models.DateTimeField()

    region    = models.CharField(max_length=20, blank=True)
    level     = models.CharField(max_length=20, blank=True)

    price     = models.PositiveIntegerField(default=0)
    capacity  = models.PositiveIntegerField(null=True, blank=True)
    remaining = models.PositiveIntegerField(null=True, blank=True)
    min_heads = models.PositiveIntegerField(null=True, blank=True)

    host_name   = models.CharField(max_length=100, blank=True)
    host_handle = models.CharField(max_length=50, blank=True)

    # source='external' 일 때
    external_source = models.CharField(max_length=50, blank=True)
    external_url    = models.URLField(blank=True)

    # JSONB (Phase 1 단순화)
    venue    = models.JSONField(default=dict, blank=True)   # {name, address, lat, lng, url, directions}
    payment  = models.JSONField(default=dict, blank=True)   # {method, bank, account, holder, memoFormat, guide}
    policies = models.JSONField(default=dict, blank=True)   # {refund: [], minHeadsNotice}
    tags     = models.JSONField(default=list, blank=True)

    apply_url = models.CharField(max_length=500, blank=True)  # 카톡 fallback

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='created_events',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'event'
        ordering = ['start_at']
        indexes = [
            models.Index(fields=['curriculum_slug']),
            models.Index(fields=['status', 'start_at']),
        ]

    def __str__(self):
        return f'{self.slug} — {self.title}'


def _generate_token():
    from nanoid import generate
    return generate(size=12)


class EventRegistration(models.Model):
    """
    회원의 회차 신청.

    member 삭제 시 SET NULL + author_name/author_phone 보존 (익명화).
    정원 트랜잭션은 services.py 에서 SELECT FOR UPDATE 로 처리.
    """
    STATUS_CHOICES = [
        ('pending',   '입금 대기'),
        ('confirmed', '확정'),
        ('cancelled', '취소'),
        ('attended',  '출석'),
        ('no_show',   '노쇼'),
    ]
    SOURCE_CHOICES = [
        ('homepage',  '사이트 직접'),
        ('threads',   'Threads'),
        ('instagram', 'Instagram'),
        ('soomoim',   '소모임'),
        ('other',     '기타'),
    ]

    id    = models.BigAutoField(primary_key=True)
    token = models.SlugField(max_length=20, unique=True, default=_generate_token)  # 외부 노출용

    event  = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='registrations',
    )

    # member 삭제 후에도 보존 (익명화)
    author_name  = models.CharField(max_length=50)
    author_phone = models.CharField(max_length=20, blank=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default='homepage')

    amount         = models.PositiveIntegerField(default=0)
    payment_method = models.CharField(max_length=20, default='account')
    depositor_name = models.CharField(max_length=50, blank=True)

    paid_at      = models.DateTimeField(null=True, blank=True)
    attended_at  = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    refund_amount = models.PositiveIntegerField(default=0)
    memo          = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_registration'
        constraints = [
            models.UniqueConstraint(fields=['event', 'member'], name='uniq_event_member'),
        ]
        indexes = [
            models.Index(fields=['event', 'status']),
        ]

    def __str__(self):
        return f'{self.event.slug} · {self.author_name} ({self.status})'


class EventTestimonial(models.Model):
    """
    회차 후기. 회원만 작성 가능 (사용자 결정 § 3).
    member 삭제 시 SET NULL + author_name/author_role 보존.
    """
    id = models.BigAutoField(primary_key=True)

    event  = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='testimonials')
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='testimonials',
    )

    author_name = models.CharField(max_length=50)
    author_role = models.CharField(max_length=50, blank=True)  # '비전공자', '대학생' 등

    content = models.TextField()
    rating  = models.PositiveSmallIntegerField(null=True, blank=True)  # 1~5

    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_testimonial'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event', '-created_at']),
            models.Index(fields=['is_published', '-created_at']),
        ]

    def __str__(self):
        return f'{self.event.slug} · {self.author_name}'
