---
Title: 라이트/다크 테마 토글 (filter invert 트릭) + 와이드 데스크탑 반응형
Description: 별도 라이트 팔레트 정의 없이 CSS filter invert + hue-rotate(180)으로 다크 테마를 라이트로 자동 반전. 1126px류 #root width cap을 풀어 와이드 모니터에서 빈 공간 제거. vibe-coding-minihome에서 검증된 패턴.
When-To-Read: 다크 디자인된 프로젝트에 라이트 모드 빠르게 추가, 와이드 데스크탑(1600px+)에서 좌우 빈 공간 / 좁은 콘텐츠 영역 문제 해결, CSS 변수 풀세트 새로 짜기 싫을 때
Keywords: dark mode, light mode, theme toggle, filter invert, hue-rotate, color-scheme, prefers-color-scheme, localStorage theme, responsive desktop, wide layout, max-width root
Priority: medium
---

# 테마 토글 (filter invert 트릭) + 와이드 반응형

다크 톤으로 디자인된 프로젝트에 **라이트 모드를 5분 만에 추가**하고 와이드 모니터 좌우 빈 공간 문제를 해결하는 패턴.
별도 라이트 팔레트 / CSS 변수 풀세트 정의가 필요 없는 게 핵심.

## 1. filter invert 트릭이란

```css
html.light {
  filter: invert(0.92) hue-rotate(180deg);
  color-scheme: light;
}

/* 사진/영상은 다시 invert해서 원본 색 유지 */
html.light img,
html.light video,
html.light .preserve-color {
  filter: invert(1) hue-rotate(180deg);
}
```

### 작동 원리

- `invert(0.92)` — 모든 픽셀 색을 거의 반대로 (0.92로 살짝 부드럽게)
- `hue-rotate(180deg)` — 색상환에서 180도 돌려 원래 hue 복구
- 결과: **밝기만 반전, 색감은 유지**. 핑크는 핑크 톤, 보라는 보라 톤으로 살아있음
- 0.92 vs 1.0: 1.0이면 순백/순흑 극대비. 0.92면 부드러운 오프화이트/오프블랙

### 장점

- **새 팔레트 불필요** — 기존 색 그대로 자동 변환
- 유지보수 0 — 새 컴포넌트 추가해도 라이트 모드 자동 적용
- CSS 한 블록(5줄)으로 끝
- 디자인 변수 늘어나도 추가 작업 없음

### 단점 / 주의

- **이미지/영상은 명시적으로 다시 invert** 안 하면 사진까지 색 반전됨 (KUROMI 사진이 형광 그린 됨)
- backdrop-filter / mix-blend-mode 와 동시 사용 시 의도치 않은 효과 가능
- 그라디언트 배경도 자동 반전되므로 별도 라이트 bg 정의 안 해도 됨
  → 만약 bg를 따로 두려면 `html.light body { background: ... }` 추가하되 filter와 충돌 인지

## 2. 토글 버튼 + localStorage

```jsx
import { useEffect, useState } from 'react'

function ThemeToggle() {
  const [light, setLight] = useState(() => {
    const saved = localStorage.getItem('theme-key')
    if (saved) return saved === 'light'
    // 시스템 선호 따라가기 (선택)
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    localStorage.setItem('theme-key', light ? 'light' : 'dark')
  }, [light])

  return (
    <button onClick={() => setLight(v => !v)} aria-label={light ? '다크' : '라이트'}>
      {light ? '☀' : '☾'}
    </button>
  )
}
```

- localStorage 키는 프로젝트별로 prefix (`minihome-theme`, `kuromi-theme` 등) — 다른 임베드 프로젝트와 충돌 방지
- 시스템 선호 (`prefers-color-scheme`) 첫 진입 시에만 적용. 이후엔 사용자 선택 우선
- `☀ ☾` 같은 픽토그램은 기능적이라 emoji 금지 룰 예외

## 3. 트랜지션

```css
html {
  transition: filter 0.35s ease;
}
```

토글 시 즉시 깜빡 대신 0.35s 페이드. 너무 길면(1s+) 답답함, 너무 짧으면(0.1s) 깜빡임. 0.3~0.4s 권장.

## 4. 와이드 데스크탑 반응형

Vite 기본 템플릿이나 일부 CSS 가이드는 `#root { width: 1126px; max-width: 100%; margin: 0 auto; }` 같이 픽셀 고정 폭을 박아둠.
**1600px+ 모니터에서 좌우 ~250px씩 빈 공간**이 생김. 사이드바가 있는 레이아웃이면 더 어색해짐 (좌측에 거대한 빈 보라 영역).

### 해결 — #root는 풀폭, 콘텐츠 max-width로 제어

```css
#root {
  width: 100%;            /* 1126px → 100% */
  max-width: 1440px;      /* 거의 모든 노트북에 충분 */
  margin: 0 auto;
}

@media (min-width: 1600px) {
  #root {
    max-width: 1520px;    /* 와이드 모니터에서 살짝 더 펼침 */
  }
}
```

### 메인 영역 패딩 보강

좁은 모니터에서 잘 보이던 padding이 와이드에선 너무 빡빡할 수 있음.

```css
.app-main {
  padding: 28px 32px 60px;
  min-width: 0;           /* flex 자식에 필수 — 안 넣으면 카드 그리드가 부모 폭 넘음 */
}

@media (min-width: 1280px) {
  .app-main {
    padding: 36px 56px 72px;
  }
}
```

`min-width: 0` 빼먹으면 flex item이 콘텐츠 크기로 부풀어 `overflow-x` 생김.

## 5. 적용 사례

| 프로젝트 | 적용 위치 | 비고 |
|---------|----------|------|
| `vibe-coding-minihome` (외부) | `src/index.css` + `src/components/Sidebar.jsx` | 사이드바 풋터 위에 토글 버튼 |
| `front/` MiniHompyLive 임베드 | (해당 안 됨) | 임베드는 부모(vibe-coding) 다크 톤 고정이 의도 — 내부 토글은 안 둠 |

## 6. 함정 체크리스트

- [ ] 이미지에 `filter: invert(1) hue-rotate(180deg)` 다시 적용 했나
- [ ] localStorage 키 충돌 안 나도록 prefix 줬나
- [ ] 첫 진입 시 시스템 선호 반영하되, 이후 사용자 선택 우선인가
- [ ] backdrop-filter 쓰는 컴포넌트가 라이트 모드에서 깨지지 않나
- [ ] toggle 버튼 aria-label 있나 (스크린리더 접근성)
- [ ] `transition: filter 0.35s` 있나 (없으면 깜빡임 거슬림)

## 7. 언제 쓰면 안 되나

이 트릭은 "다크 톤으로 이미 다 만들었는데 라이트도 일단 켜고 싶다"에 최적. 아래 케이스는 **풀 듀얼 팔레트**가 정답:

- 라이트가 메인 톤이고 다크는 보조 (반대 순서)
- 디자이너가 라이트 색을 직접 정해줌 (브랜드 가이드라인)
- 라이트 모드에서 로고/일러스트 색이 바뀌어야 함 (filter는 색만 반전)
- 그림자(box-shadow)를 라이트에서 새로 짜야 함 — invert가 그림자도 뒤집어서 빛이 위로 가는 듯한 어색함

## 관련 문서

- [미니홈피 라이브 데모](mini-hompy-demo.md) — 임베드 컴포넌트 통합 패턴
- [카드 썸네일+토글](card-thumbnail-toggle.md) — 카드 UI에서 토글 사용 사례
