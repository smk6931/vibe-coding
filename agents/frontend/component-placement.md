---
Title: 컴포넌트 위치 규칙
Description: 새 컴포넌트 파일을 components/ vs pages/[route]/ 중 어디에 놓을지 결정하는 규칙
When-To-Read: 새 컴포넌트 파일 만들 때, 기존 컴포넌트 이동/정리할 때
Keywords: component placement, co-location, components/, pages/, 컴포넌트 위치, 폴더 구조
Priority: high
---

# 컴포넌트 위치 규칙

## 판단 기준 (딱 하나)

> **2곳 이상에서 import 하면 → `components/`**
> **한 곳에서만 쓰면 → 사용처 폴더에 co-locate**

```
front/src/
├── components/          # 2개+ 페이지/컴포넌트에서 재사용
│   ├── EventCard.jsx    # Home + EventDetail 둘 다 씀
│   ├── Accordion.jsx    # Home + Guide 둘 다 씀
│   └── HomeClient.jsx
│
└── pages/
    └── guide/
        └── oneday/
            ├── Install.jsx          # /guide/oneday/install 페이지
            ├── MiniHompy.jsx        # ← Install.jsx 에서만 씀 → co-locate
            └── MiniHompy.module.css
```

## 예시로 확정된 케이스

### MiniHompy — `pages/guide/oneday/`에 놓은 이유

가이드 설치 페이지에서 AI 결과물 시연용 **예시 컴포넌트**. 다른 페이지에서 쓸 일 없음.
→ `components/`에 넣으면 "왜 여기 있지?" 혼란. co-locate이 정답.

단, `HomeClient.jsx`에서도 썸네일로 import 중 → 실질적으로 2곳에서 씀.
그래도 `pages/guide/oneday/`가 정답인 이유: **원산지(가이드 페이지)** 기준으로 분류.
HomeClient는 단순히 썸네일용으로 빌려 쓰는 것이지, 이 컴포넌트의 주 사용처가 아님.

### GuideClient — `components/`에 있는 이유

`pages/guide/oneday/Install.jsx`가 이 컴포넌트를 렌더링.
하지만 GuideClient는 복잡한 인터랙티브 UI(탭, 스텝 카드, 스크린샷)를 담은
"클라이언트 컴포넌트" — 가이드 섹션 전체의 핵심 컴포넌트이므로 `components/`에.

## 폴더별 역할 요약

| 폴더 | 역할 | 새 파일 넣는 시점 |
|------|------|-----------------|
| `components/` | 2곳+ 재사용 or 앱 전역 핵심 | 공통화 확실할 때 |
| `pages/[route]/` | 해당 라우트 전용 UI | 그 페이지에서만 쓸 때 |
| `routes/` | URL → 컴포넌트 매핑만 | 새 URL 경로 추가 시 |
| `client/` | 백엔드 API 호출 함수 | 새 API 연결 시 |
| `lib/` | 유틸리티 함수 | 순수 함수, 여러 곳 재사용 |

## CSS 파일 위치

- **CSS Modules** (`.module.css`): 컴포넌트와 같은 폴더에 둔다.
  `MiniHompy.jsx` ↔ `MiniHompy.module.css` 같은 디렉토리.
- **전역 CSS** (`styles/`): Tailwind base, 공통 유틸 클래스만.
