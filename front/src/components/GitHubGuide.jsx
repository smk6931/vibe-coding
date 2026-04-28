import s from './GitHubGuide.module.css';

const SECTIONS = [
  {
    id: 'setup',
    label: '사전 설치',
    labelColor: '#64748b',
    badge: '수업 전 1회만',
    desc: 'GitLens와 GitHub 확장 설치 + 로그인. 수업 당일 시간 절약을 위해 미리 해오세요.',
    steps: [
      {
        num: '0-1',
        color: '#6366f1',
        title: 'GitLens 설치',
        desc: 'Extensions(Ctrl+Shift+X) → "GitLens" 검색 → Install',
        detail: '커밋 히스토리와 브랜치를 시각화해주는 확장이에요. GRAPH 뷰가 생깁니다.',
        img: '/images/guide/week1/step-0-1-gitlens-install.png',
      },
      {
        num: '0-2',
        color: '#6366f1',
        title: 'GitHub Pull Requests 설치',
        desc: 'Extensions → "GitHub Pull Requests" 검색 → Install',
        detail: 'VSCode에서 GitHub 리포를 직접 생성하고 관리할 수 있게 해주는 공식 확장이에요.',
        img: '/images/guide/week1/step-0-2-github-pr-install.png',
      },
      {
        num: '0-3',
        color: '#6366f1',
        title: 'GitHub 로그인 (브라우저)',
        desc: 'VSCode 좌하단 계정 아이콘 → "GitHub으로 로그인" → 브라우저에서 인증',
        detail: '브라우저가 열리면서 GitHub 로그인 페이지가 나와요. 계정 입력 후 Authorize 클릭.',
        img: '/images/guide/week1/step-0-3-github-login-browser.png',
      },
      {
        num: '0-4',
        color: '#6366f1',
        title: '로그인 완료 확인',
        desc: 'VSCode 좌하단 계정 아이콘 → GitHub 아이디가 보이면 완료',
        detail: '계정 메뉴에 본인 GitHub 아이디가 표시되면 정상 연결된 상태예요.',
        img: '/images/guide/week1/step-0-4-github-loggedin.png',
      },
      {
        num: '0-5',
        color: '#6366f1',
        title: 'Source Control 패널 확인',
        desc: 'Ctrl+Shift+G → Source Control 패널 열기 → GRAPH 영역 확인',
        detail: '하단에 GRAPH 섹션이 보이면 GitLens가 정상 설치된 것입니다.',
        img: '/images/guide/week1/step-0-5-source-control-panel.png',
      },
    ],
  },
  {
    id: 'repo',
    label: '리포 생성 & 첫 Push',
    labelColor: '#4f46e5',
    badge: '수업 중 실습',
    desc: '새 폴더를 만들고 GitHub 리포를 생성해 첫 번째 커밋을 올려봐요.',
    steps: [
      {
        num: '1',
        color: '#4f46e5',
        title: '새 폴더 생성 → VSCode로 열기',
        desc: '바탕화면 우클릭 → 새 폴더 → 폴더 우클릭 → "Code로 열기"',
        detail: '폴더 이름은 영문 소문자 + 하이픈만 사용하세요. (예: vibe-coding-minihome)',
        img: '/images/guide/week1/step-1-new-folder-vscode.png',
        tip: '폴더 이름에 한글·공백·특수문자가 있으면 나중에 오류납니다. 영문 소문자만!',
      },
      {
        num: '2',
        color: '#4f46e5',
        title: '파일 하나 만들기',
        desc: 'Explorer(왼쪽 파일 탐색기) → 상단 New File 아이콘 → "readme.md"',
        detail: 'Git은 빈 폴더를 추적하지 않아요. 파일이 하나라도 있어야 커밋이 가능합니다.',
        img: '/images/guide/week1/step-2-create-file.png',
      },
      {
        num: '3',
        color: '#4f46e5',
        title: 'Repository 초기화',
        desc: 'Ctrl+Shift+G → "Initialize Repository" 버튼 클릭',
        detail: '"Publish to GitHub" 버튼도 보이지만 아직 클릭하지 마세요. Initialize 먼저!',
        img: '/images/guide/week1/step-3-init-repository.png',
        warning: '"Publish to GitHub" 버튼은 아직 클릭 금지. Initialize Repository 먼저 눌러야 합니다.',
      },
      {
        num: '4',
        color: '#4f46e5',
        title: '커밋 메시지 입력 → Commit',
        desc: '메시지 박스에 "첫커밋" 입력 → Commit 버튼 클릭 → 팝업에서 Yes',
        detail: '"There are no staged changes" 팝업이 뜨면 Yes 클릭. 자동으로 스테이징 + 커밋됩니다.',
        img: '/images/guide/week1/step-4-commit-popup.png',
        tip: 'COMMIT_EDITMSG 파일이 열리면 당황하지 말고 탭 오른쪽 X를 눌러 닫으세요. 그 다음 메시지 박스에 직접 입력하면 됩니다.',
      },
      {
        num: '4-1',
        color: '#4f46e5',
        title: 'Staged Changes 확인 → Commit 완료',
        desc: '"Staged Changes"에 파일이 보이고 메시지가 입력됐으면 Commit 클릭',
        detail: 'GRAPH 아래에 커밋이 생기면 로컬 커밋 완료.',
        img: '/images/guide/week1/step-4-2-staged-commit.png',
      },
      {
        num: '5',
        color: '#10b981',
        title: '"Publish Branch" 클릭',
        desc: '커밋 완료 후 나타나는 파란 "Publish Branch" 버튼 클릭',
        detail: '이 버튼이 GitHub 리포 생성의 핵심! 커밋 후에만 나타납니다.',
        img: '/images/guide/week1/step-5-publish-branch.png',
      },
      {
        num: '5-1',
        color: '#10b981',
        title: 'Public 리포 선택',
        desc: '"Publish to GitHub public repository" 선택',
        detail: 'Public을 선택하면 누구나 볼 수 있는 공개 리포가 생성됩니다.',
        img: '/images/guide/week1/step-5-1-publish-public.png',
      },
      {
        num: '5-2',
        color: '#10b981',
        title: '업로드 성공!',
        desc: '"Successfully published" 알림 확인 → "Open on GitHub" 클릭',
        detail: '우측 하단에 성공 알림이 뜨면 GitHub 리포 생성 완료!',
        img: '/images/guide/week1/step-5-2-publish-success.png',
      },
      {
        num: '5-3',
        color: '#10b981',
        title: 'GitHub.com에서 확인',
        desc: '"Open on GitHub" → 브라우저에서 리포 확인',
        detail: 'github.com/내아이디/vibe-coding-minihome 으로 접속되면 완료!',
        img: '/images/guide/week1/step-5-3-github-web.png',
      },
      {
        num: '5-4',
        color: '#10b981',
        title: '추가 파일 만들기 → 두 번째 커밋',
        desc: '새 파일 만들기 → 내용 수정 → Ctrl+Shift+G → 메시지 입력 → Commit',
        detail: '이제부터는 이 과정을 반복하면 됩니다. 매 작업 후 커밋!',
        img: '/images/guide/week1/step-5-4-new-file-commit.png',
      },
      {
        num: '5-5',
        color: '#10b981',
        title: 'Push — GitHub에 업로드',
        desc: 'Commit 후 GRAPH 위 ↑ 아이콘 클릭 → GitHub에 반영',
        detail: '↑ 화살표 아이콘이 생기면 push 대기 중. 클릭하면 GitHub에 업로드됩니다.',
        img: '/images/guide/week1/step-5-5-second-commit-push.png',
        tip: '커밋 = 로컬 저장. Push = GitHub 업로드. 둘 다 해야 GitHub에 반영돼요!',
      },
    ],
  },
];

export default function GitHubGuide({ isAdmin = false }) {
  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div>
          <h2 className={s.title}>Chapter 1 — GitHub 리포 생성</h2>
          <p className={s.subtitle}>
            {isAdmin
              ? '교안 모드 — 스크린샷 포함 전체 가이드'
              : '수업 전 Extension 설치만 완료해두세요. 나머지는 수업 중 함께 합니다.'}
          </p>
        </div>
        {isAdmin && (
          <span className={s.adminBadge}>교안 모드</span>
        )}
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
                  {/* 세로 연결선 */}
                  <div className={s.stepLine} />
                </div>

                <div className={s.stepBody}>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepDesc}>{step.desc}</p>
                  <p className={s.stepDetail}>{step.detail}</p>

                  {/* 이미지: admin만 */}
                  {isAdmin && (
                    <div className={s.imgWrap}>
                      <img
                        src={step.img}
                        alt={step.title}
                        className={s.stepImg}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {step.tip && (
                    <div className={s.tipBox}>
                      <span className={s.tipIcon}>TIP</span>
                      {step.tip}
                    </div>
                  )}
                  {step.warning && (
                    <div className={s.warnBox}>
                      <span className={s.warnIcon}>주의</span>
                      {step.warning}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!isAdmin && (
        <div className={s.previewNote}>
          스크린샷 가이드는 수업 당일 운영자 화면으로 함께 확인합니다.
        </div>
      )}
    </div>
  );
}
