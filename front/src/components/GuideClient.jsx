
import { useState } from 'react';
import MiniHompy from '../pages/guide/oneday/components/MiniHompy';

const STEPS_COMMON = [
  {
    id: 'github',
    title: '1단계 — GitHub 계정 만들기',
    desc: '코드를 저장하고 공유하는 공간입니다. 수업에서 만든 프로젝트를 여기에 보관합니다.',
    items: [
      'Sign up 버튼 클릭',
      '이메일 · 비밀번호 · 사용자명 입력',
      '이메일 인증 완료',
    ],
    links: [
      { text: 'GitHub 가입하기 →', href: 'https://github.com/signup' },
    ],
  },
  {
    id: 'vscode',
    title: '2단계 — VSCode 설치',
    desc: '코드 에디터입니다. 수업의 모든 코딩은 VSCode에서 진행합니다.',
    items: [
      'Download for Windows 버튼 클릭 (파란색 큰 버튼)',
      '다운로드된 VSCodeSetup-x64-x.xx.x.exe 실행',
      '설치 중 아래 두 항목 반드시 체크:',
      '"PATH에 추가 (재시작 후 사용 가능)"',
      '"Code로 열기" 작업을 Windows 탐색기 파일 상황에 맞는 메뉴에 추가',
      'Install 클릭 후 설치 완료',
    ],
    links: [
      { text: 'VSCode 다운로드 →', href: 'https://code.visualstudio.com' },
    ],
  },
  {
    id: 'nodejs',
    title: '3단계 — Node.js 설치',
    desc: 'JavaScript 실행 환경입니다. 프로젝트를 로컬에서 실행하는 데 필요합니다.',
    items: [
      'LTS 버전 다운로드 클릭 (안정 버전)',
      '모든 옵션 기본값 유지 → Next → Next → Install',
      '설치 완료 후 PC 재시작 권장',
    ],
    visual: 'node-version-screenshot',
    links: [
      { text: 'Node.js LTS 다운로드 →', href: 'https://nodejs.org/ko/download' },
    ],
    note: '버전 숫자 대신 오류가 나오면 PC 재시작 후 다시 시도하세요.',
  },
];

const STEPS_CLAUDE_EXT = {
  id: 'ext',
  title: '4단계 — Claude Code 설치 & 채팅 시작',
  desc: 'VSCode Extensions에서 Claude Code를 설치하고 채팅창까지 여는 전체 흐름입니다. Codex(OpenAI)로도 동일하게 진행할 수 있습니다.',
  extName: 'Claude Code for VS Code',
  extSearch: 'claude code',
  tabName: 'CLAUDE CODE',
};

const STEPS_CODEX_EXT = {
  id: 'ext',
  title: '4단계 — Codex 설치 & 채팅 시작',
  desc: 'VSCode Extensions에서 Codex를 설치하고 채팅창까지 여는 전체 흐름입니다.',
  extName: 'Codex — OpenAI',
  extSearch: 'codex',
  tabName: 'CODEX',
  links: [
    { text: 'Codex Extension →', href: 'https://marketplace.visualstudio.com/items?itemName=openai.codex' },
  ],
};

const STEPS_CLAUDE = [
  {
    id: 'vibe-start',
    title: '5단계 — 바이브 코딩 시작',
    desc: '빈 폴더 하나만 있으면 됩니다. AI에게 원하는 걸 말하면 코드가 만들어집니다.',
    visual: 'vibe-start-screenshot',
    loginHint: 'claude',
    items: [
      '탐색기에서 빈 폴더 하나 만들기 (예: C:\\GitHub\\test)',
      'VSCode → 파일 → 폴더 열기 → 방금 만든 폴더 선택',
      '오른쪽 CLAUDE CODE 채팅창에 처음 열면 Sign In 버튼 → claude.ai 계정으로 로그인',
      '로그인 후 아래처럼 원하는 프로젝트 설명을 채팅창에 붙여넣기',
    ],
    prompt: '/c/GitHub/test 폴더에 Vite + React로 싸이월드 감성 미니 홈피 웹페이지 만들어줘. 이름은 "홍길동", 한마디는 "오늘도 바이브코딩 중", 방문자수 카운터, 좋아하는 것 3가지 카드, 다이어리 한 줄 메모 섹션 넣어줘. 배경은 반짝이는 별 파티클 효과, 전체 색감은 보라+핑크 그라데이션, 귀여운 폰트로 Y2K 감성 살려줘. 다 만들면 npm run dev로 실행까지 해줘.',
    links: [
      { text: 'claude.ai 회원가입 →', href: 'https://claude.ai' },
      { text: 'Codex 회원가입 →', href: 'https://platform.openai.com/signup', secondary: true },
    ],
    note: '무료 플랜은 하루 사용량 제한이 있습니다. 수업 당일 집중적으로 사용할 예정이라면 Pro 플랜($20/월) 가입을 권장합니다.',
  },
];

const STEPS_CODEX = [
  {
    id: 'vibe-start',
    title: '5단계 — 바이브 코딩 시작',
    desc: '빈 폴더 하나만 있으면 됩니다. AI에게 원하는 걸 말하면 코드가 만들어집니다.',
    visual: 'vibe-start-screenshot',
    loginHint: 'codex',
    items: [
      '탐색기에서 빈 폴더 하나 만들기 (예: C:\\GitHub\\test)',
      'VSCode → 파일 → 폴더 열기 → 방금 만든 폴더 선택',
      '오른쪽 CODEX 채팅창에 처음 열면 Sign In 버튼 → OpenAI 계정으로 로그인',
      '로그인 후 아래처럼 원하는 프로젝트 설명을 채팅창에 붙여넣기',
    ],
    prompt: '/c/GitHub/test 폴더에 Vite + React로 싸이월드 감성 미니 홈피 웹페이지 만들어줘. 이름은 "홍길동", 한마디는 "오늘도 바이브코딩 중", 방문자수 카운터, 좋아하는 것 3가지 카드, 다이어리 한 줄 메모 섹션 넣어줘. 배경은 반짝이는 별 파티클 효과, 전체 색감은 보라+핑크 그라데이션, 귀여운 폰트로 Y2K 감성 살려줘. 다 만들면 npm run dev로 실행까지 해줘.',
    links: [
      { text: 'OpenAI 회원가입 →', href: 'https://platform.openai.com/signup' },
    ],
    note: 'Codex는 OpenAI 계정이 필요합니다. 무료 체험 크레딧이 제공됩니다.',
  },
];

export default function GuideClient() {
  const [tool, setTool] = useState('claude');
  const [openIds, setOpenIds] = useState(new Set());

  const extStep = tool === 'claude' ? STEPS_CLAUDE_EXT : STEPS_CODEX_EXT;
  const loginSteps = tool === 'claude' ? STEPS_CLAUDE : STEPS_CODEX;
  const allSteps = [
    ...STEPS_COMMON,
    { ...extStep, visual: 'vscode-ext-real' },
    ...loginSteps,
  ];

  function toggle(id) {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setOpenIds(new Set(allSteps.map(s => s.id)));
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-2">원데이 클래스 필수</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">수업 전 사전 준비</h1>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          수업 당일 바로 코딩을 시작할 수 있도록 아래 5단계를 미리 완료해주세요.<br />
          설치에 보통 <strong className="text-slate-700">20~30분</strong> 걸립니다.
        </p>
      </div>

      {/* AI 도구 탭 */}
      <div className="mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI 도구 선택</p>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTool('claude')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tool === 'claude'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Claude Code
          </button>
          <button
            onClick={() => setTool('codex')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tool === 'codex'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Codex (OpenAI)
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5 text-center">
          {tool === 'claude'
            ? 'claude.ai 계정 필요 · 무료 플랜 있음 · 4단계 설치 방법이 바뀝니다'
            : 'OpenAI 계정 필요 · 무료 크레딧 제공 · 4단계 설치 방법이 바뀝니다'}
        </p>
      </div>

      {/* 모두 펼치기 */}
      <div className="flex justify-end mb-3">
        <button onClick={expandAll} className="text-[12px] text-brand-600 hover:text-brand-800 font-medium">
          모두 펼치기
        </button>
      </div>

      {/* 단계 목록 */}
      <div className="space-y-3">
        {allSteps.map((step, idx) => (
          <StepCard
            key={step.id + tool}
            step={step}
            index={idx + 1}
            isOpen={openIds.has(step.id)}
            onToggle={() => toggle(step.id)}
            tool={tool}
          />
        ))}
      </div>

      {/* 완료 안내 */}
      <div className="mt-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
        <p className="text-sm font-semibold text-emerald-800">모두 완료했나요?</p>
        <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
          수업 당일 VSCode를 열고 AI 채팅이 작동하는지 한 번 더 확인해오시면 됩니다.
          문제가 생기면 수업 시작 전 10분 일찍 오시면 함께 해결해드립니다.
        </p>
      </div>
    </div>
  );
}

function StepCard({ step, index, isOpen, onToggle, tool }) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {index}
        </span>
        <span className="flex-1 font-semibold text-sm text-slate-900 leading-snug">{step.title}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          <p className="text-sm text-slate-600 mb-3">{step.desc}</p>

          {step.links && step.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {step.links.map(link => (
                link.secondary ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-[11px] font-medium hover:bg-slate-200 hover:text-slate-500 transition-colors border border-slate-200"
                    onClick={e => e.stopPropagation()}
                  >
                    {link.text}
                  </a>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3.5 py-2 rounded-xl bg-brand-600 text-white text-[13px] font-semibold hover:bg-brand-700 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    {link.text}
                  </a>
                )
              ))}
            </div>
          )}

          {/* 일반 items 목록 */}
          {step.items && step.items.length > 0 && (
            <ul className="space-y-2 mb-3">
              {step.items.map((item, i) =>
                typeof item === 'string' ? (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ) : (
                  <li key={i} className="my-2">
                    <code className="block bg-slate-900 text-emerald-400 rounded-lg px-4 py-2.5 text-[13px] font-mono">
                      {item.code}
                    </code>
                  </li>
                )
              )}
            </ul>
          )}

          {/* 시각 자료 */}
          {step.visual === 'vscode-ext-real' && <VSCodeExtReal step={step} tool={tool} />}
          {step.visual === 'node-version-screenshot' && <NodeVersionScreenshot />}
          {step.visual === 'vibe-start-screenshot' && <VibeStartScreenshot step={step} />}

          {step.note && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-800 leading-relaxed">{step.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CLICK_STEPS_CLAUDE = [
  { num: 1, label: 'Extensions 아이콘 클릭', detail: '왼쪽 사이드바 퍼즐 조각 모양 (단축키: Ctrl+Shift+X)' },
  { num: 2, label: '검색창에 claude code 입력', detail: '"Claude Code for VS Code" (by Anthropic) 첫 번째 결과 클릭' },
  { num: 3, label: 'Install 클릭', detail: '확장 상세 페이지에서 Install 버튼 클릭 후 설치 완료 대기' },
  { num: 4, label: 'Toggle Secondary Sidebar 클릭', detail: '오른쪽 상단 세로 분할 패널 아이콘 클릭 (오른쪽에 새 패널이 열림)' },
  { num: 5, label: 'CLAUDE CODE 탭 클릭', detail: '오른쪽 패널 상단에 생긴 CLAUDE CODE 탭 클릭' },
  { num: 6, label: '채팅창에서 바이브 코딩 시작!', detail: '하단 입력창에 질문을 입력하면 AI가 바로 답합니다' },
];

const CLICK_STEPS_CODEX = [
  { num: 1, label: 'Extensions 아이콘 클릭', detail: '왼쪽 사이드바 퍼즐 조각 모양 (단축키: Ctrl+Shift+X)' },
  { num: 2, label: '검색창에 codex 입력', detail: '"Codex - OpenAI\'s coding agent" 첫 번째 결과 클릭' },
  { num: 3, label: 'Install 클릭', detail: '확장 상세 페이지에서 Install 버튼 클릭 후 설치 완료 대기' },
  { num: 4, label: 'Toggle Secondary Sidebar 클릭', detail: '오른쪽 상단 세로 분할 패널 아이콘 클릭 (오른쪽에 새 패널이 열림)' },
  { num: 5, label: 'CODEX 탭 클릭', detail: '오른쪽 패널 상단에 생긴 CODEX 탭 클릭' },
  { num: 6, label: '채팅창에서 코딩 시작!', detail: '하단 입력창에 질문을 입력하면 AI가 바로 답합니다' },
];

function VSCodeExtReal({ tool }) {
  const steps = tool === 'claude' ? CLICK_STEPS_CLAUDE : CLICK_STEPS_CODEX;

  return (
    <div className="mt-4">
      {/* 실제 VSCode 스크린샷 */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-md">
        <img
          src="/images/guide/vscode-claude-ext.png"
          alt="VSCode Claude Code Extension 설치 화면"
          className="w-full h-auto block"
          style={{ maxHeight: 480, objectFit: 'contain', background: '#1e1e1e' }}
        />
        {/* 이미지 위 안내 레이블 */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">
          실제 VSCode 화면 — 빨간 박스 위치를 순서대로 클릭하세요
        </div>
      </div>

      {/* 단계별 설명 */}
      <div className="mt-4 space-y-2">
        {steps.map(s => (
          <div key={s.num} className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {s.num}
            </span>
            <div>
              <p className="text-[13px] font-semibold text-slate-800">{s.label}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle Secondary Sidebar 위치 힌트 */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex gap-3 items-start">
        <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-[12px] text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Toggle Secondary Sidebar</strong> 버튼은 VSCode 오른쪽 상단 끝에 있는 세로 분할 아이콘입니다.
          위 스크린샷에서 빨간 박스로 표시된 우측 상단 버튼입니다.
        </p>
      </div>
    </div>
  );
}

function NodeVersionScreenshot() {
  return (
    <div className="mt-3">
      {/* 설치 확인 절차 설명 */}
      <div className="mb-3 space-y-2">
        <div className="flex gap-3 items-start">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
          <div>
            <p className="text-[13px] font-semibold text-slate-800">VSCode 실행 → 오른쪽 상단 터미널 토글 버튼 클릭</p>
            <p className="text-[12px] text-slate-500 mt-0.5">상단 우측 패널 아이콘(빨간 박스) 클릭 — 하단에 터미널 창이 열립니다</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
          <div>
            <p className="text-[13px] font-semibold text-slate-800">터미널 창에 아래 명령어 입력 후 Enter</p>
            <code className="block mt-1 bg-slate-900 text-emerald-400 rounded-lg px-4 py-2 text-[13px] font-mono">node --version</code>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
          <div>
            <p className="text-[13px] font-semibold text-slate-800">v24.x.x 같은 숫자가 나오면 설치 성공!</p>
            <p className="text-[12px] text-slate-500 mt-0.5">아래 스크린샷처럼 버전 번호가 출력되면 됩니다</p>
          </div>
        </div>
      </div>

      {/* 실제 스크린샷 */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-md">
        <img
          src="/images/guide/vscode-node-version.png"
          alt="VSCode 터미널에서 node --version 실행 결과"
          className="w-full h-auto block"
          style={{ maxHeight: 420, objectFit: 'contain', background: '#1e1e1e' }}
        />
        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">
          빨간 박스 ① 터미널 토글 버튼 → ② 터미널에 node --version 입력
        </div>
      </div>
    </div>
  );
}

function VibeStartScreenshot({ step }) {
  const [copied, setCopied] = useState(false);

  function copyPrompt() {
    navigator.clipboard.writeText(step.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-3 space-y-4">
      {/* 실제 스크린샷 */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-md">
        <img
          src="/images/guide/vscode-vibe-start.png"
          alt="빈 test 폴더에 Claude Code로 프로젝트 요청하는 VSCode 화면"
          className="w-full h-auto block"
          style={{ maxHeight: 460, objectFit: 'contain', background: '#1e1e1e' }}
        />
        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">
          빨간 박스 ① 빈 test 폴더 → ② 채팅창에 프롬프트 입력
        </div>
      </div>

      {/* 예시 프롬프트 복사 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">예시 프롬프트 — 복사해서 붙여넣기</p>
          <button
            onClick={copyPrompt}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
          >
            {copied ? '복사됨 ✓' : '복사하기'}
          </button>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 text-[12px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap border border-slate-700">
          {step.prompt}
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5">
          위 프롬프트는 예시입니다. 원하는 프로젝트 설명으로 자유롭게 바꿔보세요.
        </p>
      </div>

      {/* AI가 코드 생성하는 과정 스크린샷 */}
      <div>
        <p className="text-[12px] font-semibold text-slate-500 mb-2">
          AI가 프롬프트를 읽고 코드를 짜주는 모습
        </p>
        <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-md">
          <img
            src="/images/guide/vscode-ai-coding.png"
            alt="Claude Code가 프롬프트를 보고 코드를 자동으로 생성하는 VSCode 화면"
            className="w-full h-auto block"
            style={{ maxHeight: 460, objectFit: 'contain', background: '#1e1e1e' }}
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">
            ① 왼쪽: 파일이 자동 생성됨 &nbsp;|&nbsp; ② 오른쪽: AI 답변 + 기능 목록
          </div>
        </div>
      </div>

      {/* 실제 결과물 — 라이브 미니홈피 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[12px] font-semibold text-slate-600">완성 결과물 — 직접 써보세요</p>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">LIVE</span>
        </div>
        <MiniHompy />
      </div>

    </div>
  );
}
