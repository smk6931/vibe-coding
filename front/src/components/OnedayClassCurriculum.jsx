import { Link } from 'react-router-dom';

const TIMELINE = [
  {
    time: '0:00 – 0:20',
    label: '환경 세팅',
    color: 'bg-brand-600',
    title: 'VSCode + Claude Extension 설치',
    desc: '노트북만 들고 오세요. 같이 설치합니다.',
    items: [
      'VSCode 공식 홈페이지에서 .exe 다운로드 → 설치 (PATH 추가 옵션 체크)',
      'Node.js LTS 버전 설치 (nodejs.org)',
      'VSCode Extensions → "Claude for VS Code" 검색 → Install',
      'Claude 계정 로그인 (없으면 현장 회원가입)',
    ],
    tip: '설치가 미리 되어 있으면 더 좋지만, 현장에서도 충분히 완료할 수 있어요.',
    adminNote: '입장 시 빠르게 설치 여부 확인. VSCode PATH 옵션 체크 자주 놓침 → 재설치 필요 경우 있음. Node.js 설치 후 PC 재시작 요구하는 경우 많으니 미리 안내.',
  },
  {
    time: '0:20 – 0:40',
    label: '첫 프롬프트',
    color: 'bg-indigo-500',
    title: '바이브코딩이란? + 첫 프롬프트 작성',
    desc: '코드를 외우지 않아도 됩니다. Claude한테 말로 설명하면 됩니다.',
    items: [
      '바이브코딩 개념 소개 — "AI한테 지시해서 만드는 코딩"',
      '첫 프롬프트 복사해서 Claude에 붙여넣기',
      'React 프로젝트 생성 명령어 → 터미널에 Ctrl+V → Enter',
      '브라우저에 localhost:3000 열어서 첫 화면 확인',
    ],
    tip: '터미널 명령어를 외울 필요 없습니다. Claude가 "이걸 터미널에 붙여넣어" 하고 알려줘요.',
    adminNote: '가장 중요한 멘탈 전환 구간. "코드를 아는 게 목표가 아니라 AI에게 잘 설명하는 게 목표"를 반복 강조. 첫 화면이 뜨는 순간 수강생들이 가장 들뜸 → 그 에너지 놓치지 말 것.',
    prompt: `나는 코딩을 전혀 모르는 완전 초보자야.\n지금 VSCode를 열었고 오른쪽에 Claude 채팅이 있어.\n\nReact로 [만들고 싶은 것] 웹사이트를 처음부터 만들어줘.\n단계마다 터미널에 붙여넣을 명령어랑 다음에 뭘 해야 하는지 알려줘.\n모르는 용어는 쉽게 설명해줘.`,
  },
  {
    time: '0:40 – 1:30',
    label: '라이브 제작',
    color: 'bg-amber-500',
    title: '내 첫 웹페이지 1장 만들기 (Claude와 함께 라이브)',
    desc: '운영자 화면을 보면서 따라 만드세요. 막히면 바로 옆에서 봐드립니다.',
    items: [
      '포트폴리오 / 소개 페이지 중 원하는 것 선택',
      'Claude에 "이런 디자인으로 만들어줘" 요청 → 코드 받기',
      '파일 열고 전체 선택(Ctrl+A) → 붙여넣기(Ctrl+V) → 저장(Ctrl+S)',
      '브라우저 새로고침 → 확인 → 마음에 안 들면 "이 부분 바꿔줘" 요청',
      '반복하면서 내 페이지 완성',
    ],
    tip: '한 번에 하나씩만 바꾸세요. 한꺼번에 많이 요청하면 오류 추적이 어려워요.',
    adminNote: '가장 긴 블록. 수강생마다 진도가 갈리기 시작함. 빠른 사람한테는 "기능 하나 더 추가해보세요" 미션 주기. 느린 사람은 1:1 집중. 1:00 지점에 전체 상태 체크 권장.',
  },
  {
    time: '1:30 – 1:50',
    label: '배포',
    color: 'bg-emerald-600',
    title: 'GitHub 업로드 + Vercel 배포 (내 URL 생성)',
    desc: '끝나면 실제 인터넷 주소가 생깁니다. 지인에게 바로 공유 가능해요.',
    items: [
      'GitHub 계정 만들기 (없으면 현장)',
      'Claude에 "GitHub에 올리고 Vercel로 배포하는 법 알려줘" 요청',
      'Vercel 계정 연동 → 프로젝트 선택 → Deploy 클릭',
      '내 도메인 URL 확인 (예: my-project.vercel.app)',
    ],
    tip: '카카오톡에 링크 공유 → 폰으로 확인 → 완성!',
    adminNote: 'Vercel 첫 배포는 GitHub 연동 단계에서 막히는 사람 많음. git init → commit → push 순서 Claude에게 맡기면 됨. 배포 URL이 나오는 순간이 클라이맥스 — 폰으로 바로 확인하도록 유도.',
  },
  {
    time: '1:50 – 2:00',
    label: '마무리',
    color: 'bg-slate-600',
    title: '결과물 발표 + 다음 단계 안내',
    desc: '짧게 한 마디씩. 잘 안 됐어도 괜찮아요.',
    items: [
      '한 명씩 화면 보여주며 한 마디 (강요 아님)',
      '다음 모임 일정 안내',
      '카카오 오픈채팅방 초대 → 이후 질문·피드백 채널',
      '오늘 쓴 프롬프트 모음 공유 (Notion 링크)',
    ],
    tip: '"구경하러 왔어요"도 충분합니다. 다음 번엔 더 만들 수 있어요.',
    adminNote: '발표는 자원자 먼저. 분위기가 좋으면 비자원자도 유도. 오픈채팅 링크 QR로 보여주기. "다음 회차 일정" 언급하며 자연스럽게 리텐션 유도.',
  },
];

const STEP_IDS = TIMELINE.map((_, i) => `curriculum-step-${i + 1}`);

const PROMPTS = [
  {
    label: '다음 단계를 모를 때',
    code: '방금 [한 것] 했어. 다음에 뭘 해야 해?\n터미널 명령어가 있으면 복사할 수 있게 알려줘.',
  },
  {
    label: '오류가 났을 때',
    code: '아래 오류가 났어. 왜 이런 건지 쉽게 설명해주고\n수정 방법이랑 수정된 전체 코드 보여줘.\n\n[오류 메시지 붙여넣기]',
  },
  {
    label: '기능 추가하고 싶을 때',
    code: '지금 웹사이트에 [추가하고 싶은 기능]을 추가하고 싶어.\n설치할 게 있으면 터미널 명령어도 같이 알려주고\n수정할 파일이랑 전체 코드 보여줘.',
  },
  {
    label: '완전히 막혔을 때',
    code: '나는 코딩 초보야. 지금 [상황]인데 어떻게 해야 할지 모르겠어.\n뭘 해야 하는지 순서대로 알려줘. 터미널 명령어 있으면 복사할 수 있게.\n모르는 용어는 쉽게 설명해줘.',
  },
];

const PREP = [
  { icon: '💻', t: '노트북 지참 필수', d: 'Windows / Mac 모두 OK. 충전기도 가져오세요.' },
  { icon: '🌐', t: '인터넷 연결 확인', d: '와이파이가 제공되지만 LTE 핫스팟 백업 추천.' },
  { icon: '👤', t: 'Anthropic 계정', d: 'claude.ai 가입 (무료 플랜 OK). 미리 해두면 시간 절약.' },
  { icon: '💾', t: 'GitHub 계정', d: 'github.com 가입 (무료). 현장에서도 OK.' },
];

/* ══════════════════════════════════════════
   메인 export
══════════════════════════════════════════ */
export default function OnedayClassCurriculum({ kakaoUrl, isAdmin = false }) {
  if (!isAdmin) return <PrologueView kakaoUrl={kakaoUrl} />;
  return <AdminView kakaoUrl={kakaoUrl} />;
}

/* ── 일반 유저: 심플 prologue ── */
function PrologueView({ kakaoUrl }) {
  return (
    <div className="mt-8 space-y-6">
      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">2시간 커리큘럼</h2>
        <p className="mt-1 text-[13px] text-slate-500">코드 한 줄 몰라도 됩니다. Claude가 다 알려줘요.</p>
      </div>

      <div className="space-y-2">
        {TIMELINE.map((step, i) => (
          <div key={i} className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className={`w-7 h-7 rounded-full ${step.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[13px] sm:text-[14px] text-slate-900">{step.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${step.color}`}>{step.label}</span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
            </div>
            <span className="text-[11px] font-mono text-slate-300 shrink-0 pt-0.5">{step.time}</span>
          </div>
        ))}
      </div>

      <PrepSection />
      <CTASection kakaoUrl={kakaoUrl} />
      <CommunitySection />
    </div>
  );
}

/* ── 어드민: 풀폭 교안 뷰 ── */
function AdminView({ kakaoUrl }) {
  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">2시간 커리큘럼</h2>
          <p className="text-[13px] text-slate-500 mt-0.5">교안 모드 — 타임라인 상세 + 운영 노트가 보입니다.</p>
        </div>
        <span className="shrink-0 text-[10px] bg-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-full border border-rose-200">
          교안 모드
        </span>
      </div>

      {/* 모바일 목차 */}
      <div className="lg:hidden mb-6">
        <MobileTOC />
      </div>

      {/* 데스크탑: 사이드바 TOC + 콘텐츠 */}
      <div className="lg:grid lg:grid-cols-[176px_1fr] lg:gap-10 lg:items-start">

        {/* 데스크탑 sticky TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-[72px]">
            <DesktopTOC />
          </div>
        </aside>

        {/* 콘텐츠 */}
        <div className="space-y-10">
          <FullTimeline />
          <div id="curriculum-prep"><PrepSection /></div>
          <div id="curriculum-prompts"><PromptsSection /></div>
          <CTASection kakaoUrl={kakaoUrl} />
          <CommunitySection />
        </div>
      </div>
    </div>
  );
}

/* ── 모바일 TOC: 가로 스크롤 칩 ── */
function MobileTOC() {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">목차</p>
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 w-max">
          {TIMELINE.map((step, i) => (
            <a
              key={i}
              href={`#${STEP_IDS[i]}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 bg-white text-[12px] font-medium text-slate-700 whitespace-nowrap hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              <span className={`w-4 h-4 rounded-full ${step.color} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                {i + 1}
              </span>
              {step.label}
              <span className="text-[10px] font-mono text-slate-300">{step.time.split('–')[0].trim()}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 데스크탑 TOC 사이드바 ── */
function DesktopTOC() {
  return (
    <nav>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">목차</p>
      <div className="space-y-0.5">
        {TIMELINE.map((step, i) => (
          <a
            key={i}
            href={`#${STEP_IDS[i]}`}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-[12px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
          >
            <span className={`w-5 h-5 rounded-full ${step.color} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
              {i + 1}
            </span>
            <span className="flex-1 leading-snug">{step.label}</span>
            <span className="text-[10px] font-mono text-slate-300 group-hover:text-slate-400">
              {step.time.split('–')[0].trim()}
            </span>
          </a>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-0.5">
        <a href="#curriculum-prep"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-[12px] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          준비물
        </a>
        <a href="#curriculum-prompts"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-[12px] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          프롬프트 모음
        </a>
      </div>
    </nav>
  );
}

/* ── 상세 타임라인 (어드민용) ── */
function FullTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200" aria-hidden />
      <ol className="space-y-6">
        {TIMELINE.map((step, i) => (
          <li
            key={i}
            id={STEP_IDS[i]}
            className="flex gap-3 sm:gap-4 scroll-mt-[80px]"
          >
            <div className="shrink-0 w-10 flex flex-col items-center pt-1">
              <div className={`w-5 h-5 rounded-full ${step.color} flex items-center justify-center text-white text-[10px] font-bold z-10`}>
                {i + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0 card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white mb-1 ${step.color}`}>
                    {step.label}
                  </span>
                  <h3 className="font-bold text-[14px] sm:text-[15px] text-slate-900 leading-snug">{step.title}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">{step.time}</span>
              </div>

              <p className="text-[12px] sm:text-[13px] text-slate-600 mb-3">{step.desc}</p>

              <ul className="space-y-1.5">
                {step.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-[12px] sm:text-[13px] text-slate-700">
                    <span className="text-slate-300 shrink-0 mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {step.tip && (
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-[11px] sm:text-[12px] text-amber-800">
                  {step.tip}
                </div>
              )}

              {step.prompt && (
                <div className="mt-3">
                  <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">첫 프롬프트 예시</div>
                  <pre className="bg-slate-900 text-emerald-400 rounded-lg p-3 text-[11px] sm:text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {step.prompt}
                  </pre>
                </div>
              )}

              {step.adminNote && (
                <div className="mt-3 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
                  <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">교안 노트</div>
                  <p className="text-[11px] sm:text-[12px] text-rose-800 leading-relaxed">{step.adminNote}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── 준비물 ── */
function PrepSection() {
  return (
    <div>
      <h3 className="font-bold text-[14px] text-slate-800 mb-3">준비물</h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {PREP.map((p, i) => (
          <div key={i} className="card p-3 flex gap-2.5 items-start">
            <span className="text-lg shrink-0">{p.icon}</span>
            <div>
              <div className="font-semibold text-[12px] sm:text-[13px] text-slate-800">{p.t}</div>
              <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{p.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 프롬프트 모음 (어드민용) ── */
function PromptsSection() {
  return (
    <div>
      <h3 className="font-bold text-[14px] text-slate-800 mb-3">현장에서 쓸 프롬프트 모음</h3>
      <div className="space-y-2.5">
        {PROMPTS.map((p, i) => (
          <details key={i} className="card">
            <summary className="p-3 sm:p-4 cursor-pointer font-medium text-[13px] text-slate-800 flex items-center justify-between">
              <span>{p.label}</span>
              <span className="text-slate-400 text-xs">펼치기</span>
            </summary>
            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
              <pre className="bg-slate-900 text-emerald-400 rounded-lg p-3 text-[11px] sm:text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {p.code}
              </pre>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

/* ── 신청 CTA ── */
function CTASection({ kakaoUrl }) {
  return (
    <div className="rounded-2xl bg-brand-600 text-white p-5 sm:p-6 text-center">
      <h3 className="font-bold text-[15px] sm:text-lg">자리가 얼마 안 남았어요</h3>
      <p className="text-brand-100 text-[12px] sm:text-[13px] mt-1">정원 6명 소규모. 운영자가 1:1로 봐드립니다.</p>
      <a href={kakaoUrl} target="_blank" rel="noreferrer"
        className="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl bg-white text-brand-700 font-semibold text-[13px] sm:text-sm hover:bg-brand-50 transition-colors">
        카톡으로 신청하기 →
      </a>
    </div>
  );
}

/* ── 커뮤니티 링크 ── */
function CommunitySection() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 text-center">
      <p className="text-[12px] sm:text-[13px] text-slate-500 mb-3">2시간 만에 이런 걸 만들 수 있어요</p>
      <Link to="/community"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-[13px] sm:text-sm hover:bg-slate-700 transition-colors">
        2시간 완성 배포 웹페이지 보러가기 →
      </Link>
    </div>
  );
}
