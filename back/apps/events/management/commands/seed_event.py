"""
seed_event — front/public/data/events.json → DB 시드.

사용:
  docker-compose exec back python manage.py seed_event

필드 매핑:
  events.json (camelCase)  →  Event 모델 (snake_case)
    id            → slug (그대로 string)
    isPublished   → status ('published' or 'draft')
    curriculumId  → curriculum_slug
    startAt       → start_at
    endAt         → end_at
    minHeads      → min_heads
    host.name     → host_name
    host.handle   → host_handle
    venue / payment / policies → JSONField 그대로
    applyUrl      → apply_url
    externalSource→ external_source
    externalUrl   → external_url
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.events.models import Event


class Command(BaseCommand):
    help = 'front/public/data/events.json → event 테이블 시드 (idempotent: slug 중복 시 update)'

    def handle(self, *args, **opts):
        # back/ 에서 ../front/public/data/events.json
        path = Path(__file__).resolve().parents[5] / 'front' / 'public' / 'data' / 'events.json'
        if not path.exists():
            self.stderr.write(self.style.ERROR(f'파일 없음: {path}'))
            return

        data = json.loads(path.read_text(encoding='utf-8'))
        created, updated = 0, 0

        with transaction.atomic():
            for raw in data:
                slug = raw['id']
                fields = {
                    'curriculum_slug': raw.get('curriculumId', ''),
                    'source':          raw.get('source', 'internal'),
                    'type':            raw.get('type', 'oneday_class'),
                    'status':          'published' if raw.get('isPublished', True) else 'draft',
                    'title':           raw.get('title', ''),
                    'description':     raw.get('description', ''),
                    'thumbnail':       raw.get('thumbnail', ''),
                    'start_at':        raw.get('startAt'),
                    'end_at':          raw.get('endAt'),
                    'region':          raw.get('region', ''),
                    'level':           raw.get('level', ''),
                    'price':           raw.get('price', 0) or 0,
                    'capacity':        raw.get('capacity'),
                    'remaining':       raw.get('remaining'),
                    'min_heads':       raw.get('minHeads'),
                    'host_name':       (raw.get('host') or {}).get('name', ''),
                    'host_handle':     (raw.get('host') or {}).get('handle', ''),
                    'external_source': raw.get('externalSource', ''),
                    'external_url':    raw.get('externalUrl', ''),
                    'venue':           raw.get('venue') or {},
                    'payment':         raw.get('payment') or {},
                    'policies':        raw.get('policies') or {},
                    'tags':            raw.get('tags') or [],
                    'apply_url':       raw.get('applyUrl', ''),
                }
                obj, was_created = Event.objects.update_or_create(slug=slug, defaults=fields)
                if was_created:
                    created += 1
                else:
                    updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'seed_event 완료 — 생성 {created} / 갱신 {updated} (총 {len(data)})'
        ))
