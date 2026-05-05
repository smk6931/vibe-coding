from django.db import models
from apps.accounts.models import Member


class ShowcaseItem(models.Model):
    member      = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='showcases')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail   = models.URLField(blank=True)
    demo_url    = models.URLField(blank=True)
    repo_url    = models.URLField(blank=True)
    tags        = models.JSONField(default=list)
    likes_count = models.PositiveIntegerField(default=0)
    published   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'showcase_items'
        ordering = ['-created_at']


class Post(models.Model):
    BOARD_CHOICES = [('general', '자유'), ('qa', 'Q&A'), ('notice', '공지')]

    board      = models.CharField(max_length=10, choices=BOARD_CHOICES, default='general')
    title      = models.CharField(max_length=200)
    content    = models.TextField()
    author     = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='posts')
    views      = models.PositiveIntegerField(default=0)
    pinned     = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'posts'
        ordering = ['-pinned', '-created_at']


class Comment(models.Model):
    post        = models.ForeignKey(Post, null=True, blank=True, on_delete=models.CASCADE,
                                    related_name='comments')
    showcase    = models.ForeignKey(ShowcaseItem, null=True, blank=True, on_delete=models.CASCADE,
                                    related_name='comments')
    author      = models.ForeignKey(Member, on_delete=models.CASCADE)
    content     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comments'
