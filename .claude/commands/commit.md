---
description: 변경 분석 후 한국어 커밋 메시지로 git commit (push 안 함)
allowed-tools: Bash(git:*), Read, Glob, Grep
---

# /commit — vibe-coding 표준 커밋

워킹 트리 변경을 분석해서 한국어 커밋 메시지로 커밋한다. **push는 사용자가 명시할 때만**.

## 실행 순서

1. **현재 상태 파악** (parallel)
   - `git status`
   - `git diff --stat`
   - `git log --oneline -10` (이 repo의 메시지 톤 참고)

2. **변경 분석**
   - 수정된 파일이 많으면 핵심 파일만 골라 `git diff <files>` 로 내용 확인.
   - 카테고리 분류: 기능 추가 / 수정 / 리팩터 / 문서 / 설정 / 데이터.
   - 비밀 파일(`.env`, `*.key`, `deploy.config.json` 등)이 untracked/staged 에 있으면 **경고하고 자동 제외**.

3. **스테이징**
   - `git add .` 또는 `git add -A` 금지 — 항상 파일 명시.
   - 새 파일도 사용자 변경 의도가 명확한 것만 (스크린샷·로그·plan/task md 포함).

4. **커밋 메시지**
   - **한국어 한 줄 제목** (이 repo 컨벤션 — 예: "다크모드 토글 + 미니홈피 banner 모드 추가").
   - 변경이 여러 갈래면 본문에 불릿 3~6개로 핵심 요약.
   - 마지막에 빈 줄 + `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
   - HEREDOC 으로 전달:
     ```bash
     git commit -m "$(cat <<'EOF'
     {제목}

     - {불릿1}
     - {불릿2}

     Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
     EOF
     )"
     ```

5. **검증 + 보고**
   - `git status` 로 클린 상태 확인.
   - 한 줄 보고: "커밋 {short sha} — {제목} (N files, +X/-Y)".
   - **push 는 사용자가 명시 안 하면 절대 자동 실행 금지**.

## 주의

- pre-commit hook 실패 시 `--no-verify` 금지. 원인 고치고 새 커밋.
- amend 금지 (사용자 명시 시 예외).
- 작업 로그(`docs/task/YYYY-MM-DD/HHMM_*.md`) 가 새로 생겼으면 같이 스테이징.
