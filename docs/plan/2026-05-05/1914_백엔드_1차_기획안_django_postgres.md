# 백엔드 1차 기획안 — Django REST + PostgreSQL (Docker)

작성: 2026-05-05 19:14
대상 프로젝트: vibe-coding (현재 프런트 + Nginx 정적 호스팅)

## 0. 결정 정리

- **Supabase = 강의 교안용 (1~6주차 비전공자)** — 본 프로젝트엔 안 씀
- **본 프로젝트 = 정석 풀스택** (Django REST Framework + PostgreSQL + Docker) — 이직 포트폴리오 + 장기 운영
- **포트**: 백엔드 8200 / DB 5200 (Postgres 기본 5432 회피)
- **5/10 1주차 회차 영향 없음** — 5/10 까지는 정적 페이지 + 카톡 신청 그대로. 백엔드 본격 도입은 5/13~

## 1. 왜 정석으로 가는가 (이유)

| 측면 | Supabase | **정석 (이 프로젝트)** |
|------|---------|--------------------|
| 이직 포트폴리오 | △ "BaaS 만 써봤어요" | ✅ DB 스키마·트랜잭션·인증·동시성 직접 |
| 면접 깊이 | 약 (SDK 사용자) | ✅ "이 부분에서 락 걸고 N+1 막고..." |
| 강의 자료 활용 | ✅ 비전공자 입문 | △ 진입 장벽 ↑ (강의는 Supabase 별도 사용) |
| 운영 자유도 | 정책 의존 | ✅ 자기 서버 |
| 학습 가치 | 낮음 (블랙박스) | ✅ DRF·ORM·미들웨어 직접 |

**최종 전략**:
- **이 프로젝트 (vibe.me.kr)** = 정석 풀스택 (포트폴리오)
- **강의 (1~6주차 비전공자)** = Supabase 위주
- **강의 7~8주차** = "정석 백엔드는 어떻게 다른지" — 본 프로젝트가 강의 사례

## 2. 현재 프런트 데이터 인벤토리

| 파일 | 사용처 | DB 이전 후 |
|------|------|---------|
| `events.json` | HomeClient, EventDetail, ClassRegistration | `events` 테이블 + REST API |
| `_curriculums.js` (Week*/meta.js) | CurriculumGrid, ClassRegistration, ClassEditor | `curriculums` 테이블 — 단 본문(jsx)은 그대로 (콘텐츠는 코드, 메타만 DB) |
| `site.json` | OperatorIntroCard, Footer, EventDetail | `site_config` 테이블 (singleton) + `operator_profile` 테이블 |
| `members.json` | community/members 페이지 | `members` 테이블 (auth.User 확장) |
| `me.json` | RoleContext (현재 placeholder) | `auth/me` 엔드포인트 (JWT 기반) |
| `admin.json` | Admin 페이지 (대시보드 데이터) | 실시간 집계 쿼리 (별도 테이블 X) |
| `board.json` | community/board | `posts` 테이블 |
| `qa.json` | community/qa | `inquiries` 테이블 (별도 도메인) |
| `showcase.json` | (사용처 확인 필요, 미사용 가능성) | `showcases` 테이블 또는 폐기 |

### 신규 추가 필요 (Application 흐름)
- `applications` 테이블 — 비회원도 사이트에서 신청 가능. 이름·연락처·동기·event_id. 운영자 응대 후 회원 가입 + Registration 으로 승격
- `inquiries` 테이블 — Q&A 또는 일반 문의

## 3. 도메인 모델 (ERD 텍스트)

```
[auth.Member]                    ← 회원 (이메일/카카오/구글 로그인)
  ├─ id (PK)
  ├─ email (unique, nullable for OAuth-only)
  ├─ nickname
  ├─ role (member / admin)
  ├─ provider (email / kakao / google)
  ├─ provider_id
  ├─ avatar_url
  ├─ bio
  └─ created_at / updated_at

[curriculums]                    ← 강의 교안 (4주차 시리즈)
  ├─ id (PK, 'oneday-week-1' 같은 slug)
  ├─ week_number
  ├─ status (active / preparing / archived)
  ├─ title
  ├─ subtitle
  ├─ summary
  ├─ guide_route (/guide/oneday/week1)
  ├─ duration
  ├─ level
  ├─ thumbnail
  ├─ outline (JSONB, string array)
  ├─ prerequisites (JSONB, string array)
  ├─ outcomes (JSONB, string array)
  └─ created_at / updated_at

[events]                         ← 회차 (Class instance)
  ├─ id (PK)
  ├─ curriculum_id (FK → curriculums.id, nullable for non-class events)
  ├─ source (internal / external)
  ├─ type (oneday_class / study / hackathon / seminar / mogakco)
  ├─ status (draft / published / cancelled)
  ├─ title, description, thumbnail
  ├─ start_at, end_at
  ├─ region, level
  ├─ price, capacity, remaining, min_heads
  ├─ host_name, host_handle
  ├─ external_source, external_url      ← source='external' 일 때
  ├─ venue (name, address, lat, lng, url, directions, JSONB)
  ├─ payment (method, bank, account, holder, memoFormat, guide, JSONB)
  ├─ policies (refund[], minHeadsNotice, JSONB)
  ├─ tags (JSONB)
  ├─ apply_url                          ← 카톡 fallback (회원가입 전 안내)
  ├─ created_by (FK → Member, admin only)
  └─ created_at / updated_at

[applications]                   ← 비회원 신청 (1차 진입)
  ├─ id (PK)
  ├─ event_id (FK → events)
  ├─ name, contact (전화 또는 이메일)
  ├─ motive (한 줄 동기)
  ├─ source (homepage / threads / instagram / soomoim / other)
  ├─ status (pending / contacted / converted / rejected)
  ├─ converted_member_id (FK → Member, nullable, 회원가입 후 연결)
  ├─ admin_memo
  └─ created_at / updated_at

[registrations]                  ← 회원 신청 (확정 단계)
  ├─ id (PK)
  ├─ event_id (FK → events)
  ├─ member_id (FK → Member)
  ├─ status (pending / confirmed / cancelled / attended / no_show)
  ├─ amount, payment_method, depositor_name
  ├─ paid_at, attended_at, cancelled_at
  ├─ refund_amount
  ├─ memo
  └─ created_at / updated_at
  (unique: event_id + member_id)

[testimonials]                   ← 후기 (회차 진행 후)
  ├─ id (PK)
  ├─ event_id (FK → events, nullable)
  ├─ curriculum_id (FK → curriculums, nullable)
  ├─ member_id (FK → Member, nullable, 익명 가능)
  ├─ author_name, author_role     ← 익명 시 직접 입력
  ├─ content
  ├─ rating (1~5, optional)
  ├─ is_published (boolean)
  └─ created_at

[posts]                          ← 사이트 콘텐츠 글 (블로그 + Threads 자동 발행 소스)
  ├─ id (PK)
  ├─ slug (unique, URL-friendly)
  ├─ title, summary, content (markdown)
  ├─ cover_image
  ├─ tags (JSONB)
  ├─ status (draft / published)
  ├─ published_at
  ├─ author_id (FK → Member)
  ├─ thread_published_at        ← 자동 발행 시각
  ├─ thread_post_id             ← Threads API 응답
  └─ created_at / updated_at

[inquiries]                      ← Q&A / 문의
  ├─ id (PK)
  ├─ name, contact
  ├─ subject, message
  ├─ status (open / replied / closed)
  ├─ admin_reply
  ├─ replied_at
  └─ created_at

[site_config]                    ← 운영자 정보·사이트 메타 (singleton)
  ├─ id (PK, 항상 1)
  ├─ brand, tagline
  ├─ kakao_open_chat_url
  ├─ operator (JSONB — name, title, photo, story, credentials, contacts)
  └─ updated_at
```

### 관계 요약
- **Curriculum 1 : N Event** — 1주차 교안으로 N회 회차 열림 (Curriculum-Class 패턴)
- **Event 1 : N Application** — 한 회차에 N명 비회원 신청
- **Event 1 : N Registration** — 한 회차에 N명 회원 확정 (정원 제한)
- **Application N : 1 Member (선택)** — 비회원 신청자가 회원 가입하면 연결
- **Member 1 : N Registration** — 한 회원이 N개 회차 신청
- **Event 또는 Curriculum : N Testimonial** — 후기는 회차별 또는 교안별
- **Member 1 : N Post** — 운영자가 글 작성

## 4. API 엔드포인트 명세 (REST, /api/v1)

### 4-1. Auth (`/api/v1/auth`)
```
POST   /signup              회원 가입 (email + password + nickname)
POST   /login               로그인 → JWT (access + refresh)
POST   /refresh             access 토큰 갱신
POST   /logout              refresh 토큰 폐기
GET    /me                  현재 회원 정보 (JWT 필요)
PATCH  /me                  회원 정보 수정
POST   /oauth/kakao         카카오 OAuth 콜백 (Phase 2)
POST   /oauth/google        구글 OAuth 콜백 (Phase 2)
```

### 4-2. Curriculums (`/api/v1/curriculums`)
```
GET    /                    전체 커리큘럼 (active 우선)
GET    /:id                 1건 상세
POST   /                    추가 (admin)
PATCH  /:id                 수정 (admin)
DELETE /:id                 삭제 (admin)
```

### 4-3. Events (`/api/v1/events`)
```
GET    /                    전체 회차 (필터: source, type, region, date 등 query string)
GET    /:id                 1건 상세
GET    /:id/registrations   회차의 신청자 목록 (admin)
POST   /                    회차 추가 (admin)
PATCH  /:id                 수정 (admin)
DELETE /:id                 삭제 (admin)
GET    /upcoming            가까운 미래 회차만 (홈 추천 카드용)
```

### 4-4. Applications (`/api/v1/applications`) — 비회원도 가능
```
POST   /                    신청 (이름·연락처·동기·event_id) — anon OK
GET    /                    목록 (admin)
GET    /:id                 1건 (admin)
PATCH  /:id                 상태 변경·메모 (admin)
POST   /:id/convert         → 회원으로 승격 + Registration 생성 (admin)
```

### 4-5. Registrations (`/api/v1/registrations`)
```
POST   /                    회원 신청 (JWT 필요)
GET    /                    내 신청 목록 (JWT)
GET    /admin               전체 (admin)
PATCH  /:id                 상태 변경·결제 확인 (admin 또는 본인 취소)
DELETE /:id                 취소 (admin)
```

### 4-6. Testimonials (`/api/v1/testimonials`)
```
GET    /                    공개 후기 (홈 노출용)
POST   /                    후기 작성 (회원 또는 anon)
PATCH  /:id                 수정 (작성자 또는 admin)
DELETE /:id                 삭제 (admin)
```

### 4-7. Posts (`/api/v1/posts`)
```
GET    /                    공개 글 목록 (페이지네이션)
GET    /:slug               1편 본문
POST   /                    글 작성 (admin) — 발행 시 Threads API 자동 호출
PATCH  /:slug               수정 (admin)
DELETE /:slug               삭제 (admin)
POST   /:slug/publish       발행 (Threads 자동 발행 트리거)
```

### 4-8. Inquiries (`/api/v1/inquiries`)
```
POST   /                    문의 생성 (anon OK)
GET    /                    목록 (admin)
PATCH  /:id                 상태 변경·답변 (admin)
```

### 4-9. Site Config (`/api/v1/site`)
```
GET    /                    공개 메타 (operator 포함)
PATCH  /                    수정 (admin)
```

### 4-10. 통계·관리 (`/api/v1/admin`)
```
GET    /dashboard           매출·회원·신청 집계 (admin)
GET    /events/:id/attendance   출석 체크 시트 (admin)
```

## 5. 인증 전략 — JWT (DRF SimpleJWT)

| 항목 | 정책 |
|------|------|
| Access token | 15분 만료, Authorization: Bearer 헤더 |
| Refresh token | 7일 만료, HttpOnly Secure SameSite=Lax 쿠키 |
| Anon | 일부 엔드포인트 허용 (events GET, applications POST, inquiries POST) |
| Admin | role='admin' Member 만 (DRF permission class) |
| OAuth | 카카오·구글 (Phase 2 — 첫 회차 후) |

## 6. Docker 구성

### 6-1. `docker-compose.yml` (개발)
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vibe
      POSTGRES_USER: vibe
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5200:5432"        # 호스트 5200 → 컨테이너 5432
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vibe"]
      interval: 5s

  back:
    build: ./back
    command: python manage.py runserver 0.0.0.0:8000
    ports:
      - "8200:8000"        # 호스트 8200 → 컨테이너 8000
    environment:
      DATABASE_URL: postgres://vibe:${DB_PASSWORD}@db:5432/vibe
      DJANGO_SETTINGS_MODULE: config.settings.local
      SECRET_KEY: ${SECRET_KEY}
    volumes:
      - ./back:/app
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
```

### 6-2. `back/Dockerfile`
```dockerfile
FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "-w", "4"]
```

### 6-3. 운영 (Oracle VM)
- `docker-compose.prod.yml` — Postgres 별도 운영 (백업 용이) + gunicorn + nginx upstream
- 또는 systemd + venv (현재 `python manage.py runserver` 패턴 강화) — Docker 안 쓸 시
- **추천: Docker 로 통일** (이직 포트폴리오 가산점)

## 7. 폴더 구조 (정리 후)

```
vibe-coding/
├── front/                       # React (현재 그대로)
├── back/                        # Django REST
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── local.py         # DEBUG=True, DB localhost
│   │   │   └── production.py    # DEBUG=False, DB env
│   │   ├── urls.py              # /api/v1/ 라우트 모음
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── accounts/            # Member, JWT, OAuth
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── permissions.py
│   │   ├── curriculums/         # Curriculum
│   │   ├── events/              # Event, Application, Registration
│   │   ├── testimonials/        # Testimonial
│   │   ├── posts/               # Post (블로그 + Threads 자동발행)
│   │   ├── inquiries/           # Q&A
│   │   └── site/                # SiteConfig
│   ├── seeds/                   # JSON → DB 초기 시드 스크립트
│   │   ├── seed_curriculums.py
│   │   ├── seed_events.py
│   │   └── seed_site.py
│   └── tests/
├── docker-compose.yml           # 개발 (db + back)
├── docker-compose.prod.yml      # 운영 (db + back + nginx)
├── server.py                    # 프런트 배포 (현재 그대로)
└── deploy-back.py               # 백엔드 배포 (Docker 빌드 + push + ssh restart)
```

## 8. 마이그레이션 전략 (JSON → DB)

### 8-1. seed 스크립트 (`back/seeds/`)
- `seed_curriculums.py` — `front/src/pages/guide/oneday/Week*/meta.js` 의 META 객체를 Python dict 로 변환 (수작업 1회)
- `seed_events.py` — `front/public/data/events.json` 그대로 INSERT
- `seed_site.py` — `front/src/data/site.json` → site_config 1 row

### 8-2. 프런트 → 백엔드 단계적 전환
1. **Phase 1**: 백엔드 띄우고 seed 까지. 프런트는 여전히 JSON 직접 import (병렬 운영)
2. **Phase 2**: 프런트의 `useEvents` / `_curriculums.js` 를 `lib/api.js` (axios) 로 교체. 한 도메인씩.
3. **Phase 3**: JSON 파일 폐기. DB 만 단일 소스.

### 8-3. 회원 관련 (신규 흐름)
- **회원 가입 페이지** 신규 (`/signup`, `/login`)
- 기존 `RoleContext` (localStorage 토글) → JWT 기반으로 교체
- `AdminOnly`, `AdminDevOnly` 가드 내부 `useRole()` 만 JWT 검증으로 변경 (호출부 무수정)

## 9. 작업 일정 (5/13~ 본격, 5/10 영향 0)

### Sprint 1 (5/13~5/17, 5일) — 인프라 + 핵심 도메인
- [ ] Docker 구성 (postgres 5200 + django 8200) + 로컬 동작 확인
- [ ] requirements.txt — Django 5 + DRF + SimpleJWT + psycopg2 + django-cors-headers
- [ ] settings 분리 (base / local / production) + .env 변수
- [ ] Member 모델 + 마이그레이션 + JWT 인증
- [ ] Curriculum + Event 모델 + 마이그레이션 + seed
- [ ] CRUD API 엔드포인트 (Curriculum, Event)
- [ ] DRF Browsable API 로 동작 확인

### Sprint 2 (5/20~5/24, 5일) — 신청 흐름
- [ ] Application 모델 + API + seed 0건
- [ ] Registration 모델 + API
- [ ] 프런트 EventDetail 의 ApplyCTA → POST /api/v1/applications 직접 호출
- [ ] 운영자 admin 페이지 — Application 목록 + Registration 승격 액션
- [ ] 회원 가입 페이지 (`/signup`) + 로그인 (`/login`)

### Sprint 3 (5/27~5/31, 5일) — 콘텐츠 + 자동화
- [ ] Post 모델 + API + 발행 시 Threads API 자동 호출
- [ ] 사이트 `/posts/:slug` 라우트 + Markdown 렌더
- [ ] Testimonial 모델 + API + 사이트 마운트 (TESTIMONIALS 가짜 → DB)
- [ ] Inquiry 모델 + API + 사이트 문의 폼
- [ ] (옵션) GitHub Actions + Threads API 정기 발행

### Sprint 4 (6/3~6/7, 5일) — 운영 + 배포
- [ ] 운영 Docker (gunicorn + nginx) — Oracle VM 에 배포
- [ ] 백업 cron (postgres pg_dump 일일 → S3 또는 별도 디스크)
- [ ] 모니터링 (Sentry 또는 자체 로그)
- [ ] 카카오 OAuth (Phase 2)
- [ ] (옵션) Redis 캐싱 + Celery 큐

### Sprint 5+ (6월 중순+) — 결제 + 어드밴스드
- [ ] 토스페이먼츠 PG 연동 (Phase 2 트리거 도달 시 — CLAUDE.md 3절)
- [ ] 회원 알림톡 (사업자 등록 후)
- [ ] 다국어 (선택)

## 10. 결정 필요 항목

| # | 결정 | 옵션 | 추천 |
|---|------|------|------|
| A | DB 이름 | (1) `vibe` (2) `vibe_session` (3) `vibe_coding` | (1) 짧고 명확 |
| B | 인증 토큰 저장 | (1) localStorage (XSS 위험) (2) HttpOnly cookie (3) 메모리 + 쿠키 | (3) refresh=cookie, access=메모리 |
| C | OAuth 도입 시점 | (1) 처음부터 (2) Phase 2 (회원 50+) | (2) 처음엔 이메일만 |
| D | 운영 DB | (1) 같은 Oracle VM 위 docker postgres (2) 외부 RDS (Supabase Postgres 전용) | (1) 비용 0 |
| E | 회원 가입 방식 | (1) 이메일 인증 필수 (2) 가입 즉시 활성화 + 이메일 인증 선택 | (2) 마찰 ↓ |
| F | Application → Registration 전환 | (1) 자동 (회원가입 시) (2) 수동 (admin 승격) | (2) 1주차 운영 흐름 검증 후 자동화 |
| G | 후기 작성 권한 | (1) 회원만 (2) anon 도 가능 (이름 직접 입력) | (1) 회원 가입 인센티브 |
| H | 기존 back/ Django 13개 모델 | (1) 통째 재작성 (2) 기반으로 보강 | (2) Member·Event·Registration 은 좋음, 보강 |

## 11. 5/10 영향 보장

- 5/10 까지는 백엔드 코드 0줄 작성 안 함 (Sprint 1 시작 = 5/13)
- 5/10 회차 신청 흐름 = 현재 카톡 그대로 (또는 Tally 폼)
- 5/10 후 진짜 신청자 데이터 (1~3명) 를 DB seed 로 활용 가능

## 12. 한 줄 요약

**Django REST + Postgres + Docker — 5/10 후 5주 스프린트로 풀스택 백엔드 구축. 8200/5200 포트, 회원·신청·후기·콘텐츠·자동발행 다 자체 구현. 이직 포트폴리오 + 강의 7~8주차 정석 사례.**
