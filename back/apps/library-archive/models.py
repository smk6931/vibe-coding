from django.db import models
from apps.accounts.models import Member


class LibraryItem(models.Model):
    FORMAT_CHOICES = [('book', '전자책'), ('video', '영상'), ('blog', '블로그')]
    ACCESS_CHOICES = [('free', '무료'), ('member', '회원전용'), ('paid', '유료')]

    format       = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    title        = models.CharField(max_length=200)
    summary      = models.TextField(blank=True)
    content      = models.TextField(blank=True)   # Markdown 본문
    thumbnail    = models.URLField(blank=True)
    category     = models.CharField(max_length=50, blank=True)
    level        = models.CharField(max_length=20, blank=True)
    access       = models.CharField(max_length=10, choices=ACCESS_CHOICES, default='free')
    price        = models.PositiveIntegerField(default=0)
    read_min     = models.PositiveIntegerField(null=True, blank=True)
    duration_min = models.PositiveIntegerField(null=True, blank=True)
    pages        = models.PositiveIntegerField(null=True, blank=True)
    external_url = models.URLField(blank=True)
    tags         = models.JSONField(default=list)
    published    = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_by   = models.ForeignKey(Member, null=True, blank=True, on_delete=models.SET_NULL)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'library_items'
        ordering = ['-published_at']

    def __str__(self):
        return self.title
