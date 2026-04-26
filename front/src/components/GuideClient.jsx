
import { useState } from 'react';

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
      'VSCode 실행 → 상단 메뉴 터미널 → 새 터미널 → 아래 입력:',
      { code: 'node --version' },
      'v22.x.x 같은 숫자가 나오면 성공',
    ],
    links: [
      { text: 'Node.js LTS 다운로드 →', href: 'https://nodejs.org/ko/download' },
    ],
    note: '숫자 대신 오류가 나오면 PC 재시작 후 다시 시도하세요.',
  },
];

const STEPS_CLAUDE = [
  {
    id: 'claude-ext',
    title: '4단계 — Claude Extension 설치',
    desc: 'VSCode 안에서 Claude AI를 채팅 패널로 바로 사용할 수 있게 됩니다.',
    items: [
      'VSCode 왼쪽 사이드바 Extensions 아이콘 클릭 (단축키: Ctrl+Shift+X)',
      '검색창에 claude 입력',
      '"Claude for VS Code — Anthropic" 공식 선택',
      'Install 클릭',
      '설치 완료 후 왼쪽 사이드바에 Claude 아이콘 생성됨',
    ],
    links: [
      { text: 'Claude Extension 설치 →', href: 'https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-vscode' },
    ],
  },
  {
    id: 'claude-login',
    title: '5단계 — 로그인 & 테스트',
    desc: 'claude.ai 계정으로 로그인하면 VSCode 안에서 AI 채팅이 바로 됩니다.',
    items: [
      'claude.ai 에서 계정 없으면 회원가입 먼저 진행',
      'VSCode 왼쪽 사이드바 Claude 아이콘 클릭',
      'Sign In 버튼 클릭',
      '브라우저가 자동으로 열리면 Anthropic 계정으로 로그인',
      'VSCode로 돌아오면 채팅 입력창 활성화 확인',
      '입력창에 아래 테스트 질문 입력:',
      { code: '안녕! 간단한 파이썬 Hello World 코드 짜줘' },
    ],
    links: [
      { text: 'claude.ai 회원가입 →', href: 'https://claude.ai' },
    ],
    note: '무료 플랜은 하루 사용량 제한이 있습니다. 수업 당일 집중적으로 사용할 예정이라면 Pro 플랜($20/월) 가입을 권장합니다.',
  },
];

const STEPS_CODEX = [
  {
    id: 'copilot-ext',
    title: '4단계 — GitHub Copilot 설치',
    desc: 'GitHub 계정으로 연결되는 AI 코딩 도우미입니다. Claude와 동일한 방식으로 VSCode 안에서 사용합니다.',
    items: [
      'VSCode 왼쪽 사이드바 Extensions 아이콘 클릭 (단축키: Ctrl+Shift+X)',
      '검색창에 github copilot 입력',
      '"GitHub Copilot" 선택 → Install',
      '"GitHub Copilot Chat" 도 함께 검색하여 설치 (채팅 기능)',
    ],
    links: [
      { text: 'GitHub Copilot 설치 →', href: 'https://marketplace.visualstudio.com/items?itemName=GitHub.copilot' },
      { text: 'Copilot Chat 설치 →', href: 'https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat' },
    ],
    note: '무료 플랜: 월 2,000회 자동완성 + 50회 채팅 제공. 수업 하루 사용은 무료로 충분합니다.',
  },
  {
    id: 'copilot-login',
    title: '5단계 — 로그인 & 테스트',
    desc: '1단계에서 만든 GitHub 계정으로 바로 로그인합니다.',
    items: [
      'VSCode 왼쪽 하단 계정 아이콘 클릭',
      '"Sign in to use GitHub Copilot" 클릭',
      '브라우저에서 GitHub 계정으로 로그인',
      'VSCode로 돌아오면 오른쪽 하단에 Copilot 아이콘 활성화 확인',
      'Ctrl + Shift + I 로 채팅 패널 열기',
      '입력창에 아래 테스트 질문 입력:',
      { code: 'Hello! Write a simple Python Hello World code' },
    ],
    links: [
      { text: 'GitHub 로그인 →', href: 'https://github.com/login' },
    ],
  },
];

export default function GuideClient() {
  const [tool, setTool] = useState('claude');
  const [openIds, setOpenIds] = useState(new Set());

  const toolSteps = tool === 'claude' ? STEPS_CLAUDE : STEPS_CODEX;
  const allSteps = [...STEPS_COMMON, ...toolSteps];

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
            Claude
          </button>
          <button
            onClick={() => setTool('codex')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tool === 'codex'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            GitHub Copilot
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5 text-center">
          {tool === 'claude'
            ? 'claude.ai 계정 필요 · 무료 플랜 있음'
            : 'GitHub 계정으로 바로 사용 · 무료 플랜 있음'}
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
            key={step.id}
            step={step}
            index={idx + 1}
            isOpen={openIds.has(step.id)}
            onToggle={() => toggle(step.id)}
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

function StepCard({ step, index, isOpen, onToggle }) {
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

          {/* 바로가기 링크 버튼 */}
          {step.links && step.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {step.links.map(link => (
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
              ))}
            </div>
          )}

          <ul className="space-y-2">
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
