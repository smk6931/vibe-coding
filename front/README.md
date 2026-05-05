# 바이브 세션 — 프로토타입 (Phase 1)

수원-서울 라이트 클래스 + 전국 바이브코딩 모임 어그리게이션 대시보드의 1차 데모.
**프론트엔드 + 더미 JSON만**으로 화면 흐름을 검증하기 위한 정적 빌드.

선행 문서:
- `../docs/plan/2026-04-25/1043_바이브코딩_소모임_플랫폼_1차기획안.md`
- `../docs/plan/2026-04-25/1121_프로토타입_데모_기획.md`

## 라우트 (10개)

```
/                          # 랜딩
/dashboard                 # ★ 어그리게이션 대시보드 (지도/캘린더/리스트)
/events/[id]               # 이벤트 상세
/library                   # 학습 라이브러리 (전자책+영상+블로그 통합)
/library/[id]              # 라이브러리 상세
/community                 # 커뮤니티 / 쇼케이스
/community/board           # 자유게시판
/community/qa              # Q&A
/community/members         # 회원 디렉토리
/me                        # 마이페이지 (QR 입장권 + 결제 + 포트폴리오 + 뱃지 + 알림)
/admin                     # 어드민 (매출 + 예약 + 문의 + 외부 모임 검수)
/about                     # 모임 소개 / 환불 정책 / FAQ
```

## 로컬 실행

```bash
cd front
npm install
npm run dev
# http://localhost:3200
```

## 정적 빌드

```bash
npm run build
# 산출물: ./dist  (Vite 기본 정적 빌드)
```

## 오라클 VM 배포

### 1) 1회성 설정
```bash
cp deploy.config.example.json deploy.config.json
# 에디터로 deploy.config.json 열어서 본인 값으로 채우기:
#   remoteHost  : 오라클 VM IP (예: 167.x.x.x)
#   remoteUser  : 보통 ubuntu
#   remotePath  : 보통 /var/www/vibe
#   sshKey      : SSH 비공개키 절대 경로
#   siteUrl     : 응답 확인용 URL (예: http://167.x.x.x/)
```
`deploy.config.json` 은 `.gitignore` 에 들어 있어 절대 커밋되지 않습니다.

### 2) 배포 명령 (Windows / Mac / Linux)

**Windows (PowerShell)**
```powershell
.\server.ps1                  # 빌드 + 배포 + 응답 확인
.\server.ps1 -SkipBuild       # ./out 이미 있으면 빌드 생략
.\server.ps1 -DryRun          # 명령만 출력
```

**Mac / Linux / 또는 Python 선호 시**
```bash
python server.py              # 빌드 + 배포 + 응답 확인
python server.py --skip-build
python server.py --dry-run
```

두 스크립트는 같은 `deploy.config.json` 을 읽어 동일 동작합니다.

### 3) 서버 1회성 사전 작업
`server.ps1` 또는 `server.py` 상단 주석에 `nginx 설치 + /var/www/vibe + sites-available 블록` 셋업 명령이 있습니다. 그대로 SSH에서 한 번만 실행하면 끝.

### 4) 방화벽 체크
- 오라클 클라우드 콘솔 → VCN → Security List → Ingress Rules 에 **TCP 80 (그리고 향후 443)** 추가.
- VM 내부 ufw 도 함께: `sudo ufw allow 80/tcp && sudo ufw enable`.
- 둘 중 하나라도 빠뜨리면 외부에서 접속 안 됨 (오라클 자주 빠뜨리는 함정).

## 기술

- **React 18 + Vite + React Router (BrowserRouter) + JSX** — 정적 빌드 (`vite build` → `dist/`)
- Tailwind CSS (커스텀 brand 팔레트, 모바일 우선)
- Leaflet (OpenStreetMap) 메인 지도. KakaoMap 코드는 보존(키 발급 시 활성).
- 라우트 등록: `src/routes/*.jsx` + `src/app.jsx` 의 명시적 lazy import.

## 카카오맵 키 발급 (선택, 미발급 시 SVG fallback)

1. https://developers.kakao.com/ 가입 → 내 애플리케이션 → 추가
2. 플랫폼 → Web → 사이트 도메인 등록
   - 개발: `http://localhost:3000`, `http://localhost:3200`
   - 운영: 본인 오라클 VM IP (예: `http://168.x.x.x`)
3. JavaScript 키 복사
4. `front/.env.local` 파일 생성, 한 줄 저장:
   ```
   VITE_KAKAO_MAP_KEY=발급받은_JavaScript_키
   ```
5. `npm run dev` 재시작 → `/dashboard` 의 지도 뷰가 자동으로 카카오맵으로 전환

## 더미 데이터

```
public/data/
├── site.json           # 브랜드/링크/환불 정책
├── events.json         # 이벤트 15건 (자체 3 + 외부 12)
├── library.json        # 학습 콘텐츠 12건
├── members.json        # 회원 12명
├── showcase.json       # 포트폴리오 8건
├── board.json          # 자유게시판 10건
├── qa.json             # Q&A 6건
├── me.json             # 마이페이지 단일 사용자
└── admin.json          # 어드민 KPI/예약/문의/외부 모임 대기
```

스키마는 Phase 2 PostgreSQL 마이그레이션에서 그대로 컬럼이 되도록 설계되어 있음.

## 알려진 한계 (의도적)

- 카카오맵은 키 등록 시 자동 활성화, 미등록 시 SVG fallback
- 회원가입/로그인/결제/채팅 모두 비활성 (CTA는 "준비 중" 표시)
- 마이페이지·어드민은 더미 사용자/운영자로 자동 진입
- 외부 모임 시드는 데모용 가상 링크 (실 운영 시 약관 검토 후 등록)

## 디자인 룰

`../CLAUDE.md` 참조. 핵심:
- **모바일 우선** (320~430px 기준 1차 디자인 → 데스크탑 enhancement)
- 헤더: 상단 + 모바일 햄버거 (좌측 사이드바 지양)
- 컬러: `brand-*` (액션) + `slate-*` (본문) + `emerald/amber/rose` (상태)
- 자체/외부 이벤트: 색 + 아이콘 두 가지로 구분
