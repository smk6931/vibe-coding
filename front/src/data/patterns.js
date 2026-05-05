/**
 * Frontend UX Patterns 카탈로그 메타.
 *
 * 원본: source/front-patterns-guide-main (37개 데모 React 앱).
 * 본 파일은 사이트(/info/front/patterns) 노출용 메타데이터만.
 * 라이브 데모 컴포넌트는 각 패턴 페이지(pages/info/front/patterns/...)에서
 * co-locate 또는 components/patterns/ 에서 import.
 */

export const TIERS = [
  {
    num: 1,
    slug: 'tier1',
    title: '정보 표현 / 기본 인터랙션',
    desc: '스켈레톤·토스트·모달·드로어 등 어느 앱에나 깔리는 기초 패턴',
    count: 12,
    color: 'brand',
  },
  {
    num: 2,
    slug: 'tier2',
    title: '운영 수준 패턴',
    desc: '필터·벌크·인라인편집·Undo·Optimistic·Tabs·Stepper·Tooltip·Popover·Command Palette 등',
    count: 19,
    color: 'warm',
  },
  {
    num: 3,
    slug: 'tier3',
    title: '디자인 시스템',
    desc: '토큰 3계층 · 8pt Grid · Color Scale 50-900',
    count: 3,
    color: 'emerald',
  },
  {
    num: 4,
    slug: 'tier4',
    title: '접근성 (a11y)',
    desc: 'Live Region · Skip Link · 색맹 대응',
    count: 3,
    color: 'rose',
  },
];

export const PATTERNS = [
  // Tier 1 — 정보 표현
  { id: 'skeleton',     tier: 1, num: 1,  title: '스켈레톤 로딩 (Skeleton)',          lead: '데이터 로딩 중에 회색 박스로 레이아웃 모양을 미리 보여줍니다.' },
  { id: 'empty',        tier: 1, num: 2,  title: '빈 상태 UI (Empty State)',          lead: '데이터 0개일 때 전용 안내 화면. 빈 테이블만 두면 사용자는 고장난 줄 압니다.' },
  { id: 'toast',        tier: 1, num: 3,  title: '토스트 (Toast)',                    lead: '잠깐 떴다가 자동으로 사라지는 알림. 흐름을 끊지 않습니다.' },
  { id: 'pagination',   tier: 1, num: 4,  title: '페이지네이션 (Pagination)',         lead: '많은 데이터를 페이지 단위로 끊어서 보여줍니다.' },
  { id: 'micro',        tier: 1, num: 5,  title: '마이크로 인터랙션',                 lead: '0.1~0.3초짜리 작은 애니메이션. 클릭 피드백을 즉각 알립니다.' },
  { id: 'focus',        tier: 1, num: 6,  title: '포커스 스타일 (:focus-visible)',    lead: 'Tab 키 이동 시에만 outline 표시. 키보드 사용자와 접근성.' },
  { id: 'modal',        tier: 1, num: 7,  title: '모달 (Modal)',                      lead: '화면 중앙 팝업. 즉시 응답이 필요한 액션에 적합.' },
  { id: 'drawer',       tier: 1, num: 8,  title: '드로어 (Drawer)',                   lead: '옆에서 슬라이드. 메인 화면을 보면서 작성형 폼.' },
  { id: 'dark',         tier: 1, num: 9,  title: '다크 모드',                         lead: 'CSS 변수와 data-theme 속성. 컴포넌트 코드는 손대지 않습니다.' },
  { id: 'zebra',        tier: 1, num: 10, title: 'Zebra 테이블',                       lead: '짝수 행 배경색 변경으로 가독성 향상.' },
  { id: 'sort',         tier: 1, num: 11, title: '정렬 인디케이터',                   lead: '컬럼 헤더 클릭 시 ▲▼로 정렬 방향 시각화.' },
  { id: 'icon',         tier: 1, num: 12, title: '아이콘 라이브러리',                 lead: '텍스트 라벨보다 시각 인지가 빠릅니다.' },

  // Tier 2 — 운영 패턴
  { id: 'filter-chips', tier: 2, num: 13, title: '필터 칩 (Filter Chips)',            lead: '적용된 필터를 칩으로 표시. 한눈에 확인 + 개별 해제.' },
  { id: 'combobox',     tier: 2, num: 14, title: '자동완성 (Combobox)',               lead: 'select가 아닌 검색하면서 고르는 패턴. 300ms debounce 적용.' },
  { id: 'date-range',   tier: 2, num: 15, title: '날짜 범위 선택',                    lead: '시작일~종료일 한 번에. 빠른 선택 단축 버튼 함께.' },
  { id: 'bulk',         tier: 2, num: 16, title: '다중 선택 + 벌크 액션',             lead: '다중 선택 + 일괄 액션. 헤더 체크박스의 3 상태(미선택/일부/전체).' },
  { id: 'sticky',       tier: 2, num: 17, title: 'Sticky 액션 바',                    lead: '스크롤해도 액션 바가 위에 고정 — 100건 중 50번째 보면서도 액션.' },
  { id: 'inline',       tier: 2, num: 18, title: '인라인 편집 (Inline Edit)',         lead: '셀 클릭 → 인풋 변신. 모달 폼 흐름보다 5배 빠름.' },
  { id: 'confirm',      tier: 2, num: 19, title: '확인 다이얼로그 (3 변형)',          lead: '위험도에 따라 3 변형. 고위험은 문자열 직접 입력 요구.' },
  { id: 'undo',         tier: 2, num: 20, title: 'Undo Snackbar',                     lead: "5초 안에 되돌리기. Gmail '전송 취소'와 같은 패턴." },
  { id: 'optimistic',   tier: 2, num: 21, title: 'Optimistic Update',                 lead: 'UI 즉시 반영 → 서버 응답 후 검증. 실패 시 원복.' },
  { id: 'tabs',         tier: 2, num: 22, title: '탭 (Tabs)',                          lead: '콘텐츠가 다른 영역 — 개요/이력/첨부/감사.' },
  { id: 'segmented',    tier: 2, num: 23, title: 'Segmented Control',                 lead: '같은 콘텐츠의 표시 방식만 — 목록/카드/칸반.' },
  { id: 'stepper',      tier: 2, num: 24, title: 'Stepper / Wizard',                  lead: '긴 폼을 단계로 분할. 4단계가 한 화면 30개 필드보다 부담 적음.' },
  { id: 'master',       tier: 2, num: 25, title: 'Master-Detail',                     lead: '좌측 목록 + 우측 상세. 네비게이션과 작업을 동시에.' },
  { id: 'tooltip',      tier: 2, num: 26, title: '툴팁 (Tooltip)',                     lead: '호버 시 작은 텍스트만. 추가 조작 없음.' },
  { id: 'popover',      tier: 2, num: 27, title: '팝오버 (Popover)',                   lead: '클릭 시 인터랙티브 박스. 안에 버튼·링크 가능.' },
  { id: 'cmdpal',       tier: 2, num: 28, title: 'Command Palette (Ctrl+K)',          lead: 'Ctrl+K로 모든 기능 키보드 접근. Linear/Notion 분위기.' },
  { id: 'virtual',      tier: 2, num: 29, title: 'Virtualized List (1000건)',          lead: '1000건 데이터를 보이는 ~12개만 DOM에 그림. 100만건도 부드러움.' },
  { id: 'debounce',     tier: 2, num: 30, title: 'Debounce (검색 입력)',               lead: '타이핑 멈춘 400ms 뒤만 실행. 키 한 번마다 호출 안 함.' },
  { id: 'lazy',         tier: 2, num: 31, title: 'Lazy Image Loading',                lead: "loading='lazy' 한 줄. 화면 진입 직전 로드." },

  // Tier 3 — 디자인 시스템
  { id: 'tokens',       tier: 3, num: 32, title: '디자인 토큰 (3계층)',                lead: 'Primitive → Semantic → Component. 브랜드 변경 시 한 줄만 수정.' },
  { id: 'grid',         tier: 3, num: 33, title: '8pt Grid System',                    lead: "모든 간격을 8의 배수로. '왠지 정돈된 느낌'의 정체." },
  { id: 'scale',        tier: 3, num: 34, title: 'Color Scale (50→900)',               lead: '한 색의 10단계. 즉흥 색상 만들지 않고 일관성 유지.' },

  // Tier 4 — 접근성
  { id: 'live-region',  tier: 4, num: 35, title: 'Live Region (스크린리더 알림)',      lead: 'aria-live 영역의 텍스트 변경은 스크린리더가 자동 음성 출력.' },
  { id: 'skip-link',    tier: 4, num: 36, title: 'Skip to Content Link',               lead: '키보드 사용자가 30번 Tab 안 거치게 — Tab 한 번이면 본문.' },
  { id: 'color-blind',  tier: 4, num: 37, title: '색만으로 정보 전달 금지',             lead: '색 + 아이콘 + 텍스트 3중 인코딩. 적록색맹 5% 대응.' },
];

export function getPattern(id) {
  return PATTERNS.find((p) => p.id === id) ?? null;
}

export function getPatternsByTier(tierNum) {
  return PATTERNS.filter((p) => p.tier === tierNum);
}

export function getNeighbors(id) {
  const idx = PATTERNS.findIndex((p) => p.id === id);
  return {
    prev: idx > 0 ? PATTERNS[idx - 1] : null,
    next: idx < PATTERNS.length - 1 ? PATTERNS[idx + 1] : null,
  };
}
