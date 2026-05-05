import s from './GitHubGuide.module.css';
import PromptRef from './PromptRef';

const SECTIONS = [
  {
    id: 'commit-push',
    label: '1단계 — 미니홈피 완성품 GitHub에 올리기',
    labelColor: '#06b6d4',
    badge: '0:00~0:10',
    desc: 'Chapter 2에서 만든 미니홈피 코드를 VS Code Source Control로 커밋 + 푸쉬. Chapter 1에서 publish 한 저장소가 있으니 이번엔 "변경사항 동기화" 만 하면 됩니다.',
    steps: [
      {
        num: '1-1',
        color: '#06b6d4',
        title: 'Source Control → 변경사항 커밋',
        desc: 'VS Code 좌측 Git 아이콘(Ctrl+Shift+G) → 변경된 파일들 + 버튼 → 커밋 메시지 → 체크 버튼.',
        detail: '캡처 좌측 Source Control 패널에 미니홈피 작업하면서 수정된 파일들이 전부 떠있는 상태. 커밋 메시지는 "미니홈피 완성" 같이 한 줄로 충분 — 이게 코드 스냅샷의 이름표가 됩니다.',
        img: '/images/guide/week1/chapter3-1-git-commit.png',
        prompt: '방금 미니홈피 작업 끝났어. VS Code Source Control 탭에서 모든 변경사항을 한 번에 커밋하고 싶어. 어떤 순서로 클릭하면 돼? 커밋 메시지는 "미니홈피 완성"으로.',
        tip: '여러 파일 한 번에 커밋해도 됨. 커밋 메시지는 "왜 바꿨는지" 보다 "무엇이 바뀌었는지" — 1~2주 후 본인이 봐도 알게.',
      },
      {
        num: '1-2',
        color: '#06b6d4',
        title: 'Sync Changes → GitHub 원격 동기화',
        desc: '커밋 후 상단 Sync Changes(↑↓ 화살표) 클릭 → GitHub에 push 완료.',
        detail: 'GitHub 저장소 페이지를 새로고침하면 방금 만든 미니홈피 파일들이 다 올라와 있음. node_modules는 .gitignore 덕분에 안 올라가지만 Vercel이 빌드 서버에서 알아서 npm install 함 — 걱정 X.',
        img: '/images/guide/week1/chapter3-2-git-push.png',
        prompt: '커밋했는데 이거를 GitHub 원격 저장소에 올리려면 어떻게 해? Sync Changes 누르면 push 되는 거 맞지?',
        tip: 'push가 처음일 땐 GitHub 로그인 창이 한 번 더 뜰 수 있음. 이미 Chapter 1에서 로그인해뒀으면 그냥 자동으로 올라감.',
      },
    ],
  },
  {
    id: 'ai-guide',
    label: '2단계 — AI에게 배포 가이드 요청 (★ 바이브 코딩의 핵심)',
    labelColor: '#ec4899',
    badge: '0:10~0:15',
    desc: '"Vercel? 들어본 적도 없는데" 그냥 AI한테 물어보면 됩니다. 코드만 짜는 게 아니라 모르는 과정을 단계별 마크다운 가이드로 받아 학습 자료로 쓸 수 있다는 게 바이브 코딩의 두 번째 강점.',
    steps: [
      {
        num: '2',
        color: '#ec4899',
        title: 'Claude에게 배포 흐름 통째로 받기',
        desc: 'AI가 회원가입 → 저장소 Import → Deploy → 도메인 확인까지 한 번에 마크다운으로 정리해줍니다.',
        detail: '캡처 우측 Claude 응답: "Vercel 배포 가이드 (초보자용)" 마크다운 문서가 채팅창에 그려짐. 단계별 헤더 + 1분 체크리스트 + 자주 막히는 곳 표 + 무료 플랜 한도까지 — 이대로 따라가면 끝. 학생들이 직접 이 가이드를 보면서 진행하면 강사는 막히는 사람만 봐주면 됨.',
        img: '/images/guide/week1/chapter3-3-ai-guide.png',
        prompt: '내가 만든 Vite + React 미니홈피를 Vercel로 무료 배포하려고 해. 처음 해보는데 vercel.com 회원가입부터 첫 배포 URL 받기까지 단계별로 알려줘. 자주 막히는 곳도 미리 알려주고 마크다운으로 깔끔하게 정리해서.',
        tip: '이 단계에서 받은 마크다운을 캡처해서 학생들에게 배포 → 학생들도 자기 화면에 띄워두고 따라옴. "강사 화면 보지 말고 본인 AI 답변 보면서" 라고 한 번 강조.',
      },
    ],
  },
  {
    id: 'vercel-signup',
    label: '3단계 — Vercel 가입 (GitHub 인증)',
    labelColor: '#0f172a',
    badge: '0:15~0:25',
    desc: 'vercel.com에 GitHub으로 한 번에 로그인. 별도 비밀번호 만들 필요 없고 GitHub 권한만 주면 끝.',
    steps: [
      {
        num: '3-1',
        color: '#0f172a',
        title: 'vercel.com → Sign Up',
        desc: 'https://vercel.com 접속 → 우측 상단 Sign Up → 가입 옵션 5개 중 GitHub 선택.',
        detail: '캡처: "Let\'s create your account" 화면. Continue with Google / GitHub / GitLab / Bitbucket / Apple 중 GitHub 선택 — 우리 코드가 GitHub에 있으니 같은 계정 묶는 게 편함.',
        img: '/images/guide/week1/chapter3-4-vercel-signup.png',
        prompt: 'vercel.com 들어와서 회원가입 시작했어. Continue with GitHub 누르면 어떤 화면이 나와? GitHub 비밀번호 다시 쳐야 돼?',
        tip: 'GitHub 이미 로그인된 브라우저면 비밀번호 안 물어봄. 다른 브라우저면 GitHub 로그인부터 다시.',
      },
      {
        num: '3-2',
        color: '#0f172a',
        title: 'Continue with GitHub 클릭',
        desc: 'GitHub OAuth 화면으로 자동 이동. "Vercel" 로고가 보이면 정상.',
        detail: '캡처: GitHub 가입 옵션 중 검은색 Continue with GitHub 버튼이 강조. 학생 중에는 Google 아이콘이 더 눈에 띄어서 잘못 누르는 경우 있음 — 반드시 GitHub.',
        img: '/images/guide/week1/chapter3-5-continue-github.png',
        prompt: 'Continue with GitHub 누르려는데 위에 Google이 더 눈에 띄어. 왜 GitHub으로 가입해야 돼?',
        tip: 'Google로 가입해도 나중에 GitHub 연결할 수는 있지만, 처음부터 GitHub으로 묶는 게 한 번에 끝남.',
      },
      {
        num: '3-3',
        color: '#0f172a',
        title: 'Authorize Vercel — 권한 승인',
        desc: 'GitHub이 "Vercel이 너의 저장소에 접근해도 돼?" 묻는 화면. 초록색 Authorize 버튼 클릭.',
        detail: '캡처: "Vercel by Vercel wants access to your GitHub account" 화면. 권한은 Email read + Repository read — 안전한 범위. 처음에는 모든 저장소 다 권한 줬다가 나중에 Settings에서 특정 저장소만 줄이는 것도 가능.',
        img: '/images/guide/week1/chapter3-6-authorize.png',
        prompt: 'GitHub Authorize Vercel 화면 떴어. 모든 저장소 다 권한 줘도 돼? 아니면 특정 저장소만?',
        tip: '연습용이면 모든 저장소 OK. 회사 코드까지 들어있는 계정이면 "Only select repositories" → minihome 저장소만 선택.',
      },
    ],
  },
  {
    id: 'import-deploy',
    label: '4단계 — 저장소 Import + Deploy 클릭',
    labelColor: '#6366f1',
    badge: '0:25~0:35',
    desc: '내 GitHub 저장소를 Vercel 프로젝트로 가져오기. Vite는 자동으로 잡혀서 설정 건드릴 게 없습니다 — Deploy 버튼 한 번이면 끝.',
    steps: [
      {
        num: '4-1',
        color: '#6366f1',
        title: 'New Project → vibe-coding-minihome Import',
        desc: '대시보드 → Add New → Project → Import Git Repository 목록에서 내 저장소 옆 Import.',
        detail: '캡처: "Let\'s build something new" 화면. 좌측 Import Git Repository 목록에 내 GitHub 저장소들이 떠있음. vibe-coding-minihome 옆 Import 버튼이 빨간 박스로 강조. 우측 Clone Template은 무시 — 우리는 이미 만든 코드가 있음.',
        img: '/images/guide/week1/chapter3-7-import-repo.png',
        prompt: 'Vercel 대시보드 들어왔어. 내 vibe-coding-minihome 저장소를 Import 누르면 다음에 어떤 화면 나와?',
        tip: '저장소가 안 보이면 "Adjust GitHub App Permissions" 클릭 → 권한 설정에서 해당 저장소 추가.',
      },
      {
        num: '4-2',
        color: '#6366f1',
        title: 'Configure Project → Deploy 클릭',
        desc: 'Framework Preset이 Vite로 자동 감지. Build Command, Output Directory 그대로 두고 Deploy.',
        detail: '캡처: "New Project" Configure 화면. Framework Preset = Vite, Root Directory = ./, Build/Output 자동. 환경 변수 우리는 안 쓰니 무시. 빨간 박스로 강조된 Deploy 버튼 클릭하면 1~2분 빌드 진행 → 폭죽 화면.',
        img: '/images/guide/week1/chapter3-8-deploy.png',
        prompt: 'Configure Project 화면 왔어. Framework Preset에 Vite 자동 잡혔고 Build Command, Output Directory도 자동이야. 그대로 Deploy 눌러도 돼? 환경변수는 비워둬도 괜찮아?',
        tip: '환경변수는 우리 미니홈피에는 없음. 나중에 API 키 같은 비밀값 쓰는 프로젝트면 여기서 추가.',
      },
    ],
  },
  {
    id: 'verify-domain',
    label: '5단계 — 배포 완료 확인 + 도메인',
    labelColor: '#10b981',
    badge: '0:35~0:40',
    desc: '폭죽 화면 보고 끝났다고 안심하지 말 것. 실제 URL 들어가서 미니홈피가 정상으로 뜨는지 확인 + 친구한테 공유.',
    steps: [
      {
        num: '5-1',
        color: '#10b981',
        title: '배포 성공 → Continue to Dashboard',
        desc: '폭죽 + 미리보기 화면 + Continue to Dashboard 버튼. 클릭하면 프로젝트 대시보드로 이동.',
        detail: '캡처: 미니홈피 미리보기 + "Next Steps" (Instant Previews / Add Domain / Speed Insights) + 빨간 박스로 강조된 Continue to Dashboard. 빌드 실패하면 폭죽 대신 빨간 에러 — Build Logs 클릭해서 에러 메시지 그대로 AI에게 복사.',
        img: '/images/guide/week1/chapter3-9-deploy-success.png',
        prompt: '폭죽 화면 떴어. Continue to Dashboard 누르면 뭐가 나와? 그리고 만약 빌드가 실패했으면 어디서 에러 로그 볼 수 있어?',
        tip: '실패 시 가장 흔한 원인은 vite.config.js의 base 경로. 기본값(/)이면 Vercel은 OK. GitHub Pages용으로 base 바꿨으면 다시 / 로 되돌리거나 vercel.json 추가.',
      },
      {
        num: '5-2',
        color: '#10b981',
        title: 'Domains → vibe-coding-minihome.vercel.app 확인',
        desc: '대시보드 좌측 Domains 메뉴 → 본인 사이트 URL 클릭 → 새 탭에서 미니홈피 정상 출력 확인.',
        detail: '캡처: Vercel 프로젝트 대시보드. 좌측 메뉴 Domains 위에 vibe-coding-minihome.vercel.app 가 빨간 박스로 강조. 이 URL을 카톡 / 인스타 / DM으로 친구한테 보내기 — 이게 "배포의 진짜 끝".',
        img: '/images/guide/week1/chapter3-10-domain.png',
        prompt: '내 미니홈피 URL은 vibe-coding-minihome.vercel.app 이야. 이 주소가 너무 길면 어떻게 바꿔? 그리고 코드 수정해서 git push 하면 자동으로 다시 배포되는 거 맞지?',
        tip: '코드 수정 → git push → 1~2분 후 사이트 자동 갱신. 이게 Vercel의 진짜 매력. Deployments 탭에서 새 배포 자동 생성된 것도 확인 가능.',
      },
    ],
  },
];

export default function VercelGuide({ isAdmin = false }) {
  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div>
          <h2 className={s.title}>Chapter 3 — Vercel 무료 배포</h2>
          <p className={s.subtitle}>
            {isAdmin
              ? '교안 모드 — 5단계 10스텝 + 운영 노트. 학생이 막히면 해당 스텝 캡처 보여주기.'
              : 'Chapter 2 미니홈피를 인터넷에 올려서 친구한테 링크 보내자. AI 가이드 받기 → 회원가입 → Import → Deploy 5단계.'}
          </p>
        </div>
        {isAdmin && <span className={s.adminBadge}>교안 모드</span>}
      </div>

      <div className="rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 px-4 py-3.5 sm:px-5 sm:py-4 mb-4">
        <div className="text-[11px] font-bold text-pink-700 uppercase tracking-wider mb-1.5">
          이 챕터의 차별 포인트
        </div>
        <p className="text-[12px] sm:text-[13px] text-slate-700 leading-relaxed">
          <strong className="text-slate-900">바이브 코딩 = 코드 짜는 도구만이 아니다.</strong>{' '}
          모르는 과정(Vercel 회원가입·도메인 설정 등)을 AI에게 물어보면 단계별 마크다운 가이드로 받아 학습 자료로 쓸 수 있다.
          학생은 강사 화면 따라오는 게 아니라 <strong className="text-slate-900">본인 AI 답변</strong>을 보면서 자기 페이스대로 진행 — 강사는 막힌 사람만 봐주면 됨.
        </p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.id} className={s.section}>
          <div className={s.sectionHeader}>
            <span className={s.sectionLabel} style={{ background: section.labelColor }}>
              {section.label}
            </span>
            <span className={s.sectionBadge}>{section.badge}</span>
          </div>
          <p className={s.sectionDesc}>{section.desc}</p>

          <div className={s.stepList}>
            {section.steps.map(step => (
              <div key={step.num} className={s.stepCard}>
                <div className={s.stepLeft}>
                  <div className={s.stepNum} style={{ background: step.color }}>
                    {step.num}
                  </div>
                  <div className={s.stepLine} />
                </div>

                <div className={s.stepBody}>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepDesc}>{step.desc}</p>
                  <p className={s.stepDetail}>{step.detail}</p>

                  {isAdmin && step.img && (
                    <div className={s.imgWrap}>
                      <img
                        src={step.img}
                        alt={step.title}
                        className={s.stepImg}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {step.prompt && <PromptRef text={step.prompt} />}

                  {step.tip && (
                    <div className={s.tipBox}>
                      <span className={s.tipIcon}>TIP</span>
                      {step.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-[14px] font-bold text-slate-800">배포 완료 후 체크리스트</h3>
        </div>
        <ul className="space-y-1.5 text-[12px] text-slate-700 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
            <span>Vercel 가입 완료 (GitHub 연동)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
            <span>vibe-coding-minihome 저장소 Import 성공</span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
            <span>첫 배포 성공 (xxx.vercel.app URL 받음)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
            <span>배포된 사이트 정상 출력 확인 (모바일 + 데스크탑)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
            <span>코드 수정 → git push → 자동 재배포 동작 확인</span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
            <span>친구한테 링크 1명 이상 공유</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

