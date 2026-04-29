---
Title: 카드 썸네일+토글 패턴
Description: 이미지 상단 크게, 제목 클릭 시 설명 토글, 이미지 클릭 시 페이지 이동
When-To-Read: 썸네일 있는 카드 UI를 만들거나, 카드에 아코디언 토글을 붙일 때
Keywords: card, thumbnail, accordion, toggle, grid, GuidePreviewCard, RecommendedHero
Priority: high
---

# 카드 썸네일+토글 패턴

## 왜 이 패턴을 씀

홈 화면 상단에 2열 카드(수업 전 준비 가이드 + 운영자 추천 이벤트)를 나란히 배치할 때,
두 카드의 레이아웃이 달라서(하나는 이미지 상단, 하나는 이미지 좌측) 시각적으로 불통일.
→ 두 카드 모두 **이미지 상단 + 텍스트 하단** 구조로 통일. 모바일 2열에서도 균등하게 보임.

설명이 길면 카드가 너무 커지는 문제 → **제목 클릭 시 토글**로 해결.

## 구조

```
┌─────────────────────┐
│  [이미지/썸네일]     │ ← Link → 상세 페이지
│  h-[130px~170px]    │
├─────────────────────┤
│  제목 [▾]           │ ← onClick: toggle
│  (접힘) 한 줄 요약  │
│  (펼침) 설명 전문   │
│         장소·가격   │
└─────────────────────┘
```

## 실제 코드 위치

`front/src/components/HomeClient.jsx`
- `GuidePreviewCard` — 가이드 카드 (MiniHompy 썸네일)
- `RecommendedHero` — 운영자 추천 이벤트 카드

## 핵심 JSX 뼈대

```jsx
function SomeCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden flex flex-col">
      {/* 이미지: 클릭 → 페이지 이동 */}
      <Link to="/target" className="block relative overflow-hidden h-[130px] sm:h-[160px] shrink-0">
        <img ... className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute top-2 left-2 badge ...">뱃지</span>
      </Link>
      {/* 텍스트: 제목 클릭 → 토글 */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full text-left font-bold text-[12px] sm:text-[13px] ... flex items-start justify-between gap-1"
        >
          <span className="line-clamp-2">제목</span>
          <svg className={`w-3 h-3 shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} ...>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {open ? (
          <div className="mt-1.5 text-[11px] text-slate-500">/* 펼쳤을 때 상세 */</div>
        ) : (
          <span className="mt-1 text-[10px] text-brand-600">한 줄 요약 →</span>
        )}
      </div>
    </div>
  );
}
```

## 그리드 배치 (홈 상단)

```jsx
<div className="grid grid-cols-2 gap-2 sm:gap-3">
  <GuidePreviewCard />
  {recommended && <RecommendedHero event={recommended} />}
</div>
```

- `grid-cols-2` 고정: 모바일에서도 항상 나란히 2열
- `sm:gap-3`: 데스크탑에서 gap 조금 더

## 라이브 컴포넌트를 썸네일로 쓸 때

홈 화면 두 카드는 정적 이미지 대신 **실제 라이브 컴포넌트를 scale 축소**해서 썸네일로 씀.
배지에는 `z-10` 필수 (썸네일 위에 떠야 가려지지 않음).

### 좌측 — MiniHompy (보라 1페이지)

```jsx
<Link to="/guide/oneday/install" className="block relative overflow-hidden h-[150px] sm:h-[170px] shrink-0">
  <div style={{
    position: 'absolute', top: 0, left: '50%',
    transform: 'translateX(-50%) scale(0.42)',
    transformOrigin: 'top center',
    width: '380px',
    pointerEvents: 'none',
  }}>
    <MiniHompy />
  </div>
  <span className="absolute top-2 left-2 badge bg-brand-600 text-white z-10">수업 전 준비</span>
</Link>
```

### 우측 — MiniHompyLive (KUROMI 미니홈피, thumbnail 모드)

사이드바 빼고 홈 페이지만 보여주는 `thumbnail` prop 사용:

```jsx
<Link to={`/events/${event.id}`} className="block relative overflow-hidden h-[150px] sm:h-[170px] shrink-0">
  <div style={{
    position: 'absolute', top: 0, left: '50%',
    transform: 'translateX(-50%) scale(0.46)',
    transformOrigin: 'top center',
    width: '420px',
    pointerEvents: 'none',
  }}>
    <MiniHompyLive thumbnail />
  </div>
  <span className="absolute top-2 left-2 badge bg-warm-500 text-white z-10">★ 운영자 추천</span>
</Link>
```

### 공통 원칙

- `top: 0` + `transformOrigin: 'top center'` → 컴포넌트 최상단(헤더)부터 보임
- `pointerEvents: 'none'` 필수 — 캔버스/내부 인터랙션 막아 Link 클릭 정상 동작
- 배지에 `z-10` — scale된 컴포넌트 위에 표시되도록
- scale 결정: container_width(180~280px) / element_width(380~420px) ≈ 시각 채움 비율
- 두 카드 외형은 다르되 **같은 다크 보라 톤**이라 시각적 통일감 유지

MiniHompyLive 자세한 통합 전략은 [mini-hompy-demo.md](mini-hompy-demo.md) 참조.
