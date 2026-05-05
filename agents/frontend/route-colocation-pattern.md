---
Title: 라우트 폴더 co-location 패턴 (페이지 전용 컴포넌트 + 메타 + 데이터를 페이지 폴더 안으로)
Description: 단일 라우트 페이지가 여러 자식 컴포넌트·CSS·데이터·메타를 가질 때, 모두 그 라우트 폴더 안 components/ + meta.js + data/ 로 co-locate. 다른 페이지에서 메타만 import 하려면 같은 폴더에 사이드카 meta.js 두고 인덱스(_curriculums.js 같은) 로 모음.
When-To-Read: 새 강의/페이지 만들 때, 페이지 전용 컴포넌트가 전역 components/ 에 있는 걸 정리할 때, "이 컴포넌트가 어디서 쓰이지" 추적 부담될 때, 같은 패턴이 N개 반복될 때(Week1/2/3/4)
Keywords: co-location, route folder, page-local components, sidecar meta, _curriculums index, component placement, Week1 folder, ChapterGuide, single source of truth
Priority: high
---

# 라우트 폴더 co-location 패턴

페이지가 자기 전용 컴포넌트·데이터·메타를 자기 폴더 안에 다 모은다.
"전역 components/ 에 단일 페이지 전용 컴포넌트 두지 말 것" — 이 룰의 구체화.

## 1. 룰 (한 줄)

**페이지 전용 = 페이지 폴더 안 `components/` + `data/` + `meta.js` 사이드카.
다중 페이지 공유 = 루트 `src/components/`.**

`agents/frontend/component-placement.md` 의 "1곳만 사용 시 사용처 폴더" 룰을 폴더 단위로 확장.

## 2. 표준 폴더 구조 (Week1 예시)

```
pages/guide/oneday/Week1/
├── index.jsx              ← 라우트 진입점 (자동: /guide/oneday/week1)
├── meta.js                ← 카드용 메타 (id, title, prerequisites, outline, status, ...)
├── Curriculum.jsx         ← 본문 큰 컴포넌트 (TIMELINE / Chapter accordion 등)
├── data/                  ← (선택) 본문이 길 때 데이터만 분리
│   └── timeline.js
└── components/            ← Week1 전용 컴포넌트
    ├── ChapterGitHub.jsx
    ├── ChapterMiniHompy.jsx
    ├── ChapterVercel.jsx
    ├── PromptRef.jsx
    ├── CurriculumSignature.jsx
    └── ChapterGuide.module.css
```

라우트 매핑은 변경 없음 — `routes/guide.jsx` 의 `import('../pages/guide/oneday/Week1')` 가 자동으로 `Week1/index.jsx` 잡음.

## 3. 메타 사이드카 패턴 (`meta.js`)

페이지 본문(JSX) 과 같은 폴더에 짧은 메타만 별도 파일로:

```js
// Week1/meta.js
export const META = {
  id: 'oneday-week-1',
  weekNumber: 1,
  status: 'active',                    // 'active' | 'preparing'
  title: '...',
  subtitle: '...',
  summary: '...',
  guideRoute: '/guide/oneday/week1',
  thumbnail: '/images/...',
  prerequisites: [...],
  outline: [...],
  outcomes: [...],
};
```

**왜 사이드카 (meta.js 별도 파일) 인가**:
- `index.jsx` 안 `export const META = {...}` 도 가능. 단 다른 페이지(메인·/guide)가 메타만 import 하면 `index.jsx` 가 import 한 무거운 컴포넌트(Curriculum, Chapter*) 까지 끌려옴 → 번들 +200KB.
- `meta.js` 분리하면 메타만 가벼운 chunk 로 빠짐. `index.jsx` 본문도 `meta.js` import 해서 헤더 렌더에 사용.

## 4. 인덱스 패턴 (`_curriculums.js`)

여러 페이지의 메타를 모아 다른 곳에서 lookup 가능하게:

```js
// pages/guide/oneday/_curriculums.js
import { META as week1 } from './Week1/meta';
import { META as week2 } from './Week2/meta';
import { META as week3 } from './Week3/meta';
import { META as week4 } from './Week4/meta';

export const CURRICULUMS = [week1, week2, week3, week4];

export function getCurriculum(id) {
  return CURRICULUMS.find((c) => c.id === id) ?? null;
}
```

- 파일명 prefix `_` (언더스코어) — Next.js 컨벤션상 라우트로 인식 안 됨 + 같은 폴더 안에서 "내부용 인덱스" 임을 명시.
- 메인 / /guide / ClassRegistration / ClassEditor 가 이 인덱스 import → curriculumId 로 lookup.

## 5. 무엇을 옮길지 (Week1 전용 vs 다중 페이지 공유)

| 컴포넌트 | 분류 | 위치 |
|---------|------|------|
| Week1 의 ChapterGitHub / ChapterMiniHompy / ChapterVercel | **Week1 전용** | `pages/guide/oneday/Week1/components/` |
| Chapter 들이 공유하는 PromptRef, CurriculumSignature, ChapterGuide.module.css | **Week1 전용 (Chapter 들끼리만 공유)** | 같은 `Week1/components/` |
| MiniHompy / MiniHompyDemo / MiniHompyLive | **다중 페이지 공유** (EventDetail 배너 + HomeClient 추천 카드 + Week1 모두 사용) | `pages/guide/oneday/components/` (oneday 도메인 공유) |
| InstructorMicroCard, OperatorIntroCard, Footer 등 운영자 모듈 | **전역 공유** | 루트 `src/components/` |

**판정 기준**:
- 1개 페이지에서만 import → 그 페이지 폴더 안 `components/`
- 같은 도메인 N개 페이지에서 공유 → 도메인 폴더 안 `components/` (예: `pages/guide/oneday/components/`)
- 도메인을 넘어 공유 → 루트 `src/components/`

## 6. 새 주차 추가할 때 절차 (Week5 예시)

1. `pages/guide/oneday/Week5/` 폴더 생성
2. `Week5/meta.js` — `{ id: 'oneday-week-5', weekNumber: 5, status: 'preparing', title, summary, guideRoute, topics }`
3. `Week5/index.jsx` — Week2~4 같은 placeholder 또는 Week1 같은 풀 본문
4. `_curriculums.js` 인덱스에 `import { META as week5 }` + `CURRICULUMS` 배열에 추가
5. `routes/guide.jsx` 에 `const Week5 = lazy(() => import('../pages/guide/oneday/Week5'));` + 라우트 등록
6. 자동 효과: 메인 폴백 + /guide 카탈로그 + ClassEditor dropdown 에 Week5 카드 자동 노출

## 7. 안티패턴

❌ **Week1 전용 컴포넌트를 전역 components/ 에**
- 30개 컴포넌트가 평면에 쌓여 "이게 어디서 쓰이지?" 추적 부담
- Week2/3/4 가 같은 패턴으로 만들면 components/ 가 4배로 폭발

❌ **메타를 `index.jsx` 안에 `export const META`**
- 다른 페이지가 메타 import 시 본문 chunk 까지 끌려옴 (번들 +200KB)

❌ **컨텐츠 데이터를 별도 JSON 파일로** (예: 옛 curriculums.json)
- 데이터 변경 시 JSON ↔ JSX 동기화 부담
- "이 페이지가 어떤 데이터 쓰는지" 추적 위해 두 파일 봐야 함
- 단일 소스 응집도 ↓

## 8. 실 적용 사례 (이 프로젝트)

- 1차: GitHubGuide / MiniHompyGuide / VercelGuide / OnedayClassCurriculum / PromptRef / CurriculumSignature 모두 `src/components/` 평면에 있음 (안티패턴)
- 2차 (2026-05-05 적용): 모두 `pages/guide/oneday/Week1/components/` 또는 `pages/guide/oneday/Week1/Curriculum.jsx` 로 이동. 메타는 `Week1/meta.js` + `_curriculums.js` 인덱스로.
- 결과: components/ 평면 23개 → 18개. 새 주차 추가 시 같은 폴더 패턴 복사로 끝.

## 관련 문서

- `agents/frontend/component-placement.md` — 컴포넌트 위치 결정 1차 룰
- `agents/frontend/class-registration-pattern.md` — Curriculum-Class 패턴 (회차 ↔ 교안 연결)
- `agents/ui/lecture-guide-component.md` — 강의 교안 가이드 컴포넌트 폼팩터
