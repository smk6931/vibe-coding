---
description: 프로덕션 배포 (npm build → rsync/scp → nginx reload → curl 응답 확인)
allowed-tools: Bash(python:*), Bash(git:*), Read, Glob
---

# /deploy — vibe-coding 프로덕션 배포

오라클 클라우드 VM(`https://vibe.me.kr/`) 에 정적 빌드 산출물을 배포한다.

## 실행 순서

1. **사전 점검** (parallel)
   - `git status` 로 커밋되지 않은 변경 확인
   - `ls .env` 로 배포 설정 확인 (없으면 사용자에게 알리고 중단)

2. **커밋 안 된 변경이 있으면** 사용자에게 짧게 알리고 다음 중 선택받기:
   - 그대로 배포 (워킹 트리 기준 빌드)
   - 먼저 `/commit` 한 뒤 배포

3. **배포 실행**
   ```
   python server.py
   ```
   - args: 사용자가 명시 안 했으면 그대로 (full build).
   - "빌드 건너뛰기" 명시 시 `--skip-build`.
   - "드라이런" / "확인만" 명시 시 `--dry-run`.
   - "nginx 설정 갱신" 명시 시 `--bootstrap-nginx` 함께.

4. **검증**
   - 스크립트가 마지막에 출력하는 `HTTP 200 · text/html` 줄을 확인.
   - 200 아니면 실패 사유와 함께 보고.

5. **보고 (한 줄)**
   - 예: "✅ 배포 완료 — https://vibe.me.kr/ (HTTP 200, 1.4s 빌드)"
   - 실패 시: "❌ 배포 실패 — {원인}"

## 주의

- 배포 스크립트는 **루트의 `server.py`** (CLAUDE.md 5절의 `front/server.py` 기재는 옛 정보).
- `.env` 는 gitignore. 본인 IP/SSH 키 경로 들어 있음 — 절대 커밋 금지.
- dev 서버가 돌고 있으면 빌드가 `.next` 매니페스트를 깨뜨릴 수 있음 → Vite는 dist만 쓰므로 무관, 단 dev 서버 자체는 사용자에게 안내.
- 배포 후 자동 push 하지 않는다 (사용자가 명시할 때만).
