---
description: 프로젝트 전반 리팩토링 분석 (죽은 코드, 중복, 책임 비대, 위치 위반, 데이터 정합성, 문서 어긋남)
allowed-tools: Read, Grep, Glob, Bash(wc:*), Bash(ls:*), Bash(date:*), Write, Agent
---

# /refactor-scan — 리팩토링 분석 (분석만, 코드 수정 0)

이 프로젝트(vibe-coding)의 전반적인 리팩토링 후보를 grep 기반으로 찾아 MD 보고서 1개로 떨어뜨린다.

## 실행 방법

`refactor-cleaner` 서브에이전트에 위임한다 (subagent_type=refactor-cleaner). 직접 grep 다 돌리지 말 것 — 메인 컨텍스트 절약.

## 서브에이전트에게 줄 컨텍스트

아래를 서브에이전트 prompt 에 그대로 박는다 (이미 분석된 0946 리포트가 좋은 템플릿이니 참조 권장).

### 1. 분석 범위
- `front/src/` — React 컴포넌트 / lib / client / routes
- `front/public/data/*.json` — Phase 1 더미 데이터
- `back/` — Django 앱 (사용자가 명시적으로 "백엔드 빼라" 하면 스킵)
- `agents/`, `CLAUDE.md`, `agents/README.md` — 문서

### 2. 분석 항목 (분류 색상)
- 🔴 죽은 코드 / 미참조 (import 0회, route에서 안 닿는 컴포넌트, JSON 미사용 필드, 미정의 CSS 클래스)
- 🟠 중복 / 통합 후보
- 🟡 책임 비대 / 분리 후보 (300줄+, useState 7+, 서브컴포넌트 5+)
- 🟣 위치 위반 (`agents/frontend/component-placement.md` 룰 어긴 것)
- 🟢 데이터/스키마 정합성 (JSON 필드 사용처, prop 이름 불일치 같은 실 버그)
- ⚪ 문서 ↔ 코드 어긋남 (CLAUDE.md / agents/ 가 실제 코드와 다른 부분)
- 🔵 백엔드 부분 (사용자가 빼라고 안 하면)

### 3. 작업 룰 (반드시 지킬 것)
- **추측 금지.** 글로벌 룰: "Empty data does not automatically mean dead structure." Grep 카운트 기반 근거 필수.
- 동적 import / lazy / dynamic / require / route element 다 본다.
- 각 항목마다: 파일경로:라인, 증상, 근거(grep 결과 카운트), 권장 액션, 위험도(low/med/high), 영향 범위.
- placeholder (Phase 2 백엔드 연결용 client/*, AdminOnly 등)는 **보존 권장**으로 분류.

### 4. 출력 형식
파일 1개만 만든다:
- 경로: `docs/plan/YYYY-MM-DD/HHMM_프로젝트_리팩토링_분석.md` (날짜·시간은 실행 시점)
- 구조: 요약 표 + Top 5 우선처리 + 7개 분류 섹션 + 우선순위 액션 플랜 + 결정 필요 항목(A~H) + 부록(grep 재현 명령)
- 좋은 템플릿: `docs/plan/2026-05-05/0946_프로젝트_리팩토링_분석.md`

### 5. 절대 하지 말 것
- 코드 파일 수정/생성/삭제 (오직 위 MD 1개만)
- "지금 바로 고치겠습니다" 류 자동 액션
- knip, ts-prune 같은 외부 툴 npm 설치
- 추측 기반 판정

## 보고

서브에이전트가 끝나면 다음 형식으로 한 번에:
- 작성 파일 경로
- 핵심 발견 Top 5 (위험도순, 각 1줄)
- 결정 필요 항목 개수만 ("8개 결정 필요 — 보고서 결정 필요 섹션 참조")
- 다음 액션 제안 ("바로 적용할까요? 백엔드 포함 여부?")

## 후속 — `/refactor-apply` 가 따로 없음

분석 결과 적용은 사용자가 "다 고쳐봐" 같이 명시할 때만. 자동 적용 금지. 적용 시에는 별도로 `docs/task/YYYY-MM-DD/HHMM_*.md` 작업 로그 작성.
