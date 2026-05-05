import { useState } from 'react';
import MiniHompyDemo from './components/MiniHompyDemo';

/**
 * 모객 썸네일/배너 캡처 전용 페이지.
 * - /guide/oneday/demo 로 접속
 * - mode 토글로 full / thumbnail / banner 전환
 * - 각 모드별 권장 캡처 사이즈 표시
 *
 * 캡처 팁: Chrome DevTools → Device Toolbar 로 width 맞추고 영역만 스크린샷.
 */

const MODES = [
  {
    key: 'full',
    label: '풀 (사이드바 + 홈/소개 토글)',
    capture: '데스크탑 폭 1080~1280px 권장',
    width: 1080,
    height: 720,
  },
  {
    key: 'thumbnail',
    label: '썸네일 (홈만)',
    capture: '420 × 360 px 정사각형 썸네일에 적합',
    width: 420,
    height: 360,
  },
  {
    key: 'banner',
    label: '배너 16:8',
    capture: '1232 × 616 px (소모임 / SNS 카드 비율)',
    width: 1232,
    height: 616,
  },
];

export default function Demo() {
  const [mode, setMode] = useState('full');
  const [scale, setScale] = useState(1);
  const current = MODES.find(m => m.key === mode);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* 컨트롤 바 */}
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] uppercase tracking-widest text-slate-400">캡처 모드</span>
          <div className="flex flex-wrap gap-1.5">
            {MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                  mode === m.key
                    ? 'border-brand-400 bg-brand-600/30 text-white'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 text-[12px] text-slate-400">
            <label htmlFor="scale">scale</label>
            <input
              id="scale"
              type="range"
              min={0.3}
              max={1.5}
              step={0.05}
              value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="font-mono text-[11px] text-slate-300 w-10">{scale.toFixed(2)}x</span>
          </div>
        </div>

        {/* 안내 */}
        <div className="text-[12px] text-slate-400">
          권장 사이즈: <strong className="text-slate-200">{current.capture}</strong>
          {' '}· 컨테이너 {current.width}×{current.height} (scale 적용 전)
          <br />
          캡처는 아래 박스 영역만 잘라서 사용. 사이트 헤더/푸터는 영역에 포함시키지 마세요.
        </div>

        {/* 캡처 박스 */}
        <div className="overflow-auto">
          <div
            style={{
              width: current.width,
              height: current.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            <MiniHompyDemo mode={mode} />
          </div>
        </div>

        {/* 푸터 안내 */}
        <div className="text-[11px] text-slate-500 leading-relaxed">
          이 페이지는 모객 썸네일/배너 캡처 전용입니다.
          쿠로미·산리오 IP 의존이 제거된 안전한 데모(MiniHompyDemo)를 사용합니다.
          1회차(5/10) 끝나면 참가자 결과물 사진으로 자연 교체합니다.
        </div>
      </div>
    </div>
  );
}
