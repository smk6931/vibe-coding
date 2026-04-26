# 바이브 세션 (Vibe Session)

바이브코딩·AI 오프라인 소모임 플랫폼.
모임 어그리게이션 대시보드 + 학습 가이드 + 커뮤니티.

---

## 아키텍처

```
[브라우저]
    │  HTTP(S)
    ▼
[Nginx — Oracle VM :80/:443]
    ├── /api/*   → Django 백엔드 :8000
    └── /*       → React 프론트엔드 (정적 빌드)

[Django API :8000]
    └── PostgreSQL :5432 (동일 VM)
```

---

## 디렉토리 구조

```
vibe_coding/
├── front/                        # React 프론트엔드 (Vite + React Router)
│   ├── src/
│   │   ├── app.jsx               # BrowserRouter + 전체 라우트 조립
│   │   ├── routes/               # 도메인별 라우트 정의 (app.jsx가 여기서만 import)
│   │   │   ├── index.js          # communityRoutes, guideRoutes 재export
│   │   │   ├── community.jsx     # /community/* 라우트
│   │   │   └── guide.jsx         # /guide/* 라우트
│   │   ├── pages/                # 페이지 UI 컴포넌트 (라우트 정의 없음)
│   │   │   ├── Home.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Me.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── About.jsx
│   │   │   ├── community/        # /community 도메인 페이지
│   │   │   │   ├── CommunityLayout.jsx   # 공통 탭 네비
│   │   │   │   ├── index.jsx             # 쇼케이스
│   │   │   │   ├── board.jsx
│   │   │   │   ├── members.jsx
│   │   │   │   └── qa.jsx
│   │   │   └── guide/            # /guide 도메인 페이지
│   │   │       ├── GuideLayout.jsx       # 공통 사이드바 레이아웃
│   │   │       ├── GuideSidebar.jsx      # 토글 사이드바 컴포넌트
│   │   │       ├── index.jsx             # 가이드 홈
│   │   │       ├── oneday/
│   │   │       │   ├── Install.jsx       # /guide/oneday/install
│   │   │       │   └── Preview.jsx       # /guide/oneday/preview
│   │   │       ├── beginner/
│   │   │       │   └── index.jsx         # /guide/beginner
│   │   │       └── claude/
│   │   │           └── index.jsx         # /guide/claude
│   │   ├── components/           # 재사용 UI 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Accordion.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── GuideClient.jsx
│   │   │   ├── HomeClient.jsx
│   │   │   ├── LeafletMap.jsx
│   │   │   └── OnedayClassCurriculum.jsx
│   │   ├── client/               # 백엔드 API 통신
│   │   │   ├── index.js          # axios 인스턴스 + 인터셉터
│   │   │   ├── auth.js
│   │   │   ├── events.js
│   │   │   └── community.js
│   │   ├── lib/                  # 유틸리티
│   │   └── styles/               # Tailwind base CSS
│   ├── public/
│   │   └── data/                 # Phase 1 더미 JSON (Phase 2에 PG로 이전)
│   │       ├── events.json
│   │       ├── members.json
│   │       ├── showcase.json
│   │       ├── site.json
│   │       └── ...
│   └── vite.config.js
│
├── back/                         # Django 백엔드 (DRF + PostgreSQL)
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── local.py
│   │   │   └── production.py
│   │   ├── urls.py               # 루트 URL
│   │   └── wsgi.py
│   ├── apps/                     # 도메인별 앱
│   │   ├── accounts/             # 회원·인증
│   │   ├── events/               # 이벤트·모임
│   │   └── community/            # 쇼케이스·게시판
│   ├── manage.py
│   └── requirements.txt
│
├── docs/
│   ├── plan/                     # 기획안
│   └── task/                     # 작업 로그
├── CLAUDE.md                     # 프로젝트 AI 룰
└── server.py                     # 빌드 + 배포 스크립트
```

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| **프론트엔드** | React 18, Vite, React Router v6, Tailwind CSS |
| **백엔드** | Python 3.12, Django 5, Django REST Framework |
| **데이터베이스** | PostgreSQL 16 |
| **인증** | JWT (djangorestframework-simplejwt) |
| **인프라** | Oracle Cloud VM (Always Free), Nginx + Gunicorn |

---

## 페이지 라우팅

라우트 정의는 `front/src/routes/`에 도메인별로 분리되어 있고, `app.jsx`는 조립만 담당한다.

```
/                        → Home           모임 이벤트 대시보드
/events/:id              → EventDetail    이벤트 상세

/guide                   → GuideIndex     강의 가이드 홈
/guide/oneday/install    → Install        수업 전 준비 가이드
/guide/oneday/preview    → Preview        강의 맛보기
/guide/beginner          → Beginner       입문 (준비중)
/guide/claude            → Claude         Cursor·Claude 활용 (준비중)

/community               → Showcase       쇼케이스
/community/board         → Board          게시판 (백엔드 연결 후)
/community/members       → Members        회원 디렉토리
/community/qa            → QA             Q&A (백엔드 연결 후)

/me                      → Me             마이페이지
/admin                   → Admin          운영자 어드민
/about                   → About
```

---

## API 엔드포인트 구조 (back)

```
/api/v1/
├── auth/           accounts 앱
│   ├── register/
│   ├── login/
│   ├── refresh/
│   └── me/
├── events/         events 앱
└── community/      community 앱
    ├── showcase/
    └── posts/
```

---

## 로컬 개발 실행

### 프론트엔드
```bash
cd front
npm install
npm run dev     # http://localhost:3200
```

### 백엔드
```bash
cd back
python -m venv venv
venv/Scripts/activate       # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # http://localhost:8000
```

---

## 배포 (Oracle VM)

### Nginx 초기 세팅
```bash
sudo apt install nginx -y
sudo mkdir -p /var/www/vibe && sudo chown -R $USER:$USER /var/www/vibe

sudo tee /etc/nginx/sites-available/vibe >/dev/null <<'CONF'
server {
  listen 80 default_server;
  server_name _;
  root /var/www/vibe;
  index index.html;
  try_files $uri $uri/ /index.html;
}
CONF

sudo ln -sf /etc/nginx/sites-available/vibe /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 프론트엔드 배포
```bash
python server.py              # 빌드 + 배포 + 응답 확인
python server.py --skip-build # 빌드 건너뛰기
python server.py --dry-run    # 명령만 출력 (전송 안 함)
```

### 백엔드
```bash
cd back
gunicorn config.wsgi:application --bind 127.0.0.1:8000 -w 4 -D
```
