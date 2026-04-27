---
Title: MiniHompy 데모 컴포넌트
Description: 사이월드풍 미니홈피 라이브 React 컴포넌트. 가이드 페이지 결과물 시연 + 홈 카드 썸네일 두 곳에서 사용.
When-To-Read: MiniHompy 수정, 썸네일 scale 조정, 캔버스 별 애니메이션 문제, CSS 충돌 방지
Keywords: MiniHompy, CSS Modules, canvas, star particles, localStorage, cyworld, minihompy
Priority: high
---

# MiniHompy 데모 컴포넌트

## 역할

가이드 페이지(`/guide/oneday/install`)에서 **"AI한테 이 프롬프트 치면 이런 결과물이 나온다"**를 보여주는
라이브 인터랙티브 데모. 텍스트 스크린샷 대신 실제 동작하는 React 컴포넌트.

## 파일 위치

```
front/src/pages/guide/oneday/
├── MiniHompy.jsx
└── MiniHompy.module.css
```

`components/`가 아닌 `pages/guide/oneday/`에 있는 이유 → 이 컴포넌트는
가이드 설치 페이지에서만 쓰는 **예시 컴포넌트**. 재사용 목적이 없으면 사용처 폴더에 co-locate.
(규칙: [component-placement.md](../frontend/component-placement.md) 참조)

## 주요 구성

| 서브컴포넌트 | 설명 |
|------------|------|
| `StarParticles` | canvas 별 트윙클 애니메이션 (window 아닌 부모 div 기준) |
| `VisitorCounter` | localStorage `mh_visitor_count` 키로 방문자 수 유지 |
| `FavoriteCard` | emoji + label + desc 카드 (☕ 🎵 ✈️ 💻 4개) |
| `DiarySection` | localStorage `mh_diary_memos` 키로 메모 CRUD |

## CSS 충돌 방지 규칙

- **CSS Modules** 사용 (`import s from './MiniHompy.module.css'`)
- 클래스명 camelCase: `s.hompyHeader`, `s.favGrid` 등
- `@keyframes` 이름 앞에 `mh` 접두사 필수: `mhFadeUp`, `mhSpin`, `mhRotateBorder`, `mhShimmer`, `mhSlideIn`
  - 접두사 없으면 전역 keyframes 공간에서 앱의 다른 애니메이션과 이름 충돌 가능

## 캔버스 범위 고정

```js
// ✅ 부모 div 크기 기준 (컨테이너 안에서만 별이 그려짐)
const wrapper = canvas.parentElement;
const resize = () => {
  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;
};
// ❌ window 기준 절대 쓰지 말 것 (화면 전체에 별이 깔림)
```

CSS도 `position: absolute; inset: 0` (fixed 금지).

## 홈 썸네일로 쓸 때

`HomeClient.jsx` `GuidePreviewCard` 안에서 scale 축소로 썸네일 처리:

```jsx
import MiniHompy from '../pages/guide/oneday/MiniHompy';

<div style={{
  position: 'absolute',
  top: 0, left: '50%',
  transform: 'translateX(-50%) scale(0.42)',
  transformOrigin: 'top center',
  width: '380px',
  pointerEvents: 'none',
}}>
  <MiniHompy />
</div>
```

scale 조정 기준:
- container_width / element_width = 시각적 채움 비율
- `transformOrigin: 'top center'` → 헤더(가장 화려한 부분)가 상단에 보임
- `pointerEvents: none` → Link click 정상 동작

## 비주얼 특징 (2026-04-26 버전)

- wrapper: `max-width: 660px`, 배경 짙은 보라 + `::before/::after` 핑크/보라 글로우 오브
- 카드 border: `rgba(232,121,249,0.45)` + `box-shadow` 60/120/240px 겹쳐서 네온 느낌
- headerTitle: shimmer gradient 애니메이션 + drop-shadow
- profilePhoto: 120px, 회전하는 그라디언트 테두리 ring
- favGrid: 4열 (☕커피, 🎵음악, ✈️여행, 💻클로드)
- 반응형: 520px 이하에서 2열 favorites, 프로필 세로 배치
