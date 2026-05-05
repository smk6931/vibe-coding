# Next.js 잔재 정리 + EventDetail 파일명 복원

작업일: 2026-05-05
선행: `docs/task/2026-05-05/1130_라우트_파일_매핑_규칙_도입_및_pages_재배치.md` (1130 작업이 `[id].jsx` 박은 잘못된 결정)
관련: `docs/plan/2026-04-27/1_프로젝트_진단.md` (Vite 전환 사실 인지 문서)

---

## 왜 이렇게 했나

운영자: "이 프로젝트는 React Router + Vite인데 `[id].jsx` 는 Next.js 컨벤션이라 안 맞는다. 코드 보면 아직도 Next.js 규칙 쓰고 있는 거냐?"

100% 맞는 지적. 이 프로젝트는 2026-04-27 시점에 이미 Vite + React Router 로 전환됐는데:
- `CLAUDE.md` 가 여전히 "Next.js 14 App Router" 라고 박고 있었음
- `agents/frontend/component-placement.md` 가 동적 라우트 파일명을 `[id].jsx` (Next.js) 로 강제하고 있었음
- `front/README.md` 가 "Next.js 14 (App Router)" 표기 + `NEXT_PUBLIC_*` 환경변수 예시
- 직전 1130 작업에서 내가 `EventDetail.jsx` → `[id].jsx` 로 옮긴 게 결정적 모순 — 자동 매핑 없는 환경에 자동 매핑 컨벤션 박은 셈

## 결론 — 컨벤션 정리

| 항목 | Next.js (잔재) | 현재 (Vite + React Router) |
|------|---------------|---------------------------|
| 동적 라우트 파일명 | `[id].jsx` | **`EventDetail.jsx`** (의미 명사 PascalCase) |
| 폴더 매핑 | 자동 (App Router) | 수동 (`routes/*.jsx` 명시 lazy import) |
| 빌드 | `output: 'export'` | `vite build` → `dist/` |
| 환경변수 | `NEXT_PUBLIC_*` | `VITE_*` (`import.meta.env.VITE_FOO`) |

## 수정 파일

### 코드
| 파일 | 변경 |
|------|------|
| `front/src/pages/events/[id].jsx` → `events/EventDetail.jsx` | git mv (의미 명사 PascalCase) |
| `front/src/app.jsx` | lazy import 경로 갱신 |

### 룰 / 문서
| 파일 | 변경 |
|------|------|
| `CLAUDE.md` § 4-0 | "Next.js 14 App Router" → "React 18 + Vite + React Router". 환경변수 `VITE_*` 명시. Next.js 아니라는 것 + 전환 시점 명시 |
| `CLAUDE.md` § 1-7 | `next.config.mjs` 언급 제거 |
| `CLAUDE.md` § 4-2 | `NEXT_PUBLIC_*` → `VITE_*`. `import.meta.env.VITE_FOO` 명시 |
| `CLAUDE.md` § 4-3 | "use client / 서버 컴포넌트" 같은 Next.js 식 표현 제거. React Router 식 슬림 페이지 컨벤션으로 교체 |
| `CLAUDE.md` § 4-3-1 | 동적 라우트는 의미 명사 (`EventDetail.jsx`). `[id].jsx` 사용 안 함 명시 |
| `CLAUDE.md` § 4-4 | "Next.js" 섹션 → "Vite + React Router 운영 룰". `dist/` 산출물, SPA fallback, dev 미들웨어 룰 |
| `agents/frontend/component-placement.md` § A | 매핑 표에서 `[id].jsx` → `EventDetail.jsx`. 컨벤션 디테일 섹션을 "Vite + React Router" 명시로 재작성 |
| `~/.claude/rules/route-file-mapping.md` (글로벌) | 동적 라우트 매핑 예시에 `EventDetail.jsx` 추가. "Dynamic route file naming — pick by framework" 섹션 신규 — 자동 매핑 vs 수동 매핑별 컨벤션 분기 |
| `front/README.md` | "Next.js 14 (App Router)" → "React 18 + Vite + React Router". `./out` → `./dist`. `NEXT_PUBLIC_*` → `VITE_*` |

## 검증

- 잔존 Next.js 표기는 모두 (a) 명시적 부정/정정 표현, (b) 역사적 문서(docs/plan/2026-04-25, 2026-04-27, docs/task/2026-04-25), (c) 더미 데이터 태그(showcase·members·qa·events.json 안의 "Next.js" 카테고리) 로 분류됨 → 보존이 맞음.
- 운영 코드/룰에서 동작하는 잔재 0건.

## 보류 (별도 작업)

- **`docs/arch/시스템_아키텍처_Phase2.md`** — Phase 2 진입 시점에 통째로 재작성 예정. 지금 손대면 추측으로 가정만 다시 채워야 해서 가치 없음. 한 번 더 결정 필요: Phase 2 도 React Router + Vite 로 갈지, 아니면 그때 Next.js / Remix / Astro 등 SSR 프레임워크 도입할지. 그 결정 시점에 본 문서 재작성.

## 글로벌 룰 추가 가치

`~/.claude/rules/route-file-mapping.md` 에 "Dynamic route file naming — pick by framework" 한 단락 추가. 다른 프로젝트에서도 같은 실수(자동 매핑 없는 환경에 자동 매핑 컨벤션 박기) 안 하게 사전 방지.
