import { useEffect, useMemo, useState } from 'react';
import s from './MiniHompyLive.module.css';

const STAR_COUNT = 50;
const SHAPES = ['✦', '✧', '✶', '✩', '⋆', '✪', '·'];
const VISITOR_KEY = 'mhl:visitorCount';
const VISITOR_SESSION_KEY = 'mhl:visitedSession';
const DIARY_KEY = 'mhl:diary';
const VISITOR_START = 1336;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

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
  return (
    <div className={s.card}>
      <div className={s.cardTitle}>✦ TODAY'S VISITORS ✦</div>
      <div className={s.lcd}>
        {display.split('').map((d, i) => (
          <span key={i} className={s.lcdDigit}>{d}</span>
        ))}
      </div>
      <div className={s.cardFoot}>since 2026 ⋆ thanks for visiting ♡</div>
    </div>
  );
}

function KuromiPhoto() {
  return (
    <div className={`${s.card} ${s.kuromiCard}`}>
      <div className={s.cardTitle}>✿ TODAY'S PHOTO ✿</div>
      <div className={s.kuromiFrame}>
        <img
          src="/kuromi.png"
          alt="Kuromi — 오늘의 사진"
          className={s.kuromiImg}
          loading="lazy"
        />
        <div className={`${s.kuromiTape} ${s.kuromiTapeTl}`} aria-hidden="true" />
        <div className={`${s.kuromiTape} ${s.kuromiTapeBr}`} aria-hidden="true" />
      </div>
      <div className={s.cardFoot}>현재 mood: 보라 + 핑크 + 까칠 ✦</div>
    </div>
  );
}

const FAVORITES = [
  { emoji: '💜', label: '보라색이 들어간 모든 것' },
  { emoji: '🖤', label: '쿠로미 & 산리오 캐릭터즈' },
  { emoji: '🌙', label: '새벽 3시의 mood playlist' },
  { emoji: '✦', label: '반짝이·별 모양 액세서리' },
  { emoji: '🍓', label: '딸기 우유 + 마카롱' },
  { emoji: '🎧', label: 'Y2K 시티팝 / J-pop' },
  { emoji: '📓', label: '스티커 잔뜩 붙인 다이어리' },
  { emoji: '🪩', label: '글리터 매니큐어' },
];

function FavoritesCard() {
  return (
    <div className={`${s.card} ${s.favoritesCard}`}>
      <div className={s.cardTitle}>♡ MY FAVORITE THINGS ♡</div>
      <ul className={s.favList}>
        {FAVORITES.map((f, i) => (
          <li key={i} className={s.favItem}>
            <span className={s.favEmoji} aria-hidden="true">{f.emoji}</span>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function HomePage() {
  return (
    <section className={s.page}>
      <header className={s.pageHead}>
        <h1 className={s.glitterTitle}>✦ KUROMI's MINIHOME ✦</h1>
        <p className={s.subtitle}>welcome to my purple-pink corner of the web ♡</p>
      </header>
      <div className={s.cardGrid}>
        <div className={s.cardStack}>
          <VisitorCounter />
          <KuromiPhoto />
        </div>
        <FavoritesCard />
        <DiaryMemo />
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className={s.page}>
      <header className={s.pageHead}>
        <h1 className={s.glitterTitle}>✶ ABOUT ME ✶</h1>
        <p className={s.subtitle}>a little intro from your local space-goth ♡</p>
      </header>
      <article className={`${s.card} ${s.aboutCard}`}>
        <p className={s.aboutGreeting}>
          하이! 보라랑 핑크 사이 어딘가에 사는 <em>쿠로미</em> 덕후예요 ✦
        </p>
        <p>
          미니홈피의 주인장이고, 별 가루 모으는 게 취미예요. 새벽 3시에 듣는 mood playlist가 인생이고,
          글리터 안 묻은 손톱은 손톱이 아니라고 생각하는 편 ♡ Y2K 감성이라면 다 좋아하는데, 특히{' '}
          <strong>다크 큐트</strong>—까칠한 척 까만 옷에 핑크 디테일 한 톨—이 황금비라고 믿어요.
        </p>
        <p>
          이 페이지는 그런 취향을 그대로 옮겨담은 작은 우주예요. 사이드바로 이동해서 <strong>홈</strong>에
          들리면 방문자 카운터, 좋아하는 것 카드, 그리고 오늘의 다이어리도 볼 수 있어요. 다이어리는 직접
          써도 OK ⋆ (브라우저 로컬에 자동 저장돼요)
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

export default function MiniHompyLive({ thumbnail = false }) {
  const [page, setPage] = useState('home');
  if (thumbnail) {
    return (
      <div className={`${s.frame} ${s.thumbnailMode}`}>
        <StarParticles />
        <div className={s.layout}>
          <main className={s.main}><HomePage /></main>
        </div>
      </div>
    );
  }
  return (
    <div className={s.frame}>
      <StarParticles />
      <div className={s.layout}>
        <aside className={s.sidebar}>
          <div className={s.brand}>
            <div className={s.brandMark}>✶</div>
            <div>
              <div className={s.brandName}>KUROMI</div>
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
