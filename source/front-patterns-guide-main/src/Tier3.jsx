import React from "react";
import { SectionCard, TierHeader } from "./ui.jsx";

function TokensDemo() {
  return (
    <div className="demoStack">
      <div className="tokenLayer">
        <span className="tokenStage">Primitive</span>
        <div className="tokenRow">
          <div className="tokenSwatch" style={{ background: "#dcfce7" }}><code>--green-100</code></div>
          <div className="tokenSwatch" style={{ background: "#22c55e", color: "#fff" }}><code>--green-500</code></div>
          <div className="tokenSwatch" style={{ background: "#15803d", color: "#fff" }}><code>--green-700</code></div>
        </div>
      </div>
      <div className="tokenArrow">↓ 의미를 부여</div>
      <div className="tokenLayer">
        <span className="tokenStage">Semantic</span>
        <div className="tokenRow">
          <div className="tokenSwatch" style={{ background: "#15803d", color: "#fff" }}><code>--color-success = green-700</code></div>
        </div>
      </div>
      <div className="tokenArrow">↓ 컴포넌트에 적용</div>
      <div className="tokenLayer">
        <span className="tokenStage">Component</span>
        <div className="tokenRow">
          <div className="tokenSwatch" style={{ background: "#15803d", color: "#fff" }}><code>--btn-success-bg</code></div>
        </div>
      </div>
      <small className="demoHint">3계층으로 분리하면 브랜드 색을 바꿀 때 Primitive 한 줄만 수정. 모든 컴포넌트가 자동 변경.</small>
    </div>
  );
}

function GridDemo() {
  const sizes = [4, 8, 16, 24, 32, 48, 64];
  return (
    <div className="demoStack">
      <div className="gridSamples">
        {sizes.map((s) => (
          <div className="gridSample" key={s}>
            <div className="gridLabel">{s}px</div>
            <div className="gridBar" style={{ width: s, height: 14 }} />
          </div>
        ))}
      </div>
      <div className="gridCompare">
        <div>
          <h4>나쁨 (불규칙)</h4>
          <div className="gridBox bad"><div /><div /><div /><div /></div>
        </div>
        <div>
          <h4>좋음 (8pt)</h4>
          <div className="gridBox good"><div /><div /><div /><div /></div>
        </div>
      </div>
      <small className="demoHint">7px·13px·19px 같은 불규칙 간격 → 무의식 피로. 4·8·16·24만 쓰면 정돈된 느낌.</small>
    </div>
  );
}

function ColorScaleDemo() {
  const scales = {
    blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"],
    teal: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"],
    red: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"]
  };
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return (
    <div className="demoStack">
      {Object.entries(scales).map(([name, colors]) => (
        <div className="colorRow" key={name}>
          <span className="colorName">{name}</span>
          <div className="colorBar">
            {colors.map((c, i) => (
              <div key={i} className="colorChip" style={{ background: c, color: i < 5 ? "#0f172a" : "#fff" }}>{steps[i]}</div>
            ))}
          </div>
        </div>
      ))}
      <small className="demoHint">한 색상에서 50~900까지 10단계. "어두운 파랑이 필요해" → blue-700. 즉흥 색 만들지 않음.</small>
    </div>
  );
}

export const tier3Patterns = [
  { id: "tokens", title: "32. 디자인 토큰 (3계층)", lead: "Primitive → Semantic → Component. 브랜드 변경 시 한 줄만 수정." },
  { id: "grid", title: "33. 8pt Grid System", lead: "모든 간격을 8의 배수로. '왠지 정돈된 느낌'의 정체." },
  { id: "scale", title: "34. Color Scale (50→900)", lead: "한 색의 10단계. 즉흥 색상 만들지 않고 일관성 유지." }
];

export default function Tier3() {
  return (
    <>
      <TierHeader tier={3} label="디자인 시스템 기본" sub="일관성·유지보수의 토대. 토큰 / 그리드 / 컬러 스케일 3가지가 시작점." />
      <div className="frontGuideGrid">
        <SectionCard id="tokens" title={tier3Patterns[0].title} lead={tier3Patterns[0].lead}><TokensDemo /></SectionCard>
        <SectionCard id="grid" title={tier3Patterns[1].title} lead={tier3Patterns[1].lead}><GridDemo /></SectionCard>
        <SectionCard id="scale" title={tier3Patterns[2].title} lead={tier3Patterns[2].lead} span={2}><ColorScaleDemo /></SectionCard>
      </div>
    </>
  );
}
