# 헤더 메뉴 수업/지식 분리 + /info 라우트 신설 + iframe 임베드

작업일: 2026-05-05
선행: `docs/task/2026-05-05/1959_지식허브_프론트패턴_카탈로그_phase_a.md` (Phase A)
관련 문서: `agents/frontend/knowledge-hub-pattern.md` (URL 트리 갱신)

---

## 왜 이렇게 했나

직전 Phase A 에서 `/guide` 를 "지식 허브" 로 격상해 강의 + 패턴을 한 자리에 묶었는데, 운영자 피드백:
- 헤더 "모임" / "지식" 두 메뉴 + favicon 도 메인 — 중복
- 강의 교안과 짧은 프로그래밍 지식은 결이 다름 → URL prefix 분리가 정합

결과: **/guide ("수업") + /info ("지식")** 2-도메인 분리. favicon 클릭으로 메인 진입.

또한 패턴 데모는 본 사이트로 이전하기엔 작업이 큼 → **iframe 임베드 + 외부 링크 폴백** 으로 즉시 작동.

---

## 새 URL 트리

```
/                                ← 메인 (favicon 클릭)
/guide                           ← "수업" 메뉴 — 강의 교안만
  └─ /guide/oneday/...
      ├─ install
      ├─ week1~4
      └─ demo
/info                            ← "지식" 메뉴 — 짧은 프로그래밍 정보
  ├─ /info/front/patterns        → 4 Tier 카드
  ├─ /info/front/patterns/:tier/:id   → 단일 패턴 (37개)
  └─ (향후 /info/back/..., /info/ai/...)
```

## 헤더 변경

```diff
const MAIN_NAV = [
-  { href: '/',          label: '모임' },
-  { href: '/guide',     label: '지식' },
+  { href: '/guide',     label: '수업' },
+  { href: '/info',      label: '지식' },
];
```

좌측 favicon 의 `<Link to="/">` 가 메인 진입 담당 (기존). "모임" 라벨 메뉴는 제거 — 중복 진입점 정리.

---

## 데모 표시 방식 (3계층 폴백)

`PatternDetail` 의 데모 영역:

| 우선순위 | 방식 | 적용 |
|---------|------|------|
| 1 | 본 사이트 React 컴포넌트 | `DEMO_REGISTRY[id]` 등록된 패턴 (현재 `skeleton` 만) |
| 2 | iframe 임베드 (`https://front-patterns-guide.vercel.app/#{id}`) | 데스크탑 (`sm:` 이상) |
| 3 | "원본 사이트로 보러가기" 외부 링크 | 모바일 + 모든 케이스의 폴백 |

iframe 은 **모바일 reflow 깨짐 우려**로 `sm:` 이상에서만 노출. 모바일은 외부 링크 버튼으로 새 탭 진입 유도.

상단 "라이브 데모" 라벨 우측에 항상 "원본 사이트에서 보기 ↗" 작은 링크 노출 (백업 진입점).

---

## 신규 / 수정 파일

### 신규
| 파일 | 역할 |
|------|------|
| `pages/info/index.jsx` | 지식 허브 인덱스 (front 활성 + back/ai 준비중) |
| `pages/info/InfoLayout.jsx` | /info 도메인 공통 레이아웃 (사이드바 + 콘텐츠) |
| `pages/info/InfoSidebar.jsx` | 좌측 사이드바 (front / back-준비중 / ai-준비중 그룹) |
| `routes/info.jsx` | /info, /info/front/patterns, /info/front/patterns/:tier/:id 라우트 |

### 이동
| 변경 | 결과 |
|------|------|
| `pages/guide/front/` → `pages/info/front/` (cp+rm, untracked였음) | 패턴 카탈로그 + Skeleton 데모 통째 이동 |

### 수정
| 파일 | 변경 |
|------|------|
| `routes/guide.jsx` | front/patterns 라우트 2개 제거 (info 로 이동) |
| `routes/index.js` | `infoRoutes` export 추가 |
| `app.jsx` | infoRoutes import + Routes 매핑 한 줄 추가 |
| `components/layout/Header.jsx` | MAIN_NAV: 모임 제거 + 수업(`/guide`) + 지식(`/info`) |
| `pages/guide/index.jsx` | "수업" 정체성으로 재작성. 강의 교안만 + /info 진입 카드 1개 |
| `pages/guide/GuideSidebar.jsx` | NAV_GROUPS 에서 "프론트엔드 UX 패턴" 그룹 제거 |
| `pages/info/front/patterns/index.jsx` | GuideLayout → InfoLayout, URL 경로 갱신 |
| `pages/info/front/patterns/PatternDetail.jsx` | InfoLayout + iframe 임베드 + 외부 링크 폴백 + URL 경로 갱신 |
| `data/patterns.js` | 주석 URL 갱신 |
| `agents/frontend/knowledge-hub-pattern.md` | URL 트리 + 정체성 섹션 갱신 |

---

## 검증 시나리오

- [ ] favicon 클릭 → `/` 메인 진입
- [ ] 헤더 "수업" → `/guide` (강의 교안 + /info 진입 카드)
- [ ] 헤더 "지식" → `/info` (4 Tier 카드 + 백/AI 준비중 안내)
- [ ] `/info/front/patterns` → 4 Tier 카드
- [ ] `/info/front/patterns/tier1/skeleton` → Skeleton 데모 (본 컴포넌트)
- [ ] `/info/front/patterns/tier2/segmented` 등 → iframe 임베드 표시 (데스크탑) / 외부 링크 (모바일)
- [ ] InfoSidebar 3 그룹 (front 활성 / back 준비중 / ai 준비중) 정상 노출
- [ ] GuideSidebar 에서 패턴 그룹 사라짐
- [ ] 모바일 360~430px 검수

---

## 보안 / 성능 고려사항 (iframe)

- **CSP**: vibe.me.kr 의 nginx 설정에 `Content-Security-Policy: frame-src https://front-patterns-guide.vercel.app` 같은 헤더 명시되어 있지 않음 → 현재 기본 정책으로 iframe 동작 (CSP 강화 시 vercel 도메인 명시 필요)
- **X-Frame-Options**: vercel 사이트가 외부 임베드를 막는 헤더(`X-Frame-Options: DENY` 또는 `SAMEORIGIN`)를 응답하면 iframe 깨짐 → 첫 진입 시 검증 필요. 깨지면 Phase C 본 사이트 이전으로
- **로딩 성능**: iframe `loading="lazy"` 적용. 사용자가 데모 영역 도달 직전에만 로드
- **anchor 자동 스크롤**: src 의 `#{id}` 를 vercel 사이트가 anchor 로 인식하는지는 첫 진입 시 검증 필요. 인식 안 하면 한 페이지 통째 임베드되어 사용자가 직접 스크롤

---

## 다음 단계 (Phase C — 본 사이트 이전)

iframe 한계(X-Frame-Options, 모바일 reflow, anchor 동작 불확실) 가 운영 중 발견되면 점진 이전:

1. `source/front-patterns-guide-main/src/Tier{N}.jsx` 에서 패턴별 데모 함수 추출
2. `pages/info/front/patterns/components/{Id}Demo.jsx` 신규 작성 (Tailwind 변환)
3. `PatternDetail.jsx` `DEMO_REGISTRY` 에 한 줄 추가
4. iframe 폴백 자동 비활성 (Demo 우선)

37개 다 이전 = 5~10시간 분량. 1주차 강의 후 트래픽 보고 결정.
