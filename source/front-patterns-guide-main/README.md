# Frontend UX Patterns Guide

37개 프론트엔드 UX 패턴을 4개 Tier로 묶어 직접 동작하는 데모로 모은 학습용 React 앱.

## 실행

```bash
npm install
npm run dev
# http://localhost:5000
```

## 구조

- **Tier 1 (12개)** 정보 표현 / 기본 인터랙션 — 스켈레톤·토스트·모달·드로어 등
- **Tier 2 (19개)** 운영 수준 패턴 — 필터칩·벌크액션·인라인편집·Undo·Optimistic·Tabs·Stepper·Tooltip·Popover·Command Palette·Virtual List·Debounce 등
- **Tier 3 (3개)** 디자인 시스템 — 토큰 3계층 / 8pt Grid / Color Scale
- **Tier 4 (3개)** 접근성 — Live Region / Skip Link / Color Blind 대응

## 파일 구조

```
src/
├── main.jsx          # React 엔트리
├── FrontGuide.jsx    # 4 Tier 컨테이너 + Hero + 다크모드
├── Tier1.jsx         # 12개 데모 (정보 표현)
├── Tier2.jsx         # 19개 데모 (운영 패턴)
├── Tier3.jsx         # 3개 데모 (디자인 시스템)
├── Tier4.jsx         # 3개 데모 (접근성)
├── ui.jsx            # SectionCard / TierHeader 공유 컴포넌트
├── data.js           # 샘플 데이터
└── styles.css        # 전체 스타일 (Tier별 섹션)
```

## 핵심 사용법

- 다크 모드: 페이지 우상단 토글 (CSS 변수 + `data-theme`)
- Command Palette: 어디서든 **Ctrl+K**
- Skip Link: 페이지 첫 진입 후 **Tab** 한 번 → 좌상단에 본문 바로가기 등장
