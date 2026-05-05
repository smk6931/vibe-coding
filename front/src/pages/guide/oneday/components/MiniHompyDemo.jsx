import { useEffect, useMemo, useState } from 'react';
import s from './MiniHompyLive.module.css';
import x from './MiniHompyDemoExtras.module.css';

/**
 * MiniHompyDemo — MiniHompyLive 풀버전 + 외부 vibe-coding-minihome v2 업그레이드본 통합.
 *
 * 산리오 IP(쿠로미 이미지·캐릭터명) 전부 제거 → 외부 모객(소모임 / 인스타 / 사이트 노출) 안전.
 *
 * 통합된 카드 (8종):
 *   기존 4종: VisitorCounter / DemoPhoto(SVG) / FavoritesCard / DiaryMemo
 *   업그레이드 4종: MoodMeter / NowPlaying / StickerBoard / Guestbook
 *
 * IP 클리닝 변경점:
 *   - kuromi.png            → 인라인 SVG placeholder (V 이니셜 + 그라디언트)
 *   - "KUROMI"              → "VIBE"
 *   - "쿠로미 & 산리오"      → "별 모양 액세서리·반짝이"
 *   - artist "kuromi.fm"    → "vibe.fm"
 *   - sticker label "kuromi"→ "vibe"
 *   - guestbook seed 산리오 → 일반 닉네임 (lavender / midnight / latte)
 *   - localStorage prefix   → mhd: 통일
 *
 * CSS는 MiniHompyLive.module.css(기존 4종) + MiniHompyDemoExtras.module.css(신규 4종) 분리 import.
 */

const STAR_COUNT = 50;
const SHAPES = ['✦', '✧', '✶', '✩', '⋆', '✪', '·'];
const VISITOR_KEY = 'mhd:visitorCount';
const VISITOR_SESSION_KEY = 'mhd:visitedSession';
const DIARY_KEY = 'mhd:diary';
const GUESTBOOK_KEY = 'mhd:guestbook';
const VISITOR_START = 1336;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ============================================================ Stars ===== */

function StarParticles() {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        top: rand(0, 100),
        size: rand(8, 20),
        delay: rand(0, 6),
        duration: rand(2.4, 5.6),
        shape: SHAPES[Math.floor(rand(0, SHAPES.length))],
        hue: Math.random() < 0.5
          ? 'rgba(255, 220, 250, 0.95)'
          : 'rgba(192, 132, 252, 0.95)',
      })),
    []
  );
  return (
    <div className={s.stars} aria-hidden="true">
      {stars.map(st => (
        <span
          key={st.id}
          className={s.star}
          style={{
            left: `${st.left}%`,
            top: `${st.top}%`,
            fontSize: `${st.size}px`,
            animationDelay: `${st.delay}s`,
            animationDuration: `${st.duration}s`,
            color: st.hue,
          }}
        >
          {st.shape}
        </span>
      ))}
    </div>
  );
}

/* ====================================================== VisitorCounter == */

/* 최근 들른 손님 6명 (사이월드 "오늘 들른 일촌" 톤). */
const VC_RECENT = [
  { avatar: '🎀', name: 'lavender', at: '방금' },
  { avatar: '☕', name: 'latte', at: '5분 전' },
  { avatar: '🌙', name: 'moon', at: '12분 전' },
  { avatar: '🍓', name: 'berry', at: '1시간 전' },
  { avatar: '🪩', name: 'disco', at: '오전 11:34' },
  { avatar: '✦', name: 'star', at: '어제' },
];

function VisitorCounter() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    const stored = parseInt(localStorage.getItem(VISITOR_KEY) || '', 10);
    const base = Number.isFinite(stored) ? stored : VISITOR_START;
    const visited = sessionStorage.getItem(VISITOR_SESSION_KEY) === '1';
    const next = visited ? base : base + 1;
    if (!visited) {
      localStorage.setItem(VISITOR_KEY, String(next));
      sessionStorage.setItem(VISITOR_SESSION_KEY, '1');
    }
    setCount(next);
  }, []);
  const display = String(count ?? 0).padStart(7, '0');
  const total = count ?? VISITOR_START;
  const dailyAvg = Math.max(1, Math.round(total / 120));

  return (
    <div className={s.card}>
      <div className={s.cardTitle}>✦ TODAY'S VISITORS ✦</div>
      <div className={s.lcd}>
        {display.split('').map((d, i) => (
          <span key={i} className={s.lcdDigit}>{d}</span>
        ))}
      </div>

      <div className={x.vcRecentWrap}>
        <div className={x.vcRecentLabel}>♡ 오늘 들른 손님</div>
        <ul className={x.vcRecentList}>
          {VC_RECENT.map((v, i) => (
            <li key={i} className={x.vcRecentItem}>
              <span className={x.vcRecentAvatar} aria-hidden="true">{v.avatar}</span>
              <div className={x.vcRecentInfo}>
                <span className={x.vcRecentName}>{v.name}</span>
                <span className={x.vcRecentAt}>{v.at}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={x.vcStats}>
        <span>
          누적 <span className={x.vcStatsAccent}>{total.toLocaleString()}</span>명
        </span>
        <span>
          일평균 <span className={x.vcStatsAccent}>{dailyAvg}</span>명 ⋆ since 2026
        </span>
      </div>

      <div className={s.cardFoot}>thanks for visiting ♡</div>
    </div>
  );
}

/* ============================================================ MoodMeter = */

const MOOD_ENERGY = 4;
const MOOD_TOTAL = 5;
const MOOD_STATS = [
  { key: 'mood', label: 'MOOD', value: '✦ dreamy purple' },
  { key: 'weather', label: 'WEATHER', value: '🌙 깊은 보라 밤' },
  { key: 'outfit', label: 'OUTFIT', value: '🖤 블랙 + 핑크 리본' },
  { key: 'battery', label: 'BATTERY', value: '🔋 87%' },
];

function MoodMeter() {
  return (
    <div className={`${s.card} ${x.moodCard}`}>
      <div className={s.cardTitle}>✦ TODAY'S MOOD ✦</div>
      <div className={x.moodEnergy}>
        <span className={x.moodEnergyLabel}>ENERGY</span>
        <div className={x.moodEnergyBars} aria-label={`energy ${MOOD_ENERGY} of ${MOOD_TOTAL}`}>
          {Array.from({ length: MOOD_TOTAL }).map((_, i) => (
            <span
              key={i}
              className={`${x.moodBar} ${i < MOOD_ENERGY ? x.moodBarOn : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className={x.moodEnergyValue}>{MOOD_ENERGY}/{MOOD_TOTAL}</span>
      </div>
      <ul className={x.moodStats}>
        {MOOD_STATS.map(stat => (
          <li key={stat.key} className={x.moodStat}>
            <span className={x.moodStatKey}>{stat.label}</span>
            <span className={x.moodStatVal}>{stat.value}</span>
          </li>
        ))}
      </ul>
      <div className={s.cardFoot}>자동 갱신 · 매일 새벽 3시 ⋆</div>
    </div>
  );
}

/* ============================================================ DemoPhoto = */

function DemoPhotoSvg() {
  return (
    <svg
      viewBox="0 0 240 240"
      width="240"
      height="240"
      role="img"
      aria-label="VIBE 미니홈피 데모 일러스트"
      style={{ display: 'block', borderRadius: 8, boxShadow: '0 8px 22px rgba(0, 0, 0, 0.45)', maxWidth: '100%' }}
    >
      <defs>
        <linearGradient id="mhd-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e0938" />
          <stop offset="55%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <radialGradient id="mhd-glow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="240" height="240" fill="url(#mhd-bg)" />
      <rect width="240" height="240" fill="url(#mhd-glow)" />
      <text x="38" y="48" fontSize="22" fill="rgba(255,220,250,0.85)">✦</text>
      <text x="200" y="72" fontSize="16" fill="rgba(255,255,255,0.55)">✶</text>
      <text x="56" y="200" fontSize="14" fill="rgba(192,132,252,0.7)">⋆</text>
      <text x="195" y="210" fontSize="20" fill="rgba(255,220,250,0.55)">✧</text>
      <text x="118" y="48" fontSize="13" fill="rgba(255,255,255,0.55)">·</text>
      <text
        x="120" y="148"
        textAnchor="middle"
        fontFamily="ui-rounded, system-ui, sans-serif"
        fontSize="120" fontWeight="800"
        fill="rgba(255,255,255,0.96)"
        style={{ letterSpacing: '-4px' }}
      >V</text>
      <text
        x="120" y="180"
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="11"
        fill="rgba(255,255,255,0.7)"
        style={{ letterSpacing: '4px' }}
      >VIBE.SESSION</text>
    </svg>
  );
}

function DemoPhoto() {
  return (
    <div className={`${s.card} ${s.kuromiCard}`}>
      <div className={s.cardTitle}>✿ TODAY'S PHOTO ✿</div>
      <div className={s.kuromiFrame}>
        <DemoPhotoSvg />
        <div className={`${s.kuromiTape} ${s.kuromiTapeTl}`} aria-hidden="true" />
        <div className={`${s.kuromiTape} ${s.kuromiTapeBr}`} aria-hidden="true" />
      </div>
      <div className={s.cardFoot}>오늘의 mood: 보라 + 핑크 + 별가루 ✦</div>
    </div>
  );
}

/* ===================================================== FavoritesCard ==== */

const FAVORITES = [
  { emoji: '💜', label: '보라색이 들어간 모든 것' },
  { emoji: '✦', label: '반짝이·별 모양 액세서리' },
  { emoji: '🌙', label: '새벽 3시의 mood playlist' },
  { emoji: '🎧', label: 'Y2K 시티팝 / J-pop' },
  { emoji: '🍓', label: '딸기 우유 + 마카롱' },
  { emoji: '📓', label: '스티커 잔뜩 붙인 다이어리' },
  { emoji: '🪩', label: '글리터 매니큐어' },
  { emoji: '☕', label: '늦은 오후의 라떼 한 잔' },
];

function FavoritesCard({ limit }) {
  const items = typeof limit === 'number' ? FAVORITES.slice(0, limit) : FAVORITES;
  return (
    <div className={`${s.card} ${s.favoritesCard}`}>
      <div className={s.cardTitle}>♡ MY FAVORITE THINGS ♡</div>
      <ul className={s.favList}>
        {items.map((f, i) => (
          <li key={i} className={s.favItem}>
            <span className={s.favEmoji} aria-hidden="true">{f.emoji}</span>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================== NowPlaying = */

const NP_TRACKS = [
  { title: 'Midnight Glitter', artist: 'vibe.fm', album: 'purple lights', mood: 'Y2K cityscape', cover: '🪩', duration: 218 },
  { title: '딸기 우유 라떼', artist: 'lo-fi.kr', album: 'late night cafe', mood: 'sweet & soft', cover: '🍓', duration: 184 },
  { title: '새벽 3시의 별', artist: 'mellow.tape', album: 'star dust', mood: 'dreamy lo-fi', cover: '🌙', duration: 240 },
];

function npFormat(sec) {
  const m = Math.floor(sec / 60);
  const ss = String(Math.floor(sec % 60)).padStart(2, '0');
  return `${m}:${ss}`;
}

function NowPlaying() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [pos, setPos] = useState(72);
  const track = NP_TRACKS[idx];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPos(p => {
        if (p + 1 >= track.duration) {
          setIdx(i => (i + 1) % NP_TRACKS.length);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, track.duration]);

  const next = () => { setIdx(i => (i + 1) % NP_TRACKS.length); setPos(0); };
  const prev = () => { setIdx(i => (i - 1 + NP_TRACKS.length) % NP_TRACKS.length); setPos(0); };
  const pct = Math.min(100, (pos / track.duration) * 100);

  return (
    <div className={`${s.card} ${x.npCard}`}>
      <div className={s.cardTitle}>♪ NOW PLAYING ♪</div>
      <div className={x.npRow}>
        <div className={x.npCover} aria-hidden="true">
          <span className={x.npCoverEmoji}>{track.cover}</span>
          <span className={`${x.npDisc} ${playing ? x.npDiscSpin : ''}`} aria-hidden="true" />
        </div>
        <div className={x.npInfo}>
          <div className={x.npTitle}>{track.title}</div>
          <div className={x.npArtist}>
            {track.artist} · <em>{track.album}</em>
          </div>
          <div className={x.npMood}>✦ {track.mood}</div>
        </div>
      </div>
      <div className={x.npProgress} aria-hidden="true">
        <div className={x.npProgressBar} style={{ width: `${pct}%` }} />
      </div>
      <div className={x.npTime}>
        <span>{npFormat(pos)}</span>
        <span>{npFormat(track.duration)}</span>
      </div>
      <div className={x.npControls}>
        <button type="button" className={x.npBtn} onClick={prev} aria-label="이전 곡">◁◁</button>
        <button
          type="button"
          className={`${x.npBtn} ${x.npBtnMain}`}
          onClick={() => setPlaying(p => !p)}
          aria-label={playing ? '일시정지' : '재생'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" className={x.npBtn} onClick={next} aria-label="다음 곡">▷▷</button>
      </div>
    </div>
  );
}

/* ========================================================== StickerBoard = */

const STICKERS = [
  { emoji: '✦', label: 'vibe', tone: 'pink' },
  { emoji: '🌙', label: 'midnight', tone: 'purple' },
  { emoji: '🪩', label: 'disco', tone: 'pink' },
  { emoji: '🍓', label: 'berry', tone: 'purple' },
  { emoji: '💜', label: 'purple', tone: 'pink' },
  { emoji: '🎀', label: 'ribbon', tone: 'purple' },
  { emoji: '⭐', label: 'star', tone: 'pink' },
  { emoji: '🦄', label: 'unicorn', tone: 'purple' },
  { emoji: '🕯️', label: 'candle', tone: 'pink' },
  { emoji: '👻', label: 'ghost', tone: 'purple' },
  { emoji: '☾', label: 'moon', tone: 'pink' },
  { emoji: '🌟', label: 'glitter', tone: 'purple' },
];

function StickerBoard() {
  return (
    <div className={`${s.card} ${x.stickerCard}`}>
      <div className={s.cardTitle}>
        ✿ STICKER COLLECTION ✿
        <span className={x.stickerCount}>{STICKERS.length} / 24</span>
      </div>
      <ul className={x.stickerGrid}>
        {STICKERS.map((st, i) => (
          <li
            key={i}
            className={`${x.sticker} ${st.tone === 'pink' ? x.stickerPink : x.stickerPurple}`}
            style={{ '--rot': `${(i % 2 === 0 ? -1 : 1) * (3 + (i % 4))}deg` }}
          >
            <span className={x.stickerEmoji} aria-hidden="true">{st.emoji}</span>
            <span className={x.stickerLabel}>{st.label}</span>
          </li>
        ))}
      </ul>
      <div className={s.cardFoot}>매일 한 개씩 모으는 중 ⋆ 다음 슬롯 잠금해제까지 12개</div>
    </div>
  );
}

/* ============================================================ Guestbook = */

const GB_SEED = [
  { id: 'seed-1', name: 'lavender', avatar: '🎀', body: '미니홈피 너무 귀엽다 ♡ 보라 톤 진짜 취향 저격 ✦', at: '2026.05.04 23:12' },
  { id: 'seed-2', name: 'midnight', avatar: '☁', body: '오늘 mood playlist 추천 받아갈게~ 🌙', at: '2026.05.05 01:48' },
  { id: 'seed-3', name: 'latte', avatar: '☕', body: '딸기 우유 + 마카롱 조합 인정합니다 🍓', at: '2026.05.05 09:20' },
];

function gbNowLabel() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${day} ${hh}:${mm}`;
}

function Guestbook() {
  const [entries, setEntries] = useState(GB_SEED);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(GUESTBOOK_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch {}
  }, []);

  const persist = next => {
    setEntries(next);
    localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(next));
  };

  const submit = e => {
    e.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody) return;
    const next = [
      {
        id: `local-${Date.now()}`,
        name: name.trim() || 'guest',
        avatar: '✦',
        body: trimmedBody,
        at: gbNowLabel(),
      },
      ...entries,
    ].slice(0, 12);
    persist(next);
    setName('');
    setBody('');
  };

  const total = entries.length;

  return (
    <div className={`${s.card} ${x.guestbookCard}`}>
      <div className={s.cardTitle}>
        ✉ GUESTBOOK ✉
        <span className={x.gbCount}>총 {total}개의 흔적 ♡</span>
      </div>
      <form className={x.gbForm} onSubmit={submit}>
        <input
          type="text"
          className={`${x.gbInput} ${x.gbName}`}
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={16}
          aria-label="이름"
        />
        <input
          type="text"
          className={`${x.gbInput} ${x.gbBody}`}
          placeholder="한 마디 남기고 가세요 ♡"
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={120}
          aria-label="메시지"
        />
        <button type="submit" className={x.gbSubmit}>남기기 ✦</button>
      </form>
      <ul className={x.gbList}>
        {entries.map(e => (
          <li key={e.id} className={x.gbEntry}>
            <span className={x.gbAvatar} aria-hidden="true">{e.avatar}</span>
            <div className={x.gbBubble}>
              <div className={x.gbMeta}>
                <span className={x.gbNameLabel}>{e.name}</span>
                <span className={x.gbAt}>{e.at}</span>
              </div>
              <div className={x.gbBody}>{e.body}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ====================================================== TodayMessage === */

const TM_MESSAGES = [
  { emoji: '✦', text: '오늘은 글 안 쓰고 별만 줍는 날 ⋆' },
  { emoji: '🌙', text: '새벽이 제일 좋은 사람의 미니홈피.' },
  { emoji: '💜', text: '보라색 옷 입고 마음도 보라색이 됐다.' },
  { emoji: '🪩', text: '디스코볼 하나로 방 전체가 우주 됨.' },
];

const TM_HISTORY = [
  { emoji: '🍓', text: '딸기 우유 한 잔으로 하루 리셋', at: '어제' },
  { emoji: '🎧', text: '시티팝 5시간 무한 반복 중', at: '2일 전' },
  { emoji: '⭐', text: '별 그리는 법 드디어 익혔다', at: '3일 전' },
];

function TodayMessage() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % TM_MESSAGES.length), 6000);
    return () => clearInterval(id);
  }, []);
  const msg = TM_MESSAGES[idx];
  return (
    <div className={`${s.card} ${x.tmCard}`}>
      <div className={s.cardTitle}>✎ TODAY'S MESSAGE</div>
      <div className={x.tmRow}>
        <span className={x.tmEmoji} aria-hidden="true">{msg.emoji}</span>
        <span className={x.tmText}>
          <em>"</em>{msg.text}<em>"</em>
        </span>
      </div>
      <div className={x.tmDots} role="tablist" aria-label="message rotation">
        {TM_MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`${x.tmDot} ${i === idx ? x.tmDotActive : ''}`}
            aria-current={i === idx ? 'true' : undefined}
          />
        ))}
      </div>
      <ul className={x.tmHistory} aria-label="지난 메시지">
        {TM_HISTORY.map((h, i) => (
          <li key={i} className={x.tmHistoryItem}>
            <span className={x.tmHistoryEmoji} aria-hidden="true">{h.emoji}</span>
            <span>{h.text}</span>
            <span className={x.tmHistoryAt}>{h.at}</span>
          </li>
        ))}
      </ul>
      <div className={s.cardFoot}>6초마다 자동 회전 ⋆ 총 {TM_MESSAGES.length}개</div>
    </div>
  );
}

/* ========================================================= IlchonRing === */

const ILCHON = [
  { avatar: '🎀', name: 'lavender', online: true },
  { avatar: '☁', name: 'midnight', online: true },
  { avatar: '☕', name: 'latte', online: false },
  { avatar: '🍓', name: 'berry', online: true },
  { avatar: '🌙', name: 'moon', online: false },
  { avatar: '🪩', name: 'disco', online: true },
  { avatar: '🦄', name: 'unicorn', online: false },
  { avatar: '✦', name: 'star', online: true },
];

function IlchonRing() {
  const onlineCount = ILCHON.filter(p => p.online).length;
  return (
    <div className={`${s.card} ${x.ilchonCard}`}>
      <div className={s.cardTitle}>
        ♥ ILCHON RING ♥
        <span className={x.gbCount}>{onlineCount} / {ILCHON.length} 접속중</span>
      </div>
      <ul className={x.ilchonGrid}>
        {ILCHON.map((p, i) => (
          <li key={i} className={x.ilchon}>
            <span className={x.ilchonAvatar} aria-hidden="true">{p.avatar}</span>
            <span className={x.ilchonName}>{p.name}</span>
            <span
              className={`${x.ilchonDot} ${p.online ? x.ilchonDotOn : x.ilchonDotOff}`}
              aria-label={p.online ? '접속중' : '오프라인'}
            />
          </li>
        ))}
      </ul>
      <div className={s.cardFoot}>일촌 미니홈피 놀러가기 — 클릭으로 점프 ⋆</div>
    </div>
  );
}

/* =========================================================== MiniRoom === */

function MiniRoomSvg() {
  return (
    <svg viewBox="0 0 320 180" className={x.miniRoomSvg} role="img" aria-label="VIBE 미니룸">
      <defs>
        <linearGradient id="mr-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b1466" />
          <stop offset="100%" stopColor="#1a0824" />
        </linearGradient>
        <linearGradient id="mr-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a0d3e" />
          <stop offset="100%" stopColor="#1e0b2c" />
        </linearGradient>
        <linearGradient id="mr-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e0938" />
          <stop offset="60%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="mr-sofa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* 벽 / 바닥 */}
      <rect x="0" y="0" width="320" height="120" fill="url(#mr-wall)" />
      <rect x="0" y="120" width="320" height="60" fill="url(#mr-floor)" />
      {/* 바닥 라인 */}
      <line x1="0" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* 액자 (왼쪽 벽) */}
      <rect x="22" y="22" width="36" height="46" fill="rgba(13,4,24,0.6)" stroke="rgba(255,77,196,0.6)" strokeWidth="1" rx="2" />
      <text x="40" y="50" textAnchor="middle" fontSize="14" fill="rgba(255,220,250,0.9)">✦</text>
      {/* 시계 (벽 가운데 위) */}
      <circle cx="100" cy="38" r="14" fill="rgba(13,4,24,0.6)" stroke="rgba(192,132,252,0.55)" strokeWidth="1" />
      <line x1="100" y1="38" x2="100" y2="28" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
      <line x1="100" y1="38" x2="107" y2="40" stroke="rgba(255,77,196,0.9)" strokeWidth="1.2" />
      {/* 창문 */}
      <rect x="138" y="22" width="64" height="60" fill="url(#mr-window)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" rx="3" />
      <line x1="170" y1="22" x2="170" y2="82" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="138" y1="52" x2="202" y2="52" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text x="148" y="40" fontSize="9" fill="rgba(255,220,250,0.7)">✦</text>
      <text x="186" y="72" fontSize="8" fill="rgba(192,132,252,0.7)">⋆</text>
      {/* 디스코볼 (천장에서 매달림) */}
      <line x1="240" y1="0" x2="240" y2="20" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <circle cx="240" cy="28" r="9" fill="rgba(192,132,252,0.45)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
      <line x1="231" y1="28" x2="249" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
      <line x1="240" y1="19" x2="240" y2="37" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
      {/* 식물 (오른쪽 벽 아래 화분) */}
      <rect x="276" y="78" width="22" height="14" fill="rgba(13,4,24,0.7)" stroke="rgba(192,132,252,0.5)" strokeWidth="0.8" rx="2" />
      <path d="M 287 78 Q 280 60 282 50" stroke="rgba(110,231,183,0.85)" strokeWidth="1.5" fill="none" />
      <path d="M 287 78 Q 296 62 295 52" stroke="rgba(110,231,183,0.85)" strokeWidth="1.5" fill="none" />
      <path d="M 287 78 Q 287 58 287 48" stroke="rgba(110,231,183,0.95)" strokeWidth="1.5" fill="none" />
      {/* 소파 (바닥 가운데) */}
      <rect x="92" y="128" width="120" height="32" fill="url(#mr-sofa)" rx="6" />
      <rect x="92" y="128" width="120" height="10" fill="rgba(255,255,255,0.15)" rx="6" />
      {/* 쿠션 */}
      <circle cx="116" cy="138" r="5" fill="rgba(255,220,250,0.55)" />
      <circle cx="188" cy="138" r="5" fill="rgba(192,132,252,0.6)" />
      {/* 러그 */}
      <ellipse cx="152" cy="170" rx="80" ry="6" fill="rgba(255,77,196,0.18)" />
      {/* 사이드 테이블 + 램프 */}
      <rect x="226" y="138" width="22" height="22" fill="rgba(13,4,24,0.7)" stroke="rgba(192,132,252,0.5)" strokeWidth="0.8" />
      <path d="M 232 138 L 244 138 L 240 124 L 234 124 Z" fill="rgba(255,77,196,0.55)" stroke="rgba(255,220,250,0.5)" strokeWidth="0.6" />
      <line x1="237" y1="124" x2="237" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
      {/* 캐릭터 (V 머리, 소파 위) */}
      <circle cx="152" cy="120" r="9" fill="rgba(255,220,250,0.95)" />
      <text x="152" y="124" textAnchor="middle" fontSize="10" fontWeight="800" fill="#7c3aed">V</text>
      {/* 별 가루 */}
      <text x="60" y="100" fontSize="10" fill="rgba(255,220,250,0.6)">⋆</text>
      <text x="270" y="115" fontSize="9" fill="rgba(192,132,252,0.6)">·</text>
      <text x="220" y="60" fontSize="8" fill="rgba(255,220,250,0.5)">✶</text>
    </svg>
  );
}

function MiniRoom() {
  return (
    <div className={`${s.card} ${x.miniRoomCard}`}>
      <div className={s.cardTitle}>✿ MINI ROOM ✿</div>
      <div className={x.miniRoomFrame}>
        <MiniRoomSvg />
      </div>
      <div className={x.miniRoomLegend}>
        <span className={x.miniRoomLegendItem}>
          <span className={x.miniRoomLegendDot} style={{ background: '#ec4899' }} />소파
        </span>
        <span className={x.miniRoomLegendItem}>
          <span className={x.miniRoomLegendDot} style={{ background: '#7c3aed' }} />창문
        </span>
        <span className={x.miniRoomLegendItem}>
          <span className={x.miniRoomLegendDot} style={{ background: '#6ee7b7' }} />식물
        </span>
        <span className={x.miniRoomLegendItem}>
          <span className={x.miniRoomLegendDot} style={{ background: 'rgba(192,132,252,0.6)' }} />디스코볼
        </span>
      </div>
    </div>
  );
}

/* ============================================================ DiaryMemo = */

const DIARY_PLACEHOLDER = `오늘의 무드 ✦ 보라 + 핑크 + 글리터
오늘 한 일: 별 줍기, 음악 듣기, 다이어리 꾸미기
내일 할 일: 또 별 줍기 ⋆`;

function todayLabel() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${y}.${m}.${day} (${week})`;
}

function DiaryMemo() {
  const [memo, setMemo] = useState('');
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem(DIARY_KEY);
    setMemo(stored ?? DIARY_PLACEHOLDER);
  }, []);
  const onChange = e => { setMemo(e.target.value); setSaved(false); };
  const onBlur = () => { localStorage.setItem(DIARY_KEY, memo); setSaved(true); };
  return (
    <div className={`${s.card} ${s.diaryCard}`}>
      <div className={s.cardTitle}>
        ✎ DIARY · {todayLabel()}
        <span className={`${s.diaryStatus} ${saved ? s.diaryStatusSaved : s.diaryStatusDirty}`}>
          {saved ? 'saved ♡' : 'editing…'}
        </span>
      </div>
      <textarea
        className={s.diaryTextarea}
        value={memo}
        onChange={onChange}
        onBlur={onBlur}
        rows={5}
        spellCheck={false}
        aria-label="오늘의 다이어리"
      />
      <div className={s.cardFoot}>포커스를 잃을 때 자동 저장 · 브라우저 로컬에만 보관 ✦</div>
    </div>
  );
}

/* ============================================================== Pages === */

function HomePage() {
  return (
    <section className={s.page}>
      <header className={s.pageHead}>
        <h1 className={s.glitterTitle}>✦ VIBE's MINIHOME ✦</h1>
        <p className={s.subtitle}>welcome to my own little corner of the web ♡</p>
      </header>
      <div className={s.cardGrid}>
        <VisitorCounter />
        <MoodMeter />
        <TodayMessage />
        <DemoPhoto />
        <FavoritesCard />
        <NowPlaying />
        <MiniRoom />
        <StickerBoard />
        <IlchonRing />
        <DiaryMemo />
        <Guestbook />
      </div>
    </section>
  );
}

function BannerHome() {
  return (
    <section className={`${s.page} ${s.bannerPage}`}>
      <header className={s.pageHead}>
        <h1 className={s.glitterTitle}>✦ VIBE's MINIHOME ✦</h1>
        <p className={s.subtitle}>welcome to my own little corner of the web ♡</p>
      </header>
      <div className={s.bannerRow}>
        <VisitorCounter />
        <DemoPhoto />
        <FavoritesCard limit={4} />
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className={s.page}>
      <header className={s.pageHead}>
        <h1 className={s.glitterTitle}>✶ ABOUT ME ✶</h1>
        <p className={s.subtitle}>a little intro from your local night-owl ♡</p>
      </header>
      <article className={`${s.card} ${s.aboutCard}`}>
        <p className={s.aboutGreeting}>
          하이! 보라랑 핑크 사이 어딘가에 사는 <em>미니홈피 주인장</em>이에요 ✦
        </p>
        <p>
          별 가루 모으는 게 취미고, 새벽 3시에 듣는 mood playlist가 인생이에요.
          글리터 안 묻은 손톱은 손톱이 아니라고 생각하는 편 ♡ Y2K 감성이라면 다 좋아하는데, 특히{' '}
          <strong>다크 큐트</strong>—까만 옷에 핑크 디테일 한 톨—이 황금비라고 믿어요.
        </p>
        <p>
          이 페이지는 그런 취향을 그대로 옮겨담은 작은 우주예요. 사이드바로 이동해서 <strong>홈</strong>에
          들리면 방문자 카운터, 무드 메터, 오늘의 한 마디, 좋아하는 것 카드, 음악 플레이어, 미니룸,
          스티커 컬렉션, 일촌 링, 다이어리, 방명록까지 — 다 직접 써 볼 수 있어요. 모든 입력은
          브라우저 로컬에만 자동 저장돼요 ⋆
        </p>
        <ul className={s.aboutMeta}>
          <li>
            <span className={s.metaKey}>MOOD</span>
            <span className={s.metaVal}>purple haze ✦ pink static</span>
          </li>
          <li>
            <span className={s.metaKey}>VIBE</span>
            <span className={s.metaVal}>Y2K · cute-dark · sparkly</span>
          </li>
          <li>
            <span className={s.metaKey}>NOW LISTENING</span>
            <span className={s.metaVal}>새벽 3시 city-pop loop ♪</span>
          </li>
          <li>
            <span className={s.metaKey}>CATCHPHRASE</span>
            <span className={s.metaVal}>"까칠한 척하지만 사실 다 귀여워" ♡</span>
          </li>
        </ul>
        <p className={s.aboutSign}>— signed, 미니홈피 주인 ✶</p>
      </article>
    </section>
  );
}

/* ============================================================== Frame === */

export default function MiniHompyDemo({ thumbnail = false, mode }) {
  const [page, setPage] = useState('home');
  const resolvedMode = mode ?? (thumbnail ? 'thumbnail' : 'full');

  if (resolvedMode === 'banner') {
    return (
      <div className={`${s.frame} ${s.bannerMode} preserve-color`}>
        <StarParticles />
        <div className={s.bannerLayout}>
          <BannerHome />
        </div>
      </div>
    );
  }

  if (resolvedMode === 'thumbnail') {
    return (
      <div className={`${s.frame} ${s.thumbnailMode} preserve-color`}>
        <StarParticles />
        <div className={s.layout}>
          <main className={s.main}><HomePage /></main>
        </div>
      </div>
    );
  }
  return (
    <div className={`${s.frame} preserve-color`}>
      <StarParticles />
      <div className={s.layout}>
        <aside className={s.sidebar}>
          <div className={s.brand}>
            <div className={s.brandMark}>✶</div>
            <div>
              <div className={s.brandName}>VIBE</div>
              <div className={s.brandSub}>.minihome</div>
            </div>
          </div>
          <nav className={s.nav}>
            <button
              type="button"
              onClick={() => setPage('home')}
              className={`${s.navLink} ${page === 'home' ? s.navLinkActive : ''}`}
            >
              <span className={s.linkIcon}>♡</span>
              <span>홈</span>
            </button>
            <button
              type="button"
              onClick={() => setPage('about')}
              className={`${s.navLink} ${page === 'about' ? s.navLinkActive : ''}`}
            >
              <span className={s.linkIcon}>✦</span>
              <span>소개</span>
            </button>
          </nav>
          <div className={s.sideFoot}>
            <div>since 2026 ⋆</div>
            <div>made with 💜 + ✦</div>
          </div>
        </aside>
        <main className={s.main}>
          {page === 'home' ? <HomePage /> : <AboutPage />}
        </main>
      </div>
    </div>
  );
}
