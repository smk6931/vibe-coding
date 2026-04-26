# 바이브 세션 — 시스템 아키텍처 설계 (Phase 2)

작성일: 2026-04-26  
기준: Phase 1(정적 프로토타입) 완료 후 백엔드 연결 단계

---

## 1. 전체 구조 한 장 요약

```
[사용자 브라우저]
       │  HTTPS (80/443)
       ▼
  [Nginx — Oracle VM]
  ├─ /api/*   → proxy → [Node.js 백엔드 :4000]
  └─ /*       → proxy → [Next.js 서버 :3000]
                              │
                       Next.js App Router
                       (SSR + 정적 페이지 혼합)
                              │
                       [PostgreSQL :5432]
                       (Oracle VM 동일 박스)
```

- **Oracle VM 한 박스** — 프론트·백엔드·DB 전부. 1인 운영 초기엔 이게 제일 현실적.
- **두 프로세스** — Next.js(PM2), Node.js API(PM2). Nginx가 라우팅.
- **Phase 1 → 2 전환 핵심**: `output: 'export'` 제거 → Next.js SSR 모드. 기존 정적 페이지는 그대로 동작, API 라우트 + 동적 페이지가 추가됨.

---

## 2. Phase 전환 로드맵

| Phase | 프론트 | 백엔드 | DB | 배포 |
|-------|--------|--------|-----|------|
| **1 (현재)** | Next.js `output:'export'` 정적 | 없음 | JSON 파일 | Nginx 정적 serving |
| **2 (다음)** | Next.js SSR 모드 | Node.js + Hono | PostgreSQL | Nginx → PM2 프록시 |
| **3** | 동일 | 동일 + Redis 캐시 | 동일 + 백업 자동화 | 도메인 + SSL |
| **4** | 동일 | + Socket.io 채팅 | + 파일 스토리지 | CDN (Cloudflare) |

---

## 3. 디렉토리 구조

### 3-1. 전체 리포 레이아웃

```
c:\GitHub\vibe_coding\
├── front/                 # Next.js 14 (App Router) — Phase 2부터 SSR
├── backend/               # Node.js API 서버 — NEW
├── docs/
│   ├── arch/              # 이 문서
│   ├── plan/              # 기획안
│   └── task/              # 작업 로그
└── CLAUDE.md
```

### 3-2. front/ — Next.js (Phase 2 변경사항 표시)

```
front/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            (홈 — SSG → SSR로 전환, DB 데이터 직접)
│   ├── events/
│   │   ├── [id]/page.tsx   (이벤트 상세)
│   │   └── new/page.tsx    (이벤트 등록 — 어드민)
│   ├── library/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── community/
│   │   ├── page.tsx
│   │   ├── board/page.tsx
│   │   ├── members/page.tsx
│   │   └── qa/page.tsx
│   ├── me/page.tsx         (마이페이지)
│   ├── admin/              (어드민 — /admin/* role guard)
│   │   ├── page.tsx        (매출·예약 대시보드)
│   │   ├── events/page.tsx
│   │   ├── members/page.tsx
│   │   └── content/page.tsx
│   └── auth/
│       ├── login/page.tsx
│       └── callback/page.tsx
│
├── components/             (기존 UI 컴포넌트 — 변경 없음)
│
├── lib/
│   ├── format.ts           (기존)
│   ├── api.ts              (NEW — fetch 래퍼, /api/* 호출용)
│   └── auth-context.tsx    (NEW — 클라이언트 인증 상태)
│
├── public/
│   ├── data/               (Phase 2 이후 deprecated — DB로 이전)
│   └── favicon.svg
│
├── next.config.mjs         (output:'export' 제거)
└── .env.local
    # NEXT_PUBLIC_API_URL=http://localhost:4000   (dev)
    # NEXT_PUBLIC_API_URL=http://168.107.52.201   (prod — nginx가 /api/* 프록시)
```

### 3-3. backend/ — Node.js API 서버 (NEW)

```
backend/
├── src/
│   ├── app.ts              (Hono 인스턴스 생성·미들웨어·라우터 마운트)
│   ├── server.ts           (포트 4000, HTTP 서버 시작)
│   │
│   ├── domains/            (도메인별 분리 — 라우터·서비스·레포 한 세트)
│   │   ├── auth/
│   │   │   ├── auth.router.ts   (POST /auth/login, /auth/register, /auth/kakao)
│   │   │   ├── auth.service.ts  (JWT 발급, 비밀번호 해싱, 소셜 토큰 검증)
│   │   │   └── auth.schema.ts   (Zod 입력 검증 스키마)
│   │   │
│   │   ├── events/
│   │   │   ├── events.router.ts
│   │   │   ├── events.service.ts
│   │   │   ├── events.repo.ts   (DB 쿼리만 — SELECT/INSERT/UPDATE)
│   │   │   └── events.schema.ts
│   │   │
│   │   ├── registrations/       (신청·예약·입금 확인)
│   │   │   ├── registrations.router.ts
│   │   │   ├── registrations.service.ts
│   │   │   └── registrations.repo.ts
│   │   │
│   │   ├── members/
│   │   │   ├── members.router.ts
│   │   │   ├── members.service.ts
│   │   │   └── members.repo.ts
│   │   │
│   │   ├── library/
│   │   │   ├── library.router.ts
│   │   │   ├── library.service.ts
│   │   │   └── library.repo.ts
│   │   │
│   │   ├── community/
│   │   │   ├── showcase.router.ts
│   │   │   ├── posts.router.ts
│   │   │   └── community.repo.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.router.ts  (role: admin 미들웨어 필수)
│   │       └── admin.service.ts
│   │
│   └── shared/
│       ├── db/
│       │   ├── client.ts        (pg Pool 싱글턴)
│       │   └── schema.ts        (Drizzle 테이블 정의)
│       ├── middleware/
│       │   ├── auth.ts          (JWT 검증 → ctx.user 주입)
│       │   ├── admin.ts         (role === 'admin' guard)
│       │   └── error.ts         (전역 에러 핸들러)
│       └── types.ts             (공통 타입)
│
├── migrations/
│   ├── 0001_init.sql
│   └── 0002_add_registrations.sql
│
├── scripts/
│   └── seed.ts             (JSON 파일 → DB 초기 데이터 이전)
│
├── .env
│   # DATABASE_URL=postgresql://vibe:pw@localhost:5432/vibe_db
│   # JWT_SECRET=...
│   # KAKAO_CLIENT_ID=...
│
├── package.json
├── tsconfig.json
└── ecosystem.config.js     (PM2 설정)
```

---

## 4. 기술 스택 선택

| 레이어 | 선택 | 이유 |
|--------|------|------|
| **API 프레임워크** | **Hono** | Express보다 가볍고 빠름. TypeScript-first. Zod 연동 내장. 동일한 JS 생태계 |
| **ORM** | **Drizzle ORM** | SQL을 직접 쓰는 느낌으로 제어. 타입 완전 추론. Prisma보다 번들 가벼움 |
| **DB 클라이언트** | **node-postgres (pg)** | Drizzle과 함께. Oracle VM PostgreSQL 직접 연결 |
| **인증** | **JWT (jsonwebtoken)** | 스테이트리스. 별도 세션 서버 불필요. 1인 운영에 맞음 |
| **비밀번호** | **bcrypt** | 표준 |
| **입력 검증** | **Zod** | 프론트·백 모두 동일 라이브러리 (공유 타입 가능) |
| **프로세스 관리** | **PM2** | Next.js + Node.js 각각 프로세스. 크래시 자동 재시작. 로그 관리 |

---

## 5. DB 스키마

```sql
-- 회원
CREATE TABLE members (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email        TEXT UNIQUE,
  nickname     TEXT NOT NULL,
  avatar_url   TEXT,
  role         TEXT DEFAULT 'member',       -- member | admin
  provider     TEXT NOT NULL,               -- email | kakao | google
  provider_id  TEXT,
  bio          TEXT,
  stack        TEXT[],                      -- 관심 스택 태그
  looking_for_study BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 이벤트 (자체 + 외부 통합)
CREATE TABLE events (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source          TEXT NOT NULL,            -- internal | external
  type            TEXT NOT NULL,            -- oneday_class | study | hackathon | seminar | mogakco
  status          TEXT DEFAULT 'draft',     -- draft | published | cancelled
  title           TEXT NOT NULL,
  description     TEXT,
  thumbnail       TEXT,
  start_at        TIMESTAMPTZ NOT NULL,
  end_at          TIMESTAMPTZ NOT NULL,
  level           TEXT,                     -- 입문 | 초중급 | 전체레벨
  price           INTEGER DEFAULT 0,
  capacity        INTEGER,
  remaining       INTEGER,
  host_name       TEXT,
  external_source TEXT,                     -- 소모임·당근 등 출처
  external_url    TEXT,                     -- 외부 링크
  venue_name      TEXT,
  venue_address   TEXT,
  venue_lat       NUMERIC(10,7),
  venue_lng       NUMERIC(10,7),
  tags            TEXT[],
  created_by      UUID REFERENCES members(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 신청/예약
CREATE TABLE registrations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id        UUID REFERENCES events(id) NOT NULL,
  member_id       UUID REFERENCES members(id) NOT NULL,
  status          TEXT DEFAULT 'pending',   -- pending | confirmed | cancelled | attended
  amount          INTEGER DEFAULT 0,
  payment_method  TEXT DEFAULT 'account',   -- account | toss | card
  depositor_name  TEXT,                     -- 입금자명 (계좌이체 확인용)
  paid_at         TIMESTAMPTZ,
  attended_at     TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,
  refund_amount   INTEGER,
  memo            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- 학습 라이브러리
CREATE TABLE library_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  format       TEXT NOT NULL,              -- book | video | blog
  title        TEXT NOT NULL,
  summary      TEXT,
  content      TEXT,                       -- Markdown (블로그 본문)
  thumbnail    TEXT,
  category     TEXT,
  level        TEXT,
  access       TEXT DEFAULT 'free',        -- free | member | paid
  price        INTEGER DEFAULT 0,
  read_min     INTEGER,
  duration_min INTEGER,
  pages        INTEGER,
  external_url TEXT,
  tags         TEXT[],
  published    BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by   UUID REFERENCES members(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 커뮤니티 쇼케이스
CREATE TABLE showcase_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id    UUID REFERENCES members(id) NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  thumbnail    TEXT,
  demo_url     TEXT,
  repo_url     TEXT,
  tags         TEXT[],
  likes_count  INTEGER DEFAULT 0,
  published    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 커뮤니티 게시글 (자유·Q&A·공지)
CREATE TABLE posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board        TEXT NOT NULL,              -- general | qa | notice
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  author_id    UUID REFERENCES members(id) NOT NULL,
  views        INTEGER DEFAULT 0,
  pinned       BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 댓글 (게시글 + 쇼케이스 공유)
CREATE TABLE comments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id      UUID REFERENCES posts(id),
  showcase_id  UUID REFERENCES showcase_items(id),
  author_id    UUID REFERENCES members(id) NOT NULL,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (post_id IS NOT NULL AND showcase_id IS NULL) OR
    (post_id IS NULL AND showcase_id IS NOT NULL)
  )
);

-- 좋아요
CREATE TABLE likes (
  member_id    UUID REFERENCES members(id) NOT NULL,
  showcase_id  UUID REFERENCES showcase_items(id),
  post_id      UUID REFERENCES posts(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (member_id, COALESCE(showcase_id, '00000000-0000-0000-0000-000000000000'),
                           COALESCE(post_id,     '00000000-0000-0000-0000-000000000000'))
);
```

---

## 6. API 엔드포인트 목록

베이스 URL: `/api/v1`  
인증: `Authorization: Bearer <JWT>` (필요한 엔드포인트만)

### Auth
```
POST   /auth/register              - 이메일 회원가입
POST   /auth/login                 - 이메일 로그인 → {accessToken, refreshToken}
POST   /auth/kakao                 - 카카오 로그인 (소셜 토큰 교환)
GET    /auth/me                    - 내 프로필 [인증]
POST   /auth/refresh               - 토큰 갱신
```

### Events (이벤트·모임)
```
GET    /events                     - 목록 (쿼리: type, source, from, to, region, q)
GET    /events/:id                 - 상세
POST   /events                     - 등록 [admin]
PUT    /events/:id                 - 수정 [admin]
DELETE /events/:id                 - 삭제 [admin]
POST   /events/:id/register        - 신청 [인증]
DELETE /events/:id/register        - 신청 취소 [인증]
GET    /events/:id/registrations   - 신청자 목록 [admin]
PUT    /events/:id/registrations/:rid/confirm  - 입금 확인 [admin]
PUT    /events/:id/registrations/:rid/attend   - 출석 체크 [admin]
```

### Members
```
GET    /members                    - 회원 디렉토리 (public: nickname·stack·bio)
GET    /members/:id                - 회원 프로필
PUT    /members/me                 - 내 프로필 수정 [인증]
GET    /members/me/registrations   - 내 수강 내역 [인증]
```

### Library
```
GET    /library                    - 목록 (쿼리: format, category, level, access, q)
GET    /library/:id                - 상세 (access=member → 인증 필요)
POST   /library                    - 등록 [admin]
PUT    /library/:id                - 수정 [admin]
DELETE /library/:id                - 삭제 [admin]
```

### Community
```
GET    /community/showcase         - 쇼케이스 목록
POST   /community/showcase         - 쇼케이스 등록 [인증]
PUT    /community/showcase/:id     - 수정 [인증·본인]
DELETE /community/showcase/:id     - 삭제 [인증·본인 or admin]
POST   /community/showcase/:id/like  - 좋아요 [인증]

GET    /community/posts            - 게시글 목록 (쿼리: board)
GET    /community/posts/:id        - 게시글 상세
POST   /community/posts            - 게시글 등록 [인증]
PUT    /community/posts/:id        - 수정 [인증·본인]
DELETE /community/posts/:id        - 삭제 [인증·본인 or admin]
GET    /community/posts/:id/comments   - 댓글 목록
POST   /community/posts/:id/comments   - 댓글 등록 [인증]
```

### Admin
```
GET    /admin/stats                - 대시보드 통계 (매출·회원 수·신청 수) [admin]
GET    /admin/registrations        - 전체 신청 내역 [admin]
GET    /admin/members              - 전체 회원 [admin]
PUT    /admin/members/:id/role     - 역할 변경 [admin]
PUT    /admin/members/:id/ban      - 정지 [admin]
```

---

## 7. 인증 흐름

```
[로그인 요청] → POST /api/v1/auth/login
                      │
               비밀번호 검증 (bcrypt)
                      │
            ┌─────────┴───────────┐
      accessToken (15분)   refreshToken (30일, HttpOnly cookie)
            │
      클라이언트 메모리 보관
      (localStorage X — XSS 위험)
            │
      API 요청마다 Authorization 헤더
            │
      15분 만료 시 → /auth/refresh → 새 accessToken
```

**소셜 로그인 (카카오)**:
```
클라이언트 → 카카오 OAuth 팝업 → 인가코드
→ POST /api/v1/auth/kakao {code}
→ 서버가 카카오 토큰 교환 + 회원 생성/조회
→ 내부 JWT 발급 (카카오 토큰 클라이언트에 안 줌)
```

---

## 8. Nginx 설정 (Phase 2)

```nginx
server {
    listen 80;
    server_name 168.107.52.201;

    # API → Node.js 백엔드
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 나머지 → Next.js SSR 서버
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

---

## 9. PM2 설정 (ecosystem.config.js)

```js
module.exports = {
  apps: [
    {
      name: 'vibe-front',
      cwd: '/var/www/vibe/front',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'vibe-api',
      cwd: '/var/www/vibe/backend',
      script: 'dist/server.js',
      instances: 1,
      env: { NODE_ENV: 'production', PORT: 4000 },
    },
  ],
};
```

---

## 10. Phase 1 → Phase 2 전환 체크리스트

```
[ ] backend/ 디렉토리 생성 + npm init
[ ] Hono, Drizzle, pg, zod, jsonwebtoken, bcrypt 설치
[ ] DB 스키마 migration 실행 (Oracle VM PostgreSQL)
[ ] seed.ts 작성 — 기존 JSON 데이터 DB 이전
[ ] 인증 엔드포인트 구현 + 테스트
[ ] events API 구현 (GET 목록·상세 먼저)
[ ] front/next.config.mjs: output:'export' 제거
[ ] front/lib/api.ts 작성 — fetch 래퍼
[ ] 홈·이벤트 페이지 JSON import → API fetch로 교체
[ ] Nginx 설정 변경 (정적 → 프록시)
[ ] PM2 ecosystem.config.js 배포
[ ] 어드민 회원·이벤트·신청 관리 화면 구현
[ ] PostgreSQL daily 백업 스크립트 세팅 (pg_dump → 로컬 or R2)
```

---

## 11. 결정해야 할 것들 (시작 전)

| 항목 | 옵션 | 추천 |
|------|------|------|
| 소셜 로그인 | 카카오만 / 카카오+구글 / 이메일+카카오 | **이메일+카카오** — 카카오는 한국 사용자 UX, 이메일은 fallback |
| 이미지 업로드 | Oracle VM 디스크 / Cloudflare R2 | **R2** — 무료 10GB/월, VM 디스크 용량 아낌 |
| 백업 대상 | DB만 / DB+업로드파일 | **DB만** (Phase 2), 파일은 R2가 알아서 |
| 카카오 알림톡 | Phase 2 포함 / Phase 3 | **Phase 3** — 사업자 등록 + 채널 개설 필요, 그 전엔 이메일로 |

---

> 이 문서는 설계 기준. 실제 구현 시 `docs/task/`에 작업 로그를 남길 것.
