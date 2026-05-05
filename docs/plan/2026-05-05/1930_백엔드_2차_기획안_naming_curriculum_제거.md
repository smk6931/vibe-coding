# 백엔드 2차 기획안 — 이름 규칙 + Curriculum DB 제거 + slug PK

작성: 2026-05-05 19:30
선행 문서: `1914_백엔드_1차_기획안_django_postgres.md` (이 문서로 일부 갱신)

## 0. 1차 대비 핵심 변경 3가지

| # | 1차 | 2차 (이 문서) |
|---|-----|------|
| 1 | 모델 이름 자유 (Event, Registration, Member ...) | **도메인 prefix 통일 (event, event_application, event_registration ...)** |
| 2 | Curriculum 테이블 + curriculum_id FK | **Curriculum DB 제거. events.curriculum_slug (string) 만** |
| 3 | Integer PK + slug 별도 컬럼 | **도메인 entity = string slug PK / 트랜잭션 entity = integer PK** |

## 1. 이름 규칙 — Domain Prefix Tree

### 1-1. 룰

- **단일 도메인** = 짧게: `event`, `member`, `post`, `inquiry`, `site_config`
- **하위 도메인** = `parent_subdomain`: `event_application`, `event_registration`
- **더 깊으면** = `parent_sub_subsub`: `event_attendance_log` (필요할 때만)
- 이름 = 트리 구조. `ls` 처럼 prefix 보면 부모 즉시 파악

### 1-2. 우리 도메인 트리

```
event/
├── event                    회차 (Class instance, 시간·장소·결제)
├── event_application        비회원 신청 (1차 진입)
├── event_registration       회원 확정 신청
├── event_testimonial        후기
└── (선택) event_attendance_log

member/
├── member                   회원
├── member_profile           프로필 확장 (선택, member 안에 흡수해도 OK)
└── (선택) member_login_log

post/
├── post                     사이트 글 (블로그 + Threads 자동 발행 소스)
└── post_comment             댓글 (Phase 2)

inquiry/
└── inquiry                  Q&A 문의

site_config/
└── site_config              운영자 메타 (singleton)
```

### 1-3. Django 매핑

```python
# apps/events/models.py
class Event(models.Model):
    class Meta:
        db_table = 'event'

class EventApplication(models.Model):
    class Meta:
        db_table = 'event_application'

class EventRegistration(models.Model):
    class Meta:
        db_table = 'event_registration'

class EventTestimonial(models.Model):
    class Meta:
        db_table = 'event_testimonial'
```

Python 클래스명 = PascalCase, DB 테이블 = snake_case. Django 컨벤션 그대로 + 우리 트리 룰.

## 2. Curriculum DB 제거 — Frontend 단일 소스

### 2-1. 제거 결정 이유

- 교안 콘텐츠 = `pages/guide/oneday/Week*/index.jsx` + `Curriculum.jsx` + `components/Chapter*.jsx` 인라인
- DB 에 동일 콘텐츠 박으면 jsx ↔ DB 동기화 부담 + 단일 소스 원칙 깨짐
- 변경 시 두 군데 수정 = 실수 ↑

### 2-2. 대신: Soft Reference (events 의 string slug 컬럼)

```python
class Event(models.Model):
    id = models.SlugField(primary_key=True, max_length=100)
    curriculum_slug = models.CharField(max_length=50, blank=True)  # ← 'oneday-week-1' 같은 string
    # ... 기타 필드
```

- `events.curriculum_slug` = `'oneday-week-1'`
- frontend `pages/guide/oneday/Week1/meta.js` 의 `META.id = 'oneday-week-1'`
- 이 둘이 매칭되면 회차 ↔ 교안 연결
- DB 측은 단순 string. FK 검증 X (frontend 가 알아서 매칭)

### 2-3. frontend 표시 흐름

```js
// EventDetail (회차 상세) — 회차 + 교안 페이지 링크
const event = await fetch(`/api/v1/event/${id}`);  // event.curriculum_slug = 'oneday-week-1'
const curriculum = getCurriculum(event.curriculum_slug);  // _curriculums.js 인덱스 lookup
// curriculum 은 frontend Week1/meta.js 의 META 객체
```

### 2-4. 잠재 리스크 + 대응

| 리스크 | 대응 |
|------|------|
| jsx 에서 META.id rename | 그 시점에 events DB 의 curriculum_slug 도 일괄 UPDATE (마이그레이션 1번) |
| 잘못된 slug 입력 (오타) | ClassEditor admin UI 에서 dropdown (`_curriculums.js` 의 `CURRICULUMS.map(c => c.id)` 옵션) |
| 교안이 삭제되면? | events.curriculum_slug 가 dangling. 단 실 운영상 교안 삭제 일 ≈ 0 |

## 3. PK 전략 — Domain entity 만 string slug

### 3-1. 분류

| 종류 | 예시 | PK |
|------|------|-----|
| **Domain entity** (의미 있는 ID, 외부 노출, URL 등장) | event, member, post, inquiry, site_config | **string slug** |
| **Transaction entity** (누적 row, 외부 노출 X, 의미 없음) | event_application, event_registration, event_testimonial, member_login_log | integer auto-increment |

### 3-2. Domain entity slug 명명 규칙

| 도메인 | prefix | 예시 |
|--------|--------|------|
| event | `evt_` | `evt_week1_2026_05_10` |
| member | `mem_` | `mem_smk6931` (nickname 기반) |
| post | `pst_` | `pst_2026_05_10_supabase_vs_django` (날짜 + 제목 슬러그) |
| inquiry | `inq_` | `inq_2026_05_10_001` (날짜 + 일련) |
| site_config | (singleton) | `main` (한 row 만) |

**룰**:
- snake_case
- ASCII only (URL 친화)
- 의미 있는 segment (날짜 / 회차 / 닉네임)
- prefix 통일 — 디비에서 grep 가능

### 3-3. Transaction entity 는 그대로 integer

```python
class EventApplication(models.Model):
    id = models.AutoField(primary_key=True)  # 1, 2, 3, ...
    event = models.ForeignKey(Event, to_field='id', on_delete=models.CASCADE)  # FK 는 string slug
    # 외부 노출 시 ?id=42 또는 별도 token 사용
```

Application/Registration 은 매일 N개 누적, slug 어색 (`app_evt-week1_홍길동_20260510_142301`?). integer 가 깔끔.

### 3-4. 외부 노출용 (선택)

트랜잭션 entity 도 외부에 ID 노출 필요하면 `token` 컬럼 추가:
```python
class EventApplication(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=20, unique=True, default=generate_token)  # 외부용
```
URL: `/applications/{token}` (정수 ID 보다 안전, 추측 어려움)

## 4. 갱신된 ERD

```
[event]                            ← string PK 'evt_week1_2026_05_10'
  ├─ id (PK, slug)
  ├─ curriculum_slug (string, 'oneday-week-1' 같은 jsx 매칭)
  ├─ source ('internal' / 'external')
  ├─ type ('oneday_class' / 'study' / ...)
  ├─ status ('draft' / 'published' / 'cancelled')
  ├─ title, description, thumbnail
  ├─ start_at, end_at
  ├─ price, capacity, remaining, min_heads
  ├─ host_name, host_handle
  ├─ external_source, external_url
  ├─ venue (JSONB)
  ├─ payment (JSONB)
  ├─ policies (JSONB)
  ├─ tags (JSONB)
  ├─ apply_url (카톡 fallback)
  ├─ created_by_id (FK → member.id, slug)
  └─ created_at, updated_at

[event_application]                ← int PK
  ├─ id (PK, int)
  ├─ event_id (FK → event.id, slug)
  ├─ name, contact, motive
  ├─ source ('homepage' / 'threads' / 'instagram' / 'soomoim' / 'other')
  ├─ status ('pending' / 'contacted' / 'converted' / 'rejected')
  ├─ converted_member_id (FK → member.id, slug, nullable)
  ├─ admin_memo
  └─ created_at, updated_at

[event_registration]               ← int PK (회원 확정 신청)
  ├─ id (PK, int)
  ├─ event_id (FK → event.id, slug)
  ├─ member_id (FK → member.id, slug)
  ├─ status ('pending' / 'confirmed' / 'cancelled' / 'attended' / 'no_show')
  ├─ amount, payment_method, depositor_name
  ├─ paid_at, attended_at, cancelled_at
  ├─ refund_amount, memo
  └─ created_at
  (unique: event_id + member_id)

[event_testimonial]                ← int PK
  ├─ id (PK, int)
  ├─ event_id (FK → event.id, slug)
  ├─ member_id (FK → member.id, slug, nullable)
  ├─ author_name, author_role     ← 익명 시 직접
  ├─ content, rating
  ├─ is_published
  └─ created_at

[member]                           ← string PK 'mem_smk6931'
  ├─ id (PK, slug)
  ├─ email (unique, nullable for OAuth)
  ├─ nickname
  ├─ role ('member' / 'admin')
  ├─ provider ('email' / 'kakao' / 'google')
  ├─ provider_id
  ├─ avatar_url, bio
  ├─ is_active, is_staff
  └─ created_at, updated_at

[post]                             ← string PK 'pst_2026_05_10_supabase_django'
  ├─ id (PK, slug)
  ├─ title, summary, content (markdown)
  ├─ cover_image
  ├─ tags (JSONB)
  ├─ status ('draft' / 'published')
  ├─ published_at
  ├─ author_id (FK → member.id, slug)
  ├─ thread_published_at, thread_post_id (Threads API 응답)
  └─ created_at, updated_at

[inquiry]                          ← string PK 'inq_2026_05_10_001'
  ├─ id (PK, slug)
  ├─ name, contact
  ├─ subject, message
  ├─ status ('open' / 'replied' / 'closed')
  ├─ admin_reply, replied_at
  └─ created_at

[site_config]                      ← string PK 'main' (singleton)
  ├─ id (PK, slug, default='main')
  ├─ brand, tagline
  ├─ kakao_open_chat_url
  ├─ operator (JSONB)
  └─ updated_at
```

## 5. 갱신된 API 경로

### 5-1. URL 친화

| 엔드포인트 | slug 활용 |
|----------|---------|
| `GET /api/v1/event/evt_week1_2026_05_10` | event slug 직접 |
| `GET /api/v1/post/pst_2026_05_10_supabase_django` | post slug 직접 |
| `GET /api/v1/member/mem_smk6931` | member slug 직접 |

URL 만 봐도 의미 파악. SEO 도 친화 (post slug 가 검색 키워드 포함).

### 5-2. 트랜잭션 엔티티는 다른 패턴

| 엔드포인트 | 패턴 |
|----------|------|
| `POST /api/v1/event/evt_week1_2026_05_10/application` | 부모 slug 안에서 child 생성 |
| `GET /api/v1/event/evt_week1_2026_05_10/application` | 그 회차의 신청 목록 (admin) |
| `GET /api/v1/application/42` | 단일 application (token 도입 시 token 으로) |

## 6. JOIN 예시 (디비 직접 봐도 의미 파악)

```sql
-- 1주차 회차의 후기 + 작성자 닉네임
SELECT et.content, et.rating, m.nickname
FROM event_testimonial et
LEFT JOIN member m ON et.member_id = m.id
WHERE et.event_id = 'evt_week1_2026_05_10';

-- 1주차 교안 시리즈 (4주차 전체) 의 후기 통합
SELECT et.*, e.title AS event_title
FROM event_testimonial et
JOIN event e ON et.event_id = e.id
WHERE e.curriculum_slug = 'oneday-week-1';

-- 회원의 신청 이력
SELECT e.title, e.start_at, er.status
FROM event_registration er
JOIN event e ON er.event_id = e.id
WHERE er.member_id = 'mem_smk6931'
ORDER BY e.start_at DESC;
```

→ 모든 join 키가 의미 있는 string. 디비 들여다볼 때 헷갈림 0.

## 7. 결정 필요 항목 (1차에서 변경)

| # | 결정 | 옵션 | 추천 |
|---|------|------|------|
| A | Curriculum DB | (1) 별도 테이블 / **(2) frontend jsx 단일 소스 + events.curriculum_slug** | **(2)** ✅ 사용자 결정 |
| B | Domain entity PK | (1) integer + slug 컬럼 / **(2) string slug PK** | **(2)** ✅ 사용자 결정 |
| C | Transaction entity PK | (1) string slug / **(2) integer auto + (선택) token** | **(2)** 추천 |
| D | slug prefix | (1) 안 씀 (`week1_2026_05_10`) / **(2) 도메인 prefix (`evt_week1_2026_05_10`)** | **(2)** grep 친화 |
| E | post slug 자동 생성 | (1) 수동 (admin 입력) / (2) 제목에서 자동 변환 | (2) + 수동 override 옵션 |
| F | member slug 결정 | (1) nickname 기반 (`mem_smk6931`) / (2) UUID (`mem_550e8400`) | (1) 가독성 |

## 8. 1차 기획안 → 2차 변경 요약

### 변경됨 (이 문서로 갱신)
- 모든 모델 이름 → 도메인 prefix 패턴 (`event_*`, `member_*`)
- Curriculum 테이블 → 폐기. `events.curriculum_slug` 만
- Domain entity PK → string slug

### 그대로 유지 (1차 기획 OK)
- Docker 구성 (postgres 5200 / django 8200)
- Sprint 일정 (5/13~6/7, 4 sprint)
- API 경로 prefix (`/api/v1`)
- JWT 인증 (DRF SimpleJWT)
- 5/10 영향 0 약속

### 후속 작업
- 1차 기획안의 ERD / 모델 명세 → 이 문서가 단일 소스
- Sprint 1 시작 (5/13) 시 이 문서 따라 모델 정의

## 9. 한 줄 요약

**도메인 prefix tree (event_*) + Curriculum DB 제거 (jsx 단일 소스) + Domain entity string slug PK. 디비 들여다볼 때 의미 즉시 파악, jsx ↔ DB 동기화 부담 0, URL 친화 SEO.**
