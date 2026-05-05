import React, { useState } from "react";
import { SectionCard, TierHeader } from "./ui.jsx";

function LiveRegionDemo() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  function broadcast() {
    const next = count + 1;
    setCount(next);
    setMessage(`알림 ${next}: 새 메시지가 도착했습니다`);
  }
  return (
    <div className="demoStack">
      <button className="demoButton primary" type="button" onClick={broadcast}>알림 발송 (스크린리더에 자동 음성)</button>
      <div className="liveRegionBox" aria-live="polite" aria-atomic="true">
        {message || "(아직 알림 없음)"}
      </div>
      <small className="demoHint">
        시각적으로는 텍스트만 바뀌지만, <code>aria-live="polite"</code>가 있어 스크린리더는 변경 시 자동으로 읽어줌.
        시각장애인은 토스트가 떴는지 모름 → Live Region 필수.
      </small>
    </div>
  );
}

function SkipLinkDemo() {
  return (
    <div className="demoStack">
      <small className="demoHint">
        이 페이지 맨 위에 보이지 않는 <code>"본문 바로가기"</code> 링크가 있습니다.
        브라우저 첫 진입 후 <strong>Tab 키</strong> 한 번만 눌러보세요. 좌상단에 갑자기 나타납니다.
      </small>
      <div className="skipLinkVisual">
        <div className="skipLinkPreview">
          <span>←  Tab 누르면 좌상단에 이런 박스가 나타납니다</span>
        </div>
      </div>
      <small className="demoHint">
        키보드 사용자가 사이드바 30번 Tab으로 통과하지 않게 함. 코드는 <code>position: absolute; left: -999px; :focus 시 보임</code>.
      </small>
    </div>
  );
}

function ColorBlindDemo() {
  const items = [
    { id: 1, label: "성공", bad: "color-only", good: "with-icon" },
    { id: 2, label: "실패", bad: "color-only", good: "with-icon" }
  ];
  return (
    <div className="demoStack">
      <div className="colorBlindCompare">
        <div>
          <h4>나쁨 — 색만으로</h4>
          <div className="cbBlock">
            <span className="cbBadge cbGreen">승인</span>
            <span className="cbBadge cbRed">반려</span>
          </div>
          <small className="demoHint">적록색맹은 두 색이 거의 같게 보임 → 정보 전달 실패.</small>
        </div>
        <div>
          <h4>좋음 — 색 + 아이콘 + 텍스트</h4>
          <div className="cbBlock">
            <span className="cbBadge cbGreen"><span className="cbIcon">✓</span>승인</span>
            <span className="cbBadge cbRed"><span className="cbIcon">✗</span>반려</span>
          </div>
          <small className="demoHint">색이 안 보여도 ✓/✗와 텍스트로 구분 가능.</small>
        </div>
      </div>
      <small className="demoHint">
        한국 남성 약 5%가 적록색맹. 공공기관·대기업 입찰 시 웹접근성 평가 항목.
      </small>
    </div>
  );
}

export const tier4Patterns = [
  { id: "live-region", title: "35. Live Region (스크린리더 알림)", lead: "aria-live 영역의 텍스트 변경은 스크린리더가 자동 음성 출력." },
  { id: "skip-link", title: "36. Skip to Content Link", lead: "키보드 사용자가 30번 Tab 안 거치게 — Tab 한 번이면 본문." },
  { id: "color-blind", title: "37. 색만으로 정보 전달 금지", lead: "색 + 아이콘 + 텍스트 3중 인코딩. 적록색맹 5% 대응." }
];

export default function Tier4() {
  return (
    <>
      <TierHeader tier={4} label="접근성 (a11y) 심화" sub="공공기관·대기업 입찰의 필수 항목. 어렵지 않은데 안 챙기면 큰 실점." />
      <div className="frontGuideGrid">
        <SectionCard id="live-region" title={tier4Patterns[0].title} lead={tier4Patterns[0].lead}><LiveRegionDemo /></SectionCard>
        <SectionCard id="skip-link" title={tier4Patterns[1].title} lead={tier4Patterns[1].lead}><SkipLinkDemo /></SectionCard>
        <SectionCard id="color-blind" title={tier4Patterns[2].title} lead={tier4Patterns[2].lead} span={2}><ColorBlindDemo /></SectionCard>
      </div>
    </>
  );
}
