# Sprint 1 — Docker + Django + JWT + Registration 검증 완료

작성: 2026-05-05 20:59
선행: `docs/plan/2026-05-05/2014_백엔드_5차_기획안_FINAL.md`

## 작업 배경

5차 기획안 확정 후 즉시 진행 (5/13 약속 깨고 5/5 시작 — 사용자 요청).
Sprint 1 의 목표 = Docker 환경 + Member auth + Event/Registration CRUD 동작.

## 왜 이 방법

- **AbstractBaseUser + email USERNAME_FIELD**: 사용자가 직접 ID 입력 폐기 (가입 마찰 ↓). email 만 받고 handle 자동 생성. password 는 Django 표준(set_password, PBKDF2 해싱) 으로 평문 저장 사고 0.
- **int PK + slug 컬럼 분리**: 실무 표준. URL=slug, join=int FK. 면접 안전.
- **EventApplication 폐기**: 회원가입 강제. 회원 자산 누적.
- **Docker compose 단일 파일**: 운영자 1인이 한 명령으로 띄움. postgres 5200 / django 8200 호스트 매핑.
- **front:/front:ro 마운트**: seed_event 가 컨테이너 안에서 events.json 읽도록.

## 실패한 시도 (디버깅 과정)

### 시도 1 — 빌드 후 startup 실패
```
NameError: name 'Registration' is not defined. Did you mean: 'EventRegistration'?
```
**원인**: serializers.py 의 옛 코드 (`Registration` 모델 참조) 가 새 코드 아래에 잔존.
**해결**: 옛 클래스 (`RegistrationSerializer`, `EventListSerializer`, 중복 `EventSerializer`) 통째 제거.

### 시도 2 — views.py 에서 같은 패턴
```
ImportError: cannot import name 'Registration' from 'apps.events.models'
```
**원인**: views.py 끝에 옛 import (`from .models import Event, Registration`) + 옛 EventViewSet 잔존.
**해결**: 옛 코드 통째 제거. services.py 도 옛 모델 참조 — placeholder 로 비움.

### 시도 3 — startup ValueError
```
ValueError: Dependency on app with no migrations: accounts
```
**원인**: `events.models` 의 ForeignKey 가 `settings.AUTH_USER_MODEL` (accounts.Member) 인데 accounts 마이그레이션이 아직 없음. Django 가 startup 시 graph 빌드 실패.
**해결**: `docker compose exec back python manage.py makemigrations accounts events` → 마이그레이션 파일 생성 → migrate → 통과.

### 시도 4 — seed_event 경로 실패
```
파일 없음: /front/public/data/events.json
```
**원인**: docker-compose 가 `./back:/app` 만 마운트. `front/` 는 컨테이너 안에 없음.
**해결**: `volumes: - ./front:/front:ro` 추가 (read-only). 컨테이너 안에서 `/front/public/data/events.json` 접근 가능.

### 시도 5 — Registration 신청 시 author_name 필수 에러
```
{"author_name":["이 필드는 필수 항목입니다."]}
```
**원인**: serializer 의 required=True 가 create() 의 setdefault 보다 먼저 검증.
**해결**: `extra_kwargs` 로 author_name/author_phone 을 required=False, allow_blank=True. create() 에서 값 비어있으면 member 정보로 채움.

## 수정 파일 (Sprint 1)

### 신규
- `Dockerfile` (back/) — python:3.12-slim + gunicorn
- `docker-compose.yml` (root) — postgres 5200 + django 8200 + front:ro 마운트
- `back/apps/events/management/commands/seed_event.py` — events.json → DB

### 재작성
- `back/apps/accounts/models.py` — AbstractBaseUser, email USERNAME_FIELD, handle 자동 생성
- `back/apps/accounts/serializers.py` — Signup / Member / MemberPublic
- `back/apps/accounts/views.py` — signup / me (GET·PATCH·DELETE purge)
- `back/apps/accounts/urls.py` — signup/login/refresh/logout/me
- `back/apps/events/models.py` — Event + EventRegistration + EventTestimonial (int PK + slug, JSONB venue/payment/policies/tags, author_name 보존, token unique)
- `back/apps/events/serializers.py` — 3개
- `back/apps/events/views.py` — 3 ViewSet + IsAdminRole
- `back/apps/events/urls.py` — DefaultRouter 3개
- `back/apps/events/services.py` — placeholder (Sprint 2 정원 트랜잭션 예정)
- `back/config/urls.py` — community/library 제거
- `back/config/settings/base.py` — DB_NAME=vibe, port 5200, CORS, INSTALLED_APPS 정리, token_blacklist 추가

### 수정
- `back/requirements.txt` — python-slugify, nanoid 추가
- `.env.example` — 백엔드 변수 (SECRET_KEY, DB_*) 추가

### Rename (보관)
- `back/apps/library/` → `library-archive/`
- `back/apps/community/` → `community-archive/`

## 검증 결과 (curl 로 end-to-end)

| 엔드포인트 | 결과 |
|----------|------|
| `docker compose up -d --build` | ✅ vibe-db (healthy) + vibe-back (Up) |
| `makemigrations accounts events` | ✅ 0001_initial.py (Member, Event, EventRegistration, EventTestimonial) |
| `migrate` | ✅ accounts + events + token_blacklist 다 OK |
| `seed_event` | ✅ 4건 생성 |
| `GET /api/v1/event/` | ✅ count=1 (게시 1건만 anon 노출) |
| `POST /api/v1/auth/signup/` | ✅ JWT access + refresh + user (handle='test' 자동 생성) |
| `POST /api/v1/auth/login/` | ✅ access + refresh |
| `GET /api/v1/auth/me/` | ✅ JWT 헤더로 본인 정보 |
| `POST /api/v1/registration/` | ✅ token 'yWrws6z3jfV5' 발급, status='pending', author_name 자동 채움 |
| `GET /api/v1/registration/me/` | ✅ 내 신청 1건 |

## 남은 리스크

- **dev 서버 (runserver)** 로 띄움 — 운영은 gunicorn (Dockerfile 의 CMD). compose 가 command override 중.
- **Registration 정원 트랜잭션 미구현** — 동시 신청 시 race condition 위험. Sprint 2 에서 `select_for_update()` 추가 예정.
- **권한 정책 단순** — admin/member 만. owner 권한 (본인 cancel 등) 은 object-level permission 추가 필요.
- **CORS** — localhost:3200 + vibe.me.kr 화이트리스트만. 프런트가 axios 호출 시 동작 확인 필요 (Sprint 2).
- **community/library archive** — 폴더는 보관, INSTALLED_APPS / urls 에서 제거. 마이그레이션 파일도 X. 부활하려면 별도 작업.

## 다음 작업 (Sprint 2)

- 정원 트랜잭션 (`select_for_update()` + remaining -= 1)
- 프런트 회원가입/로그인 페이지
- 프런트 EventDetail 신청 흐름 → axios + JWT
- RoleContext (localStorage) → JWT 기반 교체
- admin 페이지 — Registration 목록 + 상태 변경

## 5/10 회차 영향

- 백엔드 띄웠지만 **프런트는 여전히 JSON 직접 import** (병렬 운영)
- 5/10 카톡 신청 흐름 그대로
- 5/13 후 프런트 axios 교체 시점에 흐름 전환
