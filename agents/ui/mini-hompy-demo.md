---
Title: 미니홈피 라이브 데모 컴포넌트 (MiniHompy / MiniHompyLive)
Description: 사이월드풍 미니홈피 라이브 React 컴포넌트 2종 — install 페이지용 단순판(MiniHompy)과 vibe-coding-minihome 외부 프로젝트를 통째로 떼와 격리한 풀버전(MiniHompyLive). 가이드 라이브 데모 + 홈 카드 썸네일에서 사용.
When-To-Read: MiniHompy/MiniHompyLive 수정, 썸네일 scale 조정, 캔버스 별 애니메이션 문제, CSS 충돌 방지, 외부 React 프로젝트 컴포넌트 떼와 통합할 때
Keywords: MiniHompy, MiniHompyLive, CSS Modules, canvas, star particles, localStorage, cyworld, minihompy, external project embed, KUROMI, vibe-coding-minihome
Priority: high
---

# 미니홈피 라이브 데모 컴포넌트

## 두 컴포넌트의 역할 분담

| 컴포넌트 | 위치 | 용도 |
|----------|------|------|
| `MiniHompy` | `pages/guide/oneday/MiniHompy.jsx` | install 페이지 5단계 마무리 시연 + 홈 좌측 카드 썸네일 (단일 페이지 보라 톤) |
| `MiniHompyLive` | `pages/guide/oneday/MiniHompyLive.jsx` | evt-001 Chapter 2 가이드 마지막 라이브 데모 + 홈 우측 카드 썸네일 (KUROMI 미니홈피 — 사이드바 포함 풀버전) |

둘 다 같은 다크 보라 톤이지만 결과물이 다르므로 좌·우 카드 의미 구분이 됨.

# MiniHompy (단일 페이지 보라 미니홈피)

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

---

# MiniHompyLive (vibe-coding-minihome 외부 프로젝트 임베드)

## 출처

별도 프로젝트 `C:\GitHub\vibe-coding-minihome` (Vite + React 19 + React Router 7).
실제 수업에서 학생들이 만들 결과물의 레퍼런스 구현.

## 통합 전략 — "통째로 떼서 격리"

원본 프로젝트의 컴포넌트들을 vibe-coding/front 안으로 복사하되, **단일 파일 + CSS Module 격리**:

```
front/src/pages/guide/oneday/
├── MiniHompyLive.jsx           ← 원본 5개 컴포넌트(StarParticles, VisitorCounter,
│                                  KuromiPhoto, FavoritesCard, DiaryMemo) + Sidebar +
│                                  Home/About 페이지 모두 단일 파일에 인라인
└── MiniHompyLive.module.css    ← 원본 index.css + App.css + StarParticles.css 통합
                                   (모든 클래스명 CSS Module로 자동 hashing)

front/public/kuromi.png         ← 원본 public/kuromi.png 복사 (이미지 자산)
```

## 외부 프로젝트 임베드 시 주의 4가지

### 1. 글로벌 CSS 격리

원본은 `:root` CSS 변수 + 글로벌 `.card`, `.sidebar` 클래스 사용. 그대로 import하면 vibe-coding 앱 전체 클래스명과 충돌.

→ **해결**: CSS Module(`*.module.css`)로 import. 모든 클래스 자동 hashing. CSS 변수는 `.frame` 루트에 정의해서 그 안에서만 유효.

```css
.frame {
  --pink: #ff4dc4;
  --purple: #c084fc;
  /* ... 원본 :root 변수들 .frame scope으로 옮김 */
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: /* 원본 body 배경 그대로 */;
}
```

### 2. position: fixed → absolute

원본 `StarParticles.css`의 `position: fixed`는 화면 전체에 별이 깔림 → 임베드된 박스 안에서만 별이 보이게:

```css
.stars { position: absolute; inset: 0; }   /* fixed → absolute */
```

### 3. 라우터 → 내부 state 토글

원본은 `react-router-dom`의 `<NavLink>`로 / 와 /about 전환. 임베드된 컴포넌트가 evt-001 페이지(이미 라우터 안) 안에 들어가면 nested router 깨짐.

→ **해결**: 사이드바 NavLink를 `<button onClick={() => setPage('home')}>`로 교체. 페이지 컴포넌트도 if/else로 분기.

```jsx
const [page, setPage] = useState('home');
// ...
<button onClick={() => setPage('home')} className={page==='home' ? s.navLinkActive : s.navLink}>홈</button>
{page === 'home' ? <HomePage /> : <AboutPage />}
```

### 4. localStorage 키 prefix

원본 `VisitorCounter`는 `'minihome:visitorCount'` 키 사용. 학생이 vibe-coding-minihome 프로젝트와 vibe-coding 사이트 둘 다 띄울 때 같은 도메인이면 키 충돌.

→ **해결**: 임베드용 prefix(`mhl:`)로 변경:
```js
const VISITOR_KEY = 'mhl:visitorCount';
const DIARY_KEY = 'mhl:diary';
```

## 3종 렌더링 모드 (full / thumbnail / banner)

세 가지 사용처에서 같은 컴포넌트가 다른 레이아웃으로 보이게:

| mode | 레이아웃 | 주 용도 |
|------|---------|--------|
| `full` (기본) | 사이드바 + 메인 (홈/소개 토글) — 세로 스택 | Chapter 2 라이브 결과물 |
| `thumbnail` | 사이드바 빼고 홈 페이지만, 같은 세로 스택 | 홈 우측 카드 썸네일 (~170h, 상단 크롭) |
| `banner` | 헤더 위 + 3열 가로 (counter \| photo \| favorites×4) — diary 제외 | EventDetail 16:8 배너 |

### prop 시그니처

```jsx
<MiniHompyLive />                  // full mode
<MiniHompyLive thumbnail />        // thumbnail mode (구버전 prop, 하위 호환)
<MiniHompyLive mode="banner" />    // banner mode
```

내부적으로 `mode = mode ?? (thumbnail ? 'thumbnail' : 'full')`.

### Banner 모드 — 왜 별도 레이아웃이 필요한가

세로 스택 풀모드를 16:8 배너에 그냥 scale로 축소하면:
- 풀 페이지 콘텐츠 높이 ~700px → 16:8(예: 1232×616) 컨테이너에 맞추려면 scale 0.88
- 가로 폭은 1080×0.88 ≈ 950, 컨테이너 1232 대비 280px 빈 공간
- 또는 가로 채우려고 scale 1.14 → 세로가 800px 되어 184px 잘림 → KUROMI 헤더가 잘림

**해결: 16:8용 가로 레이아웃을 자체 디자인.**
- `BannerHome` 컴포넌트가 별도 레이아웃 렌더 (3열 grid)
- diary 제거 (가로 배너에 textarea는 어색)
- favorites는 4개로 제한 (`<FavoritesCard limit={4} />`)
- counter / photo / favorites 모두 같은 높이로 stretch

`FavoritesCard`는 `limit` prop을 받음:
```jsx
function FavoritesCard({ limit }) {
  const items = typeof limit === 'number' ? FAVORITES.slice(0, limit) : FAVORITES;
  ...
}
```

### CSS 핵심

```css
/* 풀모드 모바일 압축 — favList 1col로 떨어지면 8행 쌓여서 페이지 너무 길어짐 */
@media (max-width: 540px) {
  .favList { grid-template-columns: 1fr 1fr; }  /* 2col 유지! */
  .glitterTitle { font-size: 24px; }
  .card { padding: 12px 14px; }
  /* 등 */
}

/* Banner 모드 */
.bannerMode { padding: 22px 28px 26px; overflow: hidden; }
.bannerLayout { display: flex; flex-direction: column; justify-content: center; gap: 14px; }
.bannerRow {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr 1.4fr;  /* counter, photo, favorites */
  gap: 12px;
  align-items: stretch;
}
.bannerRow .kuromiImg { height: 170px; }
.bannerRow .favList { grid-template-columns: 1fr 1fr; }  /* 2x2 */
```

### 사용 위치

| 위치 | 모드 | 비고 |
|------|------|------|
| `MiniHompyGuide.jsx` 마지막 | `full` | Chapter 2 라이브 결과물 |
| `HomeClient.jsx > RecommendedHero` | `banner` | 홈 우측 운영자 추천 카드 (~150-170h, 좁은 카드라 scale 0.21~0.32) |
| `EventDetail.jsx > MinihomeBanner` | `banner` | 16:8 배너 (showCurriculum일 때 정적 이미지 대체) |
| `MiniHompy.jsx` (별도 컴포넌트) | (해당 없음) | install 페이지 + 홈 좌측 카드 — 다른 단일 페이지 미니홈피 |

홈 카드와 EventDetail이 같은 banner 모드 사용 → 시각적 일관성. 카드 크기 차이는 scale로 흡수.

썸네일 scale (홈 우측 카드):
```jsx
<Link className="block relative overflow-hidden h-[150px] sm:h-[170px] shrink-0">
  <div style={{
    position: 'absolute', top: 0, left: '50%',
    transform: 'translateX(-50%) scale(0.46)',
    transformOrigin: 'top center',
    width: '420px', pointerEvents: 'none',
  }}>
    <MiniHompyLive thumbnail />
  </div>
  <span className="badge ... z-10">★ 운영자 추천</span>   {/* z-10 필수 */}
</Link>
```

## 외부 프로젝트 추가 통합 체크리스트

다른 외부 React 프로젝트도 같은 방식으로 떼올 수 있음. 순서:

1. 원본의 `index.css` + `App.css` + 컴포넌트별 CSS 다 읽고 → 단일 `*.module.css`로 합치기
2. `:root` CSS 변수 → 임베드 wrapper 클래스(`.frame`) 안으로
3. `position: fixed` → `position: absolute` (글로벌 → 컴포넌트 scope)
4. `react-router-dom` → 내부 state 토글
5. `localStorage` 키에 prefix 붙이기 (충돌 방지)
6. 자산(이미지 등) `public/`에 복사
7. 단일 컴포넌트 파일에 모든 서브컴포넌트 인라인 (관리 편의)
8. (선택) `thumbnail` prop으로 썸네일 모드 추가

