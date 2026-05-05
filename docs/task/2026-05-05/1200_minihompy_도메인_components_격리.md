# MiniHompy* 도메인 컴포넌트 격리 — `components/` 패턴 도입

> 갱신 (2026-05-05 12:10): 처음 `_components/` (밑줄 prefix) 로 만들었으나 운영자 피드백 — 이 프로젝트는 명시적 라우트 등록(`routes/*.jsx`) 이라 자동 라우팅 제외 컨벤션이 불필요. 평범하게 `components/` 로 변경. agents 룰도 동시 갱신.

---


작업일: 2026-05-05
선행: `docs/task/2026-05-05/1130_라우트_파일_매핑_규칙_도입_및_pages_재배치.md`
관련 룰: `agents/frontend/component-placement.md` (§ B + § C 보강)

---

## 왜 이렇게 했나

직전 작업에서 라우트 ↔ 파일 매핑 룰을 박았다. 그 결과 `pages/guide/oneday/` 안에 라우트(`Install`, `Week1~4`, `Demo`)와 비-라우트 시연 컴포넌트(`MiniHompy*`)가 섞여 있는 게 룰 위반으로 드러났다.

운영자: "MiniHompy 같이 한 강의 페이지에서만 쓰는 건 그 jsx 디렉토리에 components 폴더 두고 정리. 지도처럼 어느 페이지든 쓰는 건 전역에 두고."

→ 정확히 두 갈래 — **전역 `components/`** vs **도메인 `pages/{section}/components/`**. `_` prefix 로 비-라우트 폴더 명시.

## 새 폴더 트리

```
pages/guide/oneday/
├── Demo.jsx          ← 라우트 (/guide/oneday/demo)
├── Install.jsx       ← 라우트 (/guide/oneday/install)
├── Week1.jsx ~ Week4.jsx ← 라우트
└── components/      ← 비-라우트 (이 도메인 전용)
    ├── MiniHompy.jsx + .module.css
    ├── MiniHompyLive.jsx + .module.css
    └── MiniHompyDemo.jsx + MiniHompyDemoExtras.module.css
```

폴더만 봐도 `components/` 안의 .jsx 는 라우트가 아니라는 게 즉시 보임.

## 이동 / import 갱신

### 이동 (git mv 6개)
- `MiniHompy.jsx` + `.module.css`
- `MiniHompyLive.jsx` + `.module.css`
- `MiniHompyDemo.jsx` + `MiniHompyDemoExtras.module.css`

### import 경로 갱신 (4 파일)
| 파일 | 이전 → 현재 |
|------|------------|
| `components/MiniHompyGuide.jsx` | `'../pages/guide/oneday/MiniHompyDemo'` → `'../pages/guide/oneday/components/MiniHompyDemo'` |
| `components/GuideClient.jsx` | `'../pages/guide/oneday/MiniHompy'` → `'../pages/guide/oneday/components/MiniHompy'` |
| `components/HomeClient.jsx` | MiniHompy + MiniHompyDemo 둘 다 `components/` 경로로 |
| `pages/guide/oneday/Demo.jsx` | `'./MiniHompyDemo'` → `'./components/MiniHompyDemo'` |

### 검증
```
grep -rn 'guide/oneday/MiniHompy' front/src/
→ No matches found
```

## 룰 명문화 — `agents/frontend/component-placement.md`

§ B "컴포넌트 위치" 를 두 갈래 명확하게 재구성:
1. **전역 (도메인 무관)** → `components/` — 지도, 카드, 아코디언, 신청 모듈 등
2. **도메인 격리 (한 라우트 그룹 전용)** → `pages/{section}/components/` — 그 도메인 시연·헬퍼
3. 판단 기준: "이 컴포넌트가 어느 도메인에 속하는지 한 줄로 설명할 수 있냐?"
4. `_` prefix 의미 + Next.js·SvelteKit·Remix 자동 제외 컨벤션 호환
5. 예시 표 6건 (LeafletMap / EventCard / Accordion / ClassRegistration / MiniHompy* / GuideClient)

§ C 폴더별 역할 요약 표에 `pages/{section}/components/` 행 추가.

## 알려진 이슈 / 다음 정리 후보

- **`MiniHompyLive.jsx` import 0** — 검증 결과 실제 컴포넌트 import 0건. `MiniHompyLive.module.css` 만 `MiniHompyDemo.jsx` 가 사용 중. `curriculums.json` 의 `demoComponent: "MiniHompyLive"` 는 문자열일 뿐 매핑 로직 없음. **dead component 후보** — 별도 검증 후 삭제하거나 demoComponent 매핑 로직 신설할지 결정 필요.
- **`pages/community/{board,members,qa}.jsx`** 도 폴더화 룰에 안 맞음 (직전 라우트 매핑 작업의 후속 후보로 1130 로그에 기록 있음). 같은 결로 정리 가능.
- **`OnedayClassCurriculum.jsx`** — 현재 `components/` 에 있지만 1주차 전용 (Week1.jsx 한 곳에서만 사용). `pages/guide/oneday/components/` 로 옮기는 게 더 일관. 다만 1주차에 종속된 컴포넌트인지 (vs 모든 주차의 일반 가이드 컴포넌트인지) 결정 필요. 2~4주차 본문 작성 시 자연스럽게 결정됨.
