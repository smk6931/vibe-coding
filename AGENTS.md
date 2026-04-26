# AGENTS.md — 바이브 세션 프로젝트

AI 에이전트가 이 프로젝트를 처음 볼 때 읽어야 할 핵심 정보.
상세 규칙은 `CLAUDE.md` 참고.

---

## 프로젝트 한 줄 요약

바이브코딩 오프라인 소모임 플랫폼. 모임 대시보드 + 강의 가이드 + 커뮤니티.
현재 Phase 1 (정적 더미 데이터). Phase 2부터 Django 백엔드 + PostgreSQL 연동.

---

## 스택

- **프론트**: React 18 + Vite + React Router v6 + Tailwind CSS
- **백엔드**: Django 5 + DRF + PostgreSQL (Phase 2~)
- **배포**: Oracle Cloud VM, Nginx 정적 호스팅

---

## src/ 구조 — 반드시 숙지

```
front/src/
├── app.jsx          BrowserRouter + 라우트 조립 (routes/만 import)
├── routes/          ★ URL 라우트 정의 전용
│   ├── index.js     모든 라우트 re-export
│   ├── community.jsx  /community/*
│   └── guide.jsx      /guide/*
├── pages/           페이지 UI 컴포넌트 (라우트 정의 없음)
│   ├── community/   CommunityLayout + index/board/members/qa
│   └── guide/       GuideLayout + GuideSidebar + oneday/beginner/claude
├── components/      2개 이상 페이지가 쓰는 재사용 컴포넌트
└── client/          백엔드 API 통신 (axios)
```

**새 페이지 추가 순서:**
1. `pages/<domain>/` 안에 UI 컴포넌트 작성
2. `routes/<domain>.jsx`에 경로 추가
3. `app.jsx`는 건드리지 않아도 됨

---

## 라우트 목록

| URL | 파일 | 상태 |
|-----|------|------|
| `/` | pages/Home.jsx | 운영중 |
| `/events/:id` | pages/EventDetail.jsx | 운영중 |
| `/guide` | pages/guide/index.jsx | 운영중 |
| `/guide/oneday/install` | pages/guide/oneday/Install.jsx | 운영중 |
| `/guide/oneday/preview` | pages/guide/oneday/Preview.jsx | 운영중 |
| `/guide/beginner` | pages/guide/beginner/index.jsx | 준비중 |
| `/guide/claude` | pages/guide/claude/index.jsx | 준비중 |
| `/community` | pages/community/index.jsx | 운영중 |
| `/community/board` | pages/community/board.jsx | 백엔드 대기 |
| `/community/members` | pages/community/members.jsx | 운영중 |
| `/community/qa` | pages/community/qa.jsx | 백엔드 대기 |
| `/me` | pages/Me.jsx | 스텁 |
| `/admin` | pages/Admin.jsx | 스텁 |

---

## 핵심 규칙 (CLAUDE.md 요약)

- **모바일 우선**: 360~430px 기준으로 먼저 짜고 `sm:` `lg:` 확장
- **지도**: OpenStreetMap + Leaflet (키 불필요). 카카오맵은 Phase 3~
- **결제**: Phase 2 전까지 PG 자동결제 코드 넣지 않음
- **컬러**: brand(indigo) + slate. `gray-*` 금지. 이모지 금지
- **사진**: Unsplash 직링크 사용 (`images.unsplash.com`)
- **데이터**: Phase 1은 `public/data/*.json`. Phase 2에 PG로 동일 스키마 이전
- **dev 서버**: 한 번에 하나만 (`.next` 캐시 충돌 방지 — 이 프로젝트는 Vite)

---

## 로컬 실행

```bash
# 프론트
cd front && npm install && npm run dev   # → http://localhost:3200

# 백엔드
cd back && venv/Scripts/activate
python manage.py runserver               # → http://localhost:8000
```

---

## 파일 수정 전 확인사항

- `routes/` 건드리면 → `app.jsx` import 경로 깨지지 않는지 확인
- `public/data/*.json` 필드명 바꾸면 → Phase 2 DB 컬럼과 동기화 필요
- `GuideLayout` / `CommunityLayout` 수정 시 → 해당 도메인 전체 페이지 영향
