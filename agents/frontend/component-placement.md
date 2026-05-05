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
| `/events/:id` | `pages/events/EventDetail.jsx` | **동적 라우트는 의미 명사 (PascalCase)** |
| `/guide` | `pages/guide/index.jsx` | |
| `/guide/oneday/install` | `pages/guide/oneday/Install.jsx` | 정적 세그먼트 |
| `/guide/oneday/week1` | `pages/guide/oneday/Week1.jsx` | 동일 |
| `/community/board` | `pages/community/board.jsx` | 동일 |

### 컨벤션 디테일 (이 프로젝트 — Vite + React Router)

- 라우트는 `routes/*.jsx` 또는 `app.jsx` 의 **명시적 lazy import** 로 등록.
- **동적 파라미터는 의미 명사 (PascalCase)** — 예: `EventDetail.jsx`, `UserProfile.jsx`
- 정적 세그먼트는 PascalCase (`Install.jsx`, `Week1.jsx`) 또는 lowercase (`board.jsx`) 둘 다 OK (기존 패턴 따라).
- 폴더의 루트 페이지는 **`index.jsx`** (Home/About/Me/Admin 모두 폴더 안 index).

### 추상 원칙은 글로벌

`~/.claude/rules/route-file-mapping.md` 에 모든 프로젝트 공통 추상 원칙. 본 문서는 이 프로젝트 한정 디테일.

---

## B. 컴포넌트 위치 — 세 갈래로 판단

```
front/src/
├── components/                          ← 갈래 1: 앱 공용/도메인별 공유 컴포넌트
│   ├── common/                          # 도메인 무관 UI
│   │   ├── Accordion.jsx
│   │   ├── Avatar.jsx
│   │   └── ThemeToggle.jsx
│   ├── layout/                          # 앱 프레임
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── events/                          # 이벤트/강의 회차 도메인
│   │   ├── EventCard.jsx
│   │   ├── ClassRegistration.jsx
│   │   └── InstructorMicroCard.jsx
│   ├── admin/                           # dev/admin 전용 편집 UI
│   │   ├── AdminOnly.jsx
│   │   ├── ClassEditor.jsx
│   │   └── DevOperatorEditor.jsx
│   ├── home/                            # 메인 페이지 내부 섹션
│   │   ├── HomeClient.jsx
│   │   ├── NextClassHero.jsx
│   │   ├── GuidePreviewCard.jsx
│   │   ├── RecommendedHero.jsx
│   │   └── CalendarView.jsx
│   ├── maps/                            # 지도 SDK 래퍼
│   │   └── KakaoMap.jsx
│   └── operator/                        # 운영자/강사 프로필 계열
│       ├── OperatorIntroCard.jsx
│       └── OperatorProfile.jsx
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

### 판단 기준

> **1. URL과 1:1로 대응되는 화면인가?**
> - 예: `/about`, `/events/:id`, `/guide/oneday/week1`
> - 그렇다면 **`pages/{route}/...`** 에 둔다.

> **2. 여러 라우트에서 재사용되거나 앱 도메인 모듈인가?**
> - 그렇다면 **`components/{domain}/`** 에 둔다.
> - domain 은 기능 언어로 잡는다: `events`, `admin`, `home`, `maps`, `operator`, `layout`, `common`.

> **3. 특정 라우트 그룹에서만 쓰는 시연/헬퍼인가?**
> - 그렇다면 **`pages/{section}/components/`** 에 둔다.

### 도메인 폴더 기준

> **컴포넌트가 어느 도메인에 속하는지 한 줄로 설명할 수 있냐?**
> - "아코디언" / "아바타" → 도메인 무관 → **`components/common/`**
> - "헤더" / "푸터" → 앱 프레임 → **`components/layout/`**
> - "이벤트 카드" / "강의 신청 박스" → 이벤트·회차 도메인 → **`components/events/`**
> - "강의 편집 모달" / "admin 가드" → admin 도메인 → **`components/admin/`**
> - "메인 페이지 추천 카드" / "홈 캘린더" → 홈 전용 섹션 → **`components/home/`**
> - "카카오맵 SDK 래퍼" → 지도 도메인 → **`components/maps/`**
> - "운영자 소개" / "강사 미니 카드" → 운영자·강사 도메인 → **`components/operator/`**
> - "1주차 미니홈피 시연" / "강의 X의 챕터 데모" → 특정 교안 전용 → **`pages/{도메인}/components/`**

> "다른 페이지에서도 빌려 쓰는데?" — 빌려 쓰더라도 **원산지가 한 도메인이면 갈래 2**.
> 예: `MiniHompy` 는 1주차 교안의 시연 컴포넌트. HomeClient 가 썸네일로 빌려 쓰지만 원산지는 가이드 도메인 → `pages/guide/oneday/components/MiniHompy.jsx`.

> "루트 `components/`에 바로 두면 안 되나?" — 새 파일은 가급적 바로 두지 않는다.
> 루트 `components/`는 과거 호환 파일이 남아 있을 수 있지만, 새 파일은 `components/{domain}/` 하위에 둔다.
> 기존 파일 이동은 import 경로 변경이 동반되므로 기능 변경과 분리해서 한다.

### 라우트 폴더 안에서 components/ 가 라우트로 오해될 일은 없나

없다. 이 프로젝트의 라우트는 `routes/guide.jsx`, `routes/community.jsx`, `app.jsx` 의 **명시적 lazy import** 로만 등록된다 (파일기반 자동 라우팅 X).
즉 `pages/guide/oneday/components/MiniHompy.jsx` 가 있어도 routes 에 등록되지 않으면 라우트가 안 됨.
밑줄 prefix(`_components/`) 같은 자동 제외 컨벤션은 불필요 → 평범하게 `components/`.

### 예시로 확정된 케이스

| 컴포넌트 | 위치 | 이유 |
|---------|------|------|
| `Accordion` | `components/common/` | 아코디언 — 도메인 무관 UI 패턴 |
| `Avatar` | `components/common/` | 닉네임 아바타 — 커뮤니티 등 여러 곳 가능 |
| `Header`, `Footer` | `components/layout/` | 앱 프레임 |
| `EventCard` | `components/events/` | 이벤트·강의 회차 카드 |
| `ClassRegistration` | `components/events/` | 강의 신청 — 앱 핵심 모듈 (Curriculum-Class 패턴) |
| `ClassEditor` | `components/admin/` | admin/dev 전용 회차 편집 모달 |
| `HomeClient` | `components/home/` | 메인 페이지 클라이언트 UI |
| `NextClassHero` | `components/home/` | 메인 페이지의 다음 강의 강조 카드 |
| `KakaoMap` | `components/maps/` | 지도 SDK 래퍼 |
| `OperatorIntroCard`, `OperatorProfile` | `components/operator/` | 운영자/강사 프로필 계열 |
| `MiniHompy*` | `pages/guide/oneday/components/` | 1주차 교안 전용 시연 컴포넌트 |
| `GuideClient` | `components/guide/` 또는 `pages/guide/oneday/` | 가이드 도메인 전용. 새로 정리한다면 루트 components 직속에 두지 않는다. |

### 현재 구조에서 리팩터링 우선순위

기존 루트 `components/*.jsx`는 점진적으로 옮긴다. 한 번에 옮기면 import 변경이 넓어지므로 아래 순서 권장.

1. `components/home/`: `HomeClient` 내부 서브컴포넌트(`GuidePreviewCard`, `RecommendedHero`, `CardsGrid`, `CalendarView`)부터 분리.
2. `components/events/`: `EventCard`, `ClassRegistration`, `InstructorMicroCard`, `EventLocationMap`.
3. `components/admin/`: `AdminOnly`, `ClassEditor`, `DevOperatorEditor`.
4. `components/layout/`, `components/common/`, `components/maps/`, `components/operator/` 정리.
5. 마지막에 import 경로 안정화를 위해 필요하면 domain별 `index.js` barrel export 추가.

## C. 폴더별 역할 요약

| 폴더 | 역할 | 새 파일 넣는 시점 |
|------|------|-----------------|
| `components/common/` | 도메인 무관 범용 UI | 아코디언, 아바타, 버튼류 등 |
| `components/layout/` | 앱 전역 프레임 | 헤더, 푸터, 전역 네비 |
| `components/{domain}/` | 여러 라우트에서 쓰는 도메인 공유 모듈 | events/admin/home/maps/operator 등 |
| `pages/{section}/` | 해당 라우트 페이지 컴포넌트 | URL 경로에 1:1 매핑 (§ A 라우트 ↔ 파일 매핑 참조) |
| `pages/{section}/components/` | 해당 라우트 그룹 전용 비-라우트 컴포넌트 | 한 도메인에서만 쓰는 시연·헬퍼 |
| `routes/` | URL → 컴포넌트 매핑 정의만 | 새 URL 경로 추가 시 |
| `client/` | 백엔드 API 호출 함수 | 새 API 연결 시 |
| `lib/` | 순수 유틸·훅 (여러 곳 재사용) | 순수 함수, 사이트 전역에서 쓰는 훅 |

## D. CSS 파일 위치

- **CSS Modules** (`.module.css`): 컴포넌트와 같은 폴더에 둔다.
  `MiniHompy.jsx` ↔ `MiniHompy.module.css` 같은 디렉토리.
- **전역 CSS** (`styles/`): Tailwind base, 공통 유틸 클래스만.
