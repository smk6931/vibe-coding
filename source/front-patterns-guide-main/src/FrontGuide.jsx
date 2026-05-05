import React, { useState } from "react";
import Tier1, { tier1Patterns } from "./Tier1.jsx";
import Tier2, { tier2Patterns } from "./Tier2.jsx";
import Tier3, { tier3Patterns } from "./Tier3.jsx";
import Tier4, { tier4Patterns } from "./Tier4.jsx";

export default function FrontGuide() {
  const [theme, setTheme] = useState("light");
  const tierNav = [
    { tier: 1, label: "정보 표현", patterns: tier1Patterns },
    { tier: 2, label: "운영 패턴", patterns: tier2Patterns },
    { tier: 3, label: "디자인 시스템", patterns: tier3Patterns },
    { tier: 4, label: "접근성", patterns: tier4Patterns }
  ];

  return (
    <div className={`frontGuideShell theme-${theme}`} data-theme={theme}>
      <header className="frontGuideHero">
        <span>Frontend UX Patterns · 37 Demos</span>
        <h1>프론트엔드 UX 패턴 가이드</h1>
        <p>
          버튼·카드 같은 컴포넌트가 아니라 사용자가 정보를 어떻게 인지하고 반응하는지 설계하는 패턴 모음.
          Tier 1 정보 표현부터 Tier 4 접근성까지 37개를 직접 동작하는 데모로 모았습니다.
        </p>
        <nav className="tierNav" aria-label="Tier 점프">
          {tierNav.map((t) => (
            <a key={t.tier} href={`#tier-${t.tier}`} className={`tierNavItem t${t.tier}`}>
              <strong>Tier {t.tier}</strong>
              <span>{t.label}</span>
              <small>{t.patterns.length}개</small>
            </a>
          ))}
        </nav>
        <div className="topThemeRow">
          <button className="demoButton" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "라이트 모드" : "다크 모드"}로 전환
          </button>
          <small className="demoHint">테마 변경은 페이지 전체에 즉시 반영됩니다 (CSS 변수 + data-theme).</small>
        </div>
      </header>

      <main id="main-content">
        <Tier1 theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
        <Tier2 />
        <Tier3 />
        <Tier4 />
      </main>

      <footer className="frontGuideFooter">
        <strong>학습 로드맵</strong>
        <p>
          Tier 1부터 차례로 — 토스트·빈 상태·스켈레톤이 첫 인상을 만들고,
          Tier 2 Command Palette·벌크 액션·Optimistic이 차별화 포인트, Tier 3 토큰 체계가 일관성,
          Tier 4 접근성이 입찰 점수를 만듭니다.
        </p>
      </footer>
    </div>
  );
}
