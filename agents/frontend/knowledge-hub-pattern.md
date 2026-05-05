---
Title: /guide 지식 허브 + 도메인 라우트 확장 패턴
Description: /guide 를 강의 교안 + 도메인별 지식 카탈로그(front/back/ai/...) 허브로 운영하는 라우트·폴더 구조 + 새 도메인 추가 워크플로우
When-To-Read: 새 지식 카테고리 추가, /guide 인덱스 손볼 때, 패턴 카탈로그에 새 패턴 단일 페이지 추가, GuideSidebar 그룹 갱신
Keywords: knowledge hub, /guide, /info/front/patterns, 지식 허브, 도메인 분류, PatternDetail, TIERS, PATTERNS, GuideSidebar
Priority: high
---

# /guide 지식 허브 + 도메인 라우트 확장 패턴

## 정체성 (2026-05-05 분리)

헤더 메뉴 분리:
- **`/guide` ("수업")** — 강의 교안만 (4주차 미니홈피 시리즈 + 사전 준비 가이드)
- **`/info` ("지식")** — 짧은 프로그래밍·바이브코딩 정보 (도메인별: front/back/ai)

메인(`/`)은 좌측 favicon 클릭으로 진입 — 헤더 "모임" 라벨 메뉴 제거됨.

## 라우트 트리

```
/guide                                        ← 지식 허브 인덱스
  ├─ /guide/oneday/...                        ← 강의 교안 도메인
  │   ├─ /guide/oneday/install                  → 사전 준비 가이드
  │   ├─ /guide/oneday/week1~4                  → 4주차 미니홈피 시리즈
  │   └─ /guide/oneday/demo                     → 모객 썸네일/배너 캡처용
  │
  └─ /info/front/                            ← 프론트엔드 지식 도메인
      └─ /info/front/patterns/                 → UX 패턴 카탈로그
          ├─ /info/front/patterns               → 4 Tier 카드 인덱스
          └─ /info/front/patterns/:tier/:id     → 단일 패턴 페이지 (37개)

(향후 자연 확장)
  ├─ /guide/back/...     ← 백엔드 지식 (Django/PostgreSQL/배포)
  ├─ /guide/ai/...       ← AI 코딩 패턴 (Claude/Cursor 활용)
  └─ /guide/devops/...   ← 배포·CI/CD 트러블슈팅
```

## 폴더 매핑 (CLAUDE.md § 4-3-1 라우트 ↔ 파일 매핑 룰 그대로)

```
front/src/
├── pages/guide/
│   ├── index.jsx                             ← /guide
│   ├── GuideLayout.jsx                       ← 모든 가이드 페이지 공통 레이아웃 (사이드바 + 콘텐츠)
│   ├── GuideSidebar.jsx                      ← 좌측 사이드바 (도메인별 그룹)
│   ├── oneday/
│   │   ├── Install.jsx                       ← /guide/oneday/install
│   │   ├── Week1~4.jsx                       ← /guide/oneday/week1~4
│   │   └── components/                       ← 도메인 격리 컴포넌트 (MiniHompy 등)
│   └── front/
│       └── patterns/
│           ├── index.jsx                     ← /info/front/patterns (인덱스)
│           ├── PatternDetail.jsx             ← /info/front/patterns/:tier/:id (37개 공용)
│           └── components/                   ← 패턴별 라이브 데모 (SkeletonDemo, ...)
│               └── {Id}Demo.jsx
│
├── data/
│   └── patterns.js                           ← TIERS + PATTERNS 메타 (37개)
│
├── components/guide/
│   └── CurriculumGrid.jsx                    ← 4주차 시리즈 카드 (홈 + /guide 둘 다 사용)
│
└── routes/guide.jsx                          ← 명시적 lazy import (자동 매핑 X)
```

## 단일 패턴 페이지 폼팩터 (`PatternDetail.jsx`)

37개 패턴 모두 같은 컴포넌트가 처리. URL 의 `:id` 로 분기.

```
헤더    ← Tier · 번호 · 제목 · lead
  ↓
라이브 데모    ← DEMO_REGISTRY[id] 동적 lazy import (없으면 "준비중" placeholder)
  ↓
Claude 프롬프트    ← lead 자동 삽입된 복붙용 프롬프트
  ↓
이전/다음 네비    ← getNeighbors(id) 로 자동 연결
```

**라이브 데모 점진 추가**:
- `pages/info/front/patterns/components/{Id}Demo.jsx` 신규 작성
- `PatternDetail.jsx` 의 `DEMO_REGISTRY` 객체에 `{id}: lazy(() => import('./components/{Id}Demo'))` 한 줄 추가
- 끝. 데이터·라우트·인덱스 무수정.

## 새 패턴 추가 워크플로우 (3분)

1. `front/src/data/patterns.js` 의 `PATTERNS` 배열에 객체 1개 추가
   ```js
   { id: 'new-pattern', tier: 1, num: 38, title: '...', lead: '...' }
   ```
2. (선택) 라이브 데모 작성: `pages/info/front/patterns/components/NewPatternDemo.jsx`
3. (선택) `DEMO_REGISTRY` 에 등록
4. 끝. URL `/info/front/patterns/tier1/new-pattern` 자동 생성.

## 새 도메인 추가 워크플로우 (10분 + 콘텐츠 작성 시간)

예: 백엔드 지식 추가 (`/guide/back/...`)

1. **폴더 생성**: `pages/guide/back/{section}/` 신규
2. **데이터 (있으면)**: `data/{section}.js` (예: `data/back-snippets.js`)
3. **라우트 등록**: `routes/guide.jsx` 에 lazy import + path 매핑 배열 항목 추가
4. **`/guide` 인덱스 갱신**: `pages/guide/index.jsx` 에 새 섹션 카드 그리드 추가
5. **`GuideSidebar.jsx` `NAV_GROUPS`** 에 새 그룹 객체 추가 (label + base + items)

골격 전체 수정 0. 같은 패턴(인덱스 → 카탈로그 → 단일) 그대로 따라가면 됨.

## 핵심 데이터 API (`@/data/patterns`)

| Export | 용도 |
|--------|------|
| `TIERS` | 4 Tier 메타 (num, slug, title, desc, count, color) |
| `PATTERNS` | 37개 패턴 메타 (id, tier, num, title, lead) |
| `getPattern(id)` | id 로 조회 |
| `getPatternsByTier(tierNum)` | Tier 별 필터 |
| `getNeighbors(id)` | 이전/다음 패턴 (네비용) |

## SEO 측면 잠재력

- 정적 빌드 + 단일 패턴 URL 37개 = 패턴별 검색어 트래픽 자석
- "스켈레톤 로딩 react", "Optimistic update 패턴" 같은 검색어 일정 수요
- 각 패턴 페이지에 라이브 데모 + 코드 + Claude 프롬프트 → 체류 시간 ↑

## 관련 문서

- `agents/frontend/component-placement.md` — 컴포넌트 위치 규칙 (도메인 격리 패턴 — 패턴별 데모 컴포넌트는 `pages/info/front/patterns/components/` 에 colocate)
- `agents/frontend/route-colocation-pattern.md` — meta.js 사이드카 패턴 (Week1~4 가 따르는 폼)
- `agents/frontend/class-registration-pattern.md` — Curriculum-Class 분리 (강의 교안 도메인의 핵심 패턴)
