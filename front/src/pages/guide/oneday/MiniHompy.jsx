import { useState, useEffect, useRef } from 'react';
import s from './MiniHompy.module.css';

function StarParticles() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.004,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1 || s.alpha <= 0) s.dir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const hue = 280 + Math.random() * 40;
        ctx.fillStyle = `hsla(${hue}, 100%, 85%, ${s.alpha})`;
        ctx.shadowColor = '#e879f9';
        ctx.shadowBlur = 10;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={s.starCanvas} />;
}

function VisitorCounter() {
  const [count] = useState(() => {
    const stored = localStorage.getItem('mh_visitor_count');
    const next = stored ? parseInt(stored, 10) + 1 : 1247;
    localStorage.setItem('mh_visitor_count', next);
    return next;
  });

  return (
    <div className={s.visitorBox}>
      <span className={s.visitorLabel}>✨ 방문자수</span>
      <span className={s.visitorCount}>
        {String(count).padStart(6, '0').split('').map((d, i) => (
          <span key={i} className={s.digit}>{d}</span>
        ))}
      </span>
    </div>
  );
}

function FavoriteCard({ emoji, label, desc }) {
  return (
    <div className={s.favCard}>
      <div className={s.favEmoji}>{emoji}</div>
      <div className={s.favLabel}>{label}</div>
      <div className={s.favDesc}>{desc}</div>
    </div>
  );
}

function DiarySection() {
  const [memos, setMemos] = useState(() => {
    const saved = localStorage.getItem('mh_diary_memos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '오늘 커피 세 잔... 내일은 줄여야지 ☕', date: '2026.04.26' },
      { id: 2, text: '새 플레이리스트 완성 🎧 기분 최고', date: '2026.04.25' },
    ];
  });
  const [input, setInput] = useState('');

  const addMemo = () => {
    if (!input.trim()) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    const next = [{ id: Date.now(), text: input.trim(), date: dateStr }, ...memos];
    setMemos(next);
    localStorage.setItem('mh_diary_memos', JSON.stringify(next));
    setInput('');
  };

  return (
    <div className={s.diarySection}>
      <h3 className={s.sectionTitle}>📔 오늘의 다이어리</h3>
      <div className={s.diaryInputRow}>
        <input
          className={s.diaryInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMemo()}
          placeholder="한 줄 메모를 남겨보세요 ✏️"
          maxLength={80}
        />
        <button className={s.diaryBtn} onClick={addMemo}>등록</button>
      </div>
      <div className={s.diaryList}>
        {memos.map(m => (
          <div key={m.id} className={s.diaryItem}>
            <span className={s.diaryDate}>{m.date}</span>
            <span className={s.diaryText}>{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MiniHompy() {
  return (
    <div className={s.wrapper}>
      <StarParticles />
      <div className={s.minihompy}>
        <div className={s.hompyHeader}>
          <span className={s.headerDeco}>🌟</span>
          <span className={s.headerTitle}>미니홈피</span>
          <span className={s.headerDeco}>🌟</span>
        </div>

        <div className={s.profileSection}>
          <div className={s.profilePhotoWrap}>
            <img
              className={s.profilePhoto}
              src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=300&h=300&fit=crop&crop=faces"
              alt="홍길동 프로필"
            />
            <div className={s.photoRing} />
          </div>
          <div className={s.profileInfo}>
            <h1 className={s.profileName}>홍길동</h1>
            <div className={s.profileStatus}>🎵 오늘도 바이브코딩 중 🎵</div>
            <VisitorCounter />
          </div>
        </div>

        <div className={s.divider} />

        <div>
          <h3 className={s.sectionTitle}>💕 좋아하는 것</h3>
          <div className={s.favGrid}>
            <FavoriteCard emoji="☕" label="커피" desc="아메리카노 하루 세 잔은 기본" />
            <FavoriteCard emoji="🎵" label="음악" desc="Lo-fi & Indie Pop 최애" />
            <FavoriteCard emoji="✈️" label="여행" desc="새로운 곳, 새로운 나" />
            <FavoriteCard emoji="💻" label="클로드" desc="AI랑 바이브코딩 중" />
          </div>
        </div>

        <div className={s.divider} />

        <DiarySection />

        <div className={s.hompyFooter}>
          made with 💜 &nbsp;·&nbsp; since 2026
        </div>
      </div>
    </div>
  );
}
