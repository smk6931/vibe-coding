import React from "react";

export function SectionCard({ id, title, lead, children, span }) {
  return (
    <article className={`frontGuideCard ${span === 2 ? "span-2" : ""}`} id={id}>
      <header>
        <h2>{title}</h2>
        <p>{lead}</p>
      </header>
      <div className="frontGuideDemo">{children}</div>
    </article>
  );
}

export function TierHeader({ tier, label, sub }) {
  return (
    <div className="tierHeader" id={`tier-${tier}`}>
      <span className="tierBadge">Tier {tier}</span>
      <h2>{label}</h2>
      <p>{sub}</p>
    </div>
  );
}
