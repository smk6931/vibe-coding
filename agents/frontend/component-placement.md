---
Title: 컴포넌트 위치 규칙 + 라우트-파일 매핑
Description: 새 컴포넌트 파일을 components/ vs pages/[route]/ 중 어디에 놓을지 + URL 라우트와 파일 경로 매칭 규칙
When-To-Read: 새 컴포넌트 파일 만들 때, 새 페이지 라우트 추가할 때, 기존 컴포넌트/페이지 이동/정리할 때
Keywords: component placement, co-location, components/, pages/, 컴포넌트 위치, 폴더 구조, 라우트, 파일 매핑, route mapping, dynamic route, [id]
Priority: high
---

# 컴포넌트 위치 규칙 + 라우트-파일 매핑

## A. 라우트 ↔ 파일 매핑 규칙 (모든 라우트 적용)

> **URL 경로 = `pages/` 하위 폴더 경로. 파일명은 마지막 세그먼트 / 동적 파라미터 / 폴더 루트의 `index`.**

URL 만 보고 어떤 .jsx 파일이 렌더되는지 추측 가능해야 한다.

### 매핑 표

| URL | 파일 | 비고 |
|-----|------|------|
| `/` | `pages/index.jsx` | 루트 |
| `/about` | `pages/about/index.jsx` | 단일 라우트도 폴더화 |
| `/admin` | `pages/admin/index.jsx` | 추후 sub-nav 가능성 |
| `/me` | `pages/me/index.jsx` | 동일 |
| `/events/:id` | `pages/events/[id].jsx` | **동적 라우트는 `[param].jsx`** (Next.js 컨벤션) |
| `/guide` | `pages/guide/index.jsx` | |
| `/guide/oneday/install` | `pages/guide/oneday/install.jsx` 또는 `Install.jsx` | 정적 세그먼트 |
| `/guide/oneday/week1` | `pages/guide/oneday/Week1.jsx` | 동일 |
| `/community/board` | `pages/community/board.jsx` | 동일 |

### 컨벤션 디테일 (이 프로젝트)

- 동적 파라미터는 **`[paramName].jsx`** 형식 (Next.js App Router 호환)
- 정적 세그먼트는 PascalCase 또는 lowercase 둘 다 OK (기존 패턴 따라)
- 폴더의 루트 페이지는 **`index.jsx`** (Home/About/Me/Admin 모두 폴더 안 index)
- 라우트 정의는 명시적: `routes/guide.jsx`, `routes/community.jsx`, `app.jsx` 가 lazy import

### 추상 원칙은 글로벌

`~/.claude/rules/route-file-mapping.md` 에 모든 프로젝트 공통 추상 원칙. 본 문서는 이 프로젝트 한정 디테일.

---

## B. 컴포넌트 위치 — 두 갈래만 기억하면 됨

```
front/src/
├── components/                          ← 갈래 1: 전역 (도메인 무관)
│   ├── LeafletMap.jsx                   # 지도 — 어느 페이지든 import
│   ├── EventCard.jsx                    # Home + 모든 이벤트 리스트
│   ├── Accordion.jsx                    # Home + Guide
│   └── ClassRegistration.jsx            # 강의 신청 모듈 (앱 핵심)
│
└── pages/
    └── guide/
        └── oneday/
            ├── Install.jsx              ← 라우트 페이지 (/guide/oneday/install)
            ├── Week1.jsx                ← 라우트 페이지 (/guide/oneday/week1)
            └── components/              ← 갈래 2: 도메인 격리 (이 라우트 그룹 전용)
                ├── MiniHompy.jsx        # 1주차 시연용
                ├── MiniHompy.module.css
                ├── MiniHompyDemo.jsx    # 미니홈피 라이브 데모
                └── MiniHompyDemo*.css
```

### 판단 기준 (딱 하나)

> **컴포넌트가 어느 도메인에 속하는지 한 줄로 설명할 수 있냐?**
> - "지도" / "카드" / "아코디언" → 도메인 무관 → **`components/`** (갈래 1)
> - "1주차 미니홈피 시연" / "강의 X의 챕터 데모" → 특정 도메인 전용 → **`pages/{도메인}/components/`** (갈래 2)

> "다른 페이지에서도 빌려 쓰는데?" — 빌려 쓰더라도 **원산지가 한 도메인이면 갈래 2**.
> 예: `MiniHompy` 는 1주차 교안의 시연 컴포넌트. HomeClient 가 썸네일로 빌려 쓰지만 원산지는 가이드 도메인 → `pages/guide/oneday/components/MiniHompy.jsx`.

### 라우트 폴더 안에서 components/ 가 라우트로 오해될 일은 없나

없다. 이 프로젝트의 라우트는 `routes/guide.jsx`, `routes/community.jsx`, `app.jsx` 의 **명시적 lazy import** 로만 등록된다 (파일기반 자동 라우팅 X).
즉 `pages/guide/oneday/components/MiniHompy.jsx` 가 있어도 routes 에 등록되지 않으면 라우트가 안 됨.
밑줄 prefix(`_components/`) 같은 자동 제외 컨벤션은 불필요 → 평범하게 `components/`.

### 예시로 확정된 케이스

| 컴포넌트 | 위치 | 이유 |
|---------|------|------|
| `LeafletMap` | `components/` | 지도 — 도메인 무관, 어느 페이지든 import 가능 |
| `EventCard` | `components/` | 카드 — 모든 이벤트 리스트에서 재사용 |
| `Accordion` | `components/` | 아코디언 — 도메인 무관 UI 패턴 |
| `ClassRegistration` | `components/` | 강의 신청 — 앱 핵심 모듈 (Curriculum-Class 패턴) |
| `MiniHompy*` | `pages/guide/oneday/components/` | 1주차 교안 전용 시연 컴포넌트 |
| `GuideClient` | `components/` | 가이드 섹션 전체 핵심 컴포넌트 — 가이드 도메인을 대표하는 클라이언트 컴포넌트라 컴포넌트 폴더가 자연스러움 (예외 케이스) |

## C. 폴더별 역할 요약

| 폴더 | 역할 | 새 파일 넣는 시점 |
|------|------|-----------------|
| `components/` | 도메인 무관 / 앱 전역 핵심 | 두 도메인 이상에서 쓰거나 도메인을 따지기 어려운 범용 UI |
| `pages/{section}/` | 해당 라우트 페이지 컴포넌트 | URL 경로에 1:1 매핑 (§ A 라우트 ↔ 파일 매핑 참조) |
| `pages/{section}/components/` | 해당 라우트 그룹 전용 비-라우트 컴포넌트 | 한 도메인에서만 쓰는 시연·헬퍼 |
| `routes/` | URL → 컴포넌트 매핑 정의만 | 새 URL 경로 추가 시 |
| `client/` | 백엔드 API 호출 함수 | 새 API 연결 시 |
| `lib/` | 순수 유틸·훅 (여러 곳 재사용) | 순수 함수, 사이트 전역에서 쓰는 훅 |

## D. CSS 파일 위치

- **CSS Modules** (`.module.css`): 컴포넌트와 같은 폴더에 둔다.
  `MiniHompy.jsx` ↔ `MiniHompy.module.css` 같은 디렉토리.
- **전역 CSS** (`styles/`): Tailwind base, 공통 유틸 클래스만.
