from django.db import models
from apps.accounts.models import Member


class Event(models.Model):
    SOURCE_CHOICES = [('internal', '자체'), ('external', '외부')]
    TYPE_CHOICES   = [
        ('oneday_class', '원데이 클래스'),
        ('study',        '스터디'),
        ('hackathon',    '해커톤'),
        ('seminar',      '세미나'),
        ('mogakco',      '모각코'),
    ]
    STATUS_CHOICES = [('draft', '임시저장'), ('published', '공개'), ('cancelled', '취소')]

    source       = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    type         = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status       = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    title        = models.CharField(max_length=200)
    description  = models.TextField(blank=True)
    thumbnail    = models.URLField(blank=True)
    start_at     = models.DateTimeField()
    end_at       = models.DateTimeField()
    level        = models.CharField(max_length=20, blank=True)
    price        = models.PositiveIntegerField(default=0)
    capacity     = models.PositiveIntegerField(null=True, blank=True)
    remaining    = models.PositiveIntegerField(null=True, blank=True)
    host_name    = models.CharField(max_length=100, blank=True)
    external_source = models.CharField(max_length=50, blank=True)
    external_url    = models.URLField(blank=True)
    venue_name   = models.CharField(max_length=100, blank=True)
    venue_address= models.CharField(max_length=200, blank=True)
    venue_lat    = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    venue_lng    = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    tags         = models.JSONField(default=list)
    created_by   = models.ForeignKey(Member, null=True, blank=True, on_delete=models.SET_NULL,
                                     related_name='created_events')
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'events'
        ordering = ['start_at']

    def __str__(self):
        return self.title


class Registration(models.Model):
    STATUS_CHOICES = [
        ('pending',   '입금 대기'),
        ('confirmed', '확정'),
        ('cancelled', '취소'),
        ('attended',  '출석'),
    ]

    event          = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    member         = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='registrations')
    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    amount         = models.PositiveIntegerField(default=0)
    payment_method = models.CharField(max_length=20, default='account')
    depositor_name = models.CharField(max_length=50, blank=True)
    paid_at        = models.DateTimeField(null=True, blank=True)
    attended_at    = models.DateTimeField(null=True, blank=True)
    cancelled_at   = models.DateTimeField(null=True, blank=True)
    refund_amount  = models.PositiveIntegerField(default=0)
    memo           = models.TextField(blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'registrations'
        unique_together = ('event', 'member')
