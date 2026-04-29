import { useState } from 'react';
import { Link } from 'react-router-dom';
import GitHubGuide from './GitHubGuide';
import MiniHompyGuide from './MiniHompyGuide';
import VercelGuide from './VercelGuide';

const TIMELINE = [
  {
    time: '0:00 – 0:20',
    label: '환경 세팅',
    color: 'bg-brand-600',
    title: 'VSCode + Claude Code 설치',
    desc: '노트북만 들고 오세요. 같이 설치합니다.',
    items: [
      'VSCode 설치 (PATH 추가 + "Code로 열기" 옵션 체크)',
      'Node.js LTS 설치 → 터미널에서 node -v 확인',
      'Claude Code 설치 및 claude.ai 로그인',
      'VSCode 터미널(Ctrl+`) 열기 확인',
    ],
    tip: '미리 설치돼 있으면 더 좋지만, 현장에서도 충분히 완료할 수 있어요.',
    adminNote: '입장 시 설치 여부 빠르게 확인. Node.js 설치 후 재시작 요구하는 경우 많음. Claude Code는 VSCode Extension 또는 npm install -g @anthropic-ai/claude-code.',
  },
  {
    time: '0:20 – 0:35',
    label: '첫 프로젝트',
    color: 'bg-indigo-500',
    title: 'Claude로 React 프로젝트 생성',
    desc: '"만들어줘"라고 말하면 Claude가 명령어를 알려줍니다.',
    items: [
      '바이브코딩 개념 — "AI한테 말로 설명해서 만드는 코딩"',
      'Claude에 첫 프롬프트 → 터미널 명령어 받기',
      'npm create vite@latest my-hompy → npm install',
      'npm run dev → 브라우저 localhost:5173 첫 화면 확인',
    ],
    tip: '터미널이 무서우면 Claude한테 "터미널이 뭔지 모르겠어"라고 그냥 말해보세요.',
    adminNote: 'localhost:5173이 뜨는 순간 첫 환호. 이 에너지를 다음 단계로 연결. Vite 기본 화면이 나오면 OK.',
    prompt: `나는 코딩 초보야. React로 미니홈피 웹사이트를 만들고 싶어.\n지금 VSCode 터미널이 열려 있어.\n프로젝트 만드는 명령어부터 순서대로 알려줘.\n명령어는 복사할 수 있게 코드블록으로.`,
  },
  {
    time: '0:35 – 0:55',
    label: '라우팅',
    color: 'bg-purple-500',
    title: '2페이지 구조 + 사이드바 만들기',
    desc: 'URL이 바뀌면 다른 화면이 보이는 원리. 사이드바 버튼으로 전환해봐요.',
    items: [
      'React Router 개념 — "URL 주소마다 다른 화면"',
      'Claude에 "홈 + 소개 2페이지, 사이드바 버튼" 요청',
      '홈(/) → 소개(/about) 버튼 클릭으로 URL 전환 확인',
      '두 페이지에 각각 간단한 텍스트 넣어보기',
    ],
    tip: '라우팅 = 앱처럼 페이지가 부드럽게 바뀌는 것. 코드 이해보다 동작 확인이 목표예요.',
    adminNote: 'React Router가 가장 헷갈리는 구간. "URL이 바뀌면 컴포넌트가 교체된다" 한 줄로 설명. 개념 설명에 5분 이상 쓰지 말 것.',
    prompt: `지금 React + Vite 프로젝트가 있어.\nReact Router를 써서 2페이지 구조를 만들어줘:\n- 홈 페이지 (/)\n- 소개 페이지 (/about)\n왼쪽에 사이드바 넣어서 두 페이지를 버튼으로 이동할 수 있게.\n설치할 게 있으면 명령어도 포함해줘.`,
  },
  {
    time: '0:55 – 1:25',
    label: '내 소개 만들기',
    color: 'bg-warm-500',
    title: '내 사진 → Claude → 자기소개 → 소개 페이지 완성',
    desc: '사진을 Claude 채팅창에 드래그하면 AI가 소개글을 써줘요. 그걸 내 페이지에 붙이면 끝.',
    items: [
      '내 사진 1장을 Claude 채팅창에 드래그 앤 드롭',
      '"이 사진 보고 내 소개 페이지 글 써줘" 요청',
      'Claude가 써준 이름·한 줄 소개·관심사를 About.jsx에 붙이기',
      '"이 분위기로 색상 꾸며줘" → 배경색·폰트 변경',
    ],
    tip: '사진 없어도 OK. "나는 [직업]이고 [관심사]야. 소개 페이지 글 써줘"로도 충분해요.',
    adminNote: '멀티모달 체험 핵심 구간. 사진 드래그 → Claude 응답 나오는 순간 반응이 제일 좋음. 결과물 복사해서 파일에 붙여넣는 것까지 1:1로 봐주기.',
    prompt: `[사진을 채팅창에 드래그 후]\n이 사진을 보고 내 소개 페이지에 들어갈 글을 써줘.\n- 이름 (내 이름으로)\n- 한 줄 소개\n- 관심사 3가지\n- 짧은 자기소개 문단\nAbout.jsx에 바로 쓸 수 있게 JSX 코드로 줘.`,
  },
  {
    time: '1:25 – 1:45',
    label: '커밋 + 배포',
    color: 'bg-emerald-600',
    title: 'Git 첫 커밋 + Vercel 배포',
    desc: '코드를 저장하고 인터넷에 올려요. 끝나면 실제 URL이 생깁니다.',
    items: [
      'Claude한테 "Git 커밋하고 GitHub에 올리는 법" 요청',
      'git init → git add . → git commit -m "1주차 완성"',
      'GitHub 리포지토리 만들고 push',
      'Vercel 접속 → GitHub 연동 → Deploy → 내 URL 확인',
    ],
    tip: 'git commit = 코드 스냅샷 찍기. "아 그때 코드 어땠지?" 나중에 돌아볼 수 있어요.',
    adminNote: 'git push에서 personal access token 오류 자주 발생 → Claude한테 오류 메시지 붙여넣으라고 안내. Vercel은 GitHub 연동 후 클릭 2번이면 배포 완료.',
  },
  {
    time: '1:45 – 2:00',
    label: '마무리',
    color: 'bg-slate-600',
    title: 'URL 공유 + 2주차 예고',
    desc: '내가 만든 페이지 URL을 카톡으로 공유해봐요.',
    items: [
      '본인 Vercel URL을 카카오 오픈채팅에 공유',
      '소감 한 마디 (자원자 먼저, 강요 금지)',
      '2주차 예고: 방문자카운터 + 좋아하는 것 카드 + localStorage',
      '오픈채팅방 QR 코드 공유',
    ],
    tip: '"완성 못 했어도 괜찮아요. 오늘 처음 만든 거잖아요."',
    adminNote: '배포 URL 못 받은 사람은 GitHub Pages 대안 안내. 소감은 자원자만. 2주차 기대감 올리는 것이 마무리의 핵심.',
  },
];

const PROMPTS = [
  {
    label: '프로젝트 처음 만들 때',
    code: '나는 코딩 초보야. React로 미니홈피 웹사이트를 만들고 싶어.\n지금 VSCode 터미널이 열려 있어.\n프로젝트 만드는 명령어부터 순서대로 알려줘.\n명령어는 복사할 수 있게 코드블록으로.',
  },
  {
    label: '2페이지 + 사이드바 만들 때',
    code: '지금 React + Vite 프로젝트가 있어.\nReact Router로 2페이지 구조 만들어줘:\n- 홈 페이지 (/)\n- 소개 페이지 (/about)\n왼쪽 사이드바에 이동 버튼 넣어줘. 설치 명령어도 포함.',
  },
  {
    label: '사진으로 소개글 만들 때',
    code: '[사진을 Claude에 드래그 후]\n이 사진 보고 내 소개 페이지 글 써줘.\n- 이름, 한 줄 소개, 관심사 3가지, 자기소개 문단\nAbout.jsx에 바로 쓸 수 있게 JSX 코드로.',
  },
  {
    label: '오류가 났을 때',
    code: '아래 오류가 났어. 왜 이런지 쉽게 설명하고\n수정 방법이랑 수정된 전체 코드 보여줘.\n\n[오류 메시지 붙여넣기]',
  },
  {
    label: 'Git + 배포 모를 때',
    code: '지금 React 프로젝트를 GitHub에 올리고\nVercel로 배포해서 실제 URL 만들고 싶어.\n처음부터 순서대로 알려줘. 명령어는 복사 가능하게.',
  },
];

const PREP = [
  { icon: '💻', t: '노트북 지참 필수', d: 'Windows / Mac 모두 OK. 충전기도 가져오세요.' },
  { icon: '🌐', t: '인터넷 연결 확인', d: '와이파이 제공, LTE 핫스팟 백업 추천.' },
  { icon: '👤', t: 'claude.ai 계정', d: '무료 플랜 OK. 미리 가입하면 시간 절약.' },
  { icon: '💾', t: 'GitHub 계정', d: 'github.com 가입 (무료). 현장에서도 OK.' },
];

export default function OnedayClassCurriculum({ kakaoUrl, isAdmin = false }) {
  const [mode, setMode] = useState(isAdmin ? 'guide' : 'prologue');
  const isGuide = mode === 'guide';

  return (
    <div className="mt-8 space-y-6">
      <div className="border-t border-slate-100 pt-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">1주차 커리큘럼</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            {isGuide
              ? '교안 모드 — 타임라인 상세 + 운영 노트가 보입니다.'
              : '코드 한 줄 몰라도 됩니다. Claude가 다 알려줘요.'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setMode(isGuide ? 'prologue' : 'guide')}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
              isGuide
                ? 'bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-200'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isGuide ? '교안 모드' : '프롤로그'}
          </button>
        </div>
      </div>

      {isGuide ? <FullTimeline /> : <PrologueTimeline />}

      <PrepSection />

      <ChapterAccordion isAdmin={isGuide} />

      {isGuide && <PromptsSection />}

      <div className="rounded-2xl bg-brand-600 text-white p-5 sm:p-6 text-center">
        <h3 className="font-bold text-[15px] sm:text-lg">자리가 얼마 안 남았어요</h3>
        <p className="text-brand-100 text-[12px] sm:text-[13px] mt-1">정원 6명 소규모. 운영자가 1:1로 봐드립니다.</p>
        <a href={kakaoUrl} target="_blank" rel="noreferrer"
          className="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl bg-white text-brand-700 font-semibold text-[13px] sm:text-sm hover:bg-brand-50 transition-colors">
          카톡으로 신청하기 →
        </a>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 text-center">
        <p className="text-[12px] sm:text-[13px] text-slate-500 mb-3">수업 전 미리 환경 세팅해 오세요</p>
        <Link to="/guide/oneday/install"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-[13px] sm:text-sm hover:bg-slate-700 transition-colors">
          수업 전 준비 가이드 보기 →
        </Link>
      </div>
    </div>
  );
}

/* ── 일반 유저: 심플 타임라인 ── */
function PrologueTimeline() {
  return (
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
  );
}

/* ── 어드민: 상세 타임라인 + 교안 노트 ── */
function FullTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200" aria-hidden />
      <ol className="space-y-4">
        {TIMELINE.map((step, i) => (
          <li key={i} className="flex gap-3 sm:gap-4">
            <div className="shrink-0 w-10 flex flex-col items-center gap-0.5 pt-1">
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
              <p className="text-[12px] sm:text-[13px] text-slate-600 mb-2">{step.desc}</p>
              <ul className="space-y-1">
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
                  <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">프롬프트 예시</div>
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

function ChapterAccordion({ isAdmin }) {
  const [openSet, setOpenSet] = useState(new Set());

  const toggle = (id) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chapters = [
    {
      id: 'ch1',
      num: 1,
      title: 'GitHub 환경 세팅 + 첫 push',
      time: '0:00~0:35',
      steps: 11,
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50/40',
      desc: 'VS Code Source Control + GitLens + GitHub 로그인 → repo init → first commit → publish',
      Component: GitHubGuide,
    },
    {
      id: 'ch2',
      num: 2,
      title: '미니홈피 바이브 코딩 (5단계)',
      time: '0:35~1:45',
      steps: 5,
      color: 'from-pink-500 to-purple-500',
      bg: 'bg-pink-50/40',
      desc: 'Vite+React → Router → 사진 드래그 멀티모달 → 이미지 자산 → 반응형',
      Component: MiniHompyGuide,
    },
    {
      id: 'ch3',
      num: 3,
      title: 'Vercel 무료 배포 (10스텝)',
      time: '1:45~2:25',
      steps: 10,
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50/40',
      desc: 'Git 푸쉬 → AI 가이드 → Vercel 가입 → Import → Deploy → 도메인',
      Component: VercelGuide,
    },
  ];

  const allOpen = openSet.size === chapters.length;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="font-bold text-[14px] sm:text-[15px] text-slate-800">
          Chapter별 상세 가이드
        </h3>
        <button
          type="button"
          onClick={() => setOpenSet(allOpen ? new Set() : new Set(chapters.map(c => c.id)))}
          className="text-[11px] text-slate-500 hover:text-slate-800 underline-offset-2 hover:underline"
        >
          {allOpen ? '모두 접기' : '모두 펼치기'}
        </button>
      </div>

      {chapters.map(ch => {
        const open = openSet.has(ch.id);
        return (
          <div
            key={ch.id}
            className={`rounded-2xl border border-slate-200 overflow-hidden transition-shadow ${
              open ? 'shadow-sm' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(ch.id)}
              aria-expanded={open}
              className="w-full flex items-center gap-3 sm:gap-4 px-4 py-3.5 sm:px-5 sm:py-4 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              <span
                className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${ch.color} text-white flex flex-col items-center justify-center leading-none`}
              >
                <span className="text-[8.5px] font-semibold opacity-80 tracking-wider">CHAP</span>
                <span className="text-[16px] sm:text-[17px] font-bold">{ch.num}</span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-[13px] sm:text-[14px] text-slate-900">{ch.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{ch.time}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{ch.steps} steps</span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5 line-clamp-1">{ch.desc}</p>
              </div>
              <span className={`shrink-0 text-slate-400 text-sm transition-transform ${open ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            {open && (
              <div className={`px-4 sm:px-5 pt-2 pb-5 sm:pb-6 border-t border-slate-100 ${ch.bg}`}>
                <ch.Component isAdmin={isAdmin} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
