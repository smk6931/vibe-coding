/**
 * Tier1Demos — 12개 정보 표현 패턴 라이브 데모.
 * source/front-patterns-guide-main/src/Tier1.jsx 통째 이전 + DarkModeDemo는 내부 state 로 단순화.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { sampleRows } from './_data';
import './patterns.css';

function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [loading]);
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <button className="demoButton" type="button" onClick={() => setLoading(true)}>다시 로딩</button>
      {loading ? (
        <div className="skeletonList">
          {[1, 2, 3].map((k) => (
            <div className="skeletonRow" key={k}>
              <div className="skBox sk-circle" />
              <div className="skLines">
                <div className="skBox sk-line w70" />
                <div className="skBox sk-line w40" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="demoList">
          {sampleRows.slice(0, 3).map((r) => (
            <div className="demoListRow" key={r.id}>
              <div className="demoAvatar">{r.type[0]}</div>
              <div><strong>{r.title}</strong><span>{r.id} · {r.status}</span></div>
            </div>
          ))}
        </div>
      )}
    </div></div></div>
  );
}

function EmptyStateDemo() {
  const [hasData, setHasData] = useState(false);
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <button className="demoButton" type="button" onClick={() => setHasData((v) => !v)}>
        {hasData ? "데이터 비우기" : "데이터 채우기"}
      </button>
      {hasData ? (
        <div className="demoList">
          {sampleRows.slice(0, 2).map((r) => (
            <div className="demoListRow" key={r.id}>
              <div className="demoAvatar">{r.type[0]}</div>
              <div><strong>{r.title}</strong><span>{r.id}</span></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <div className="emptyIllust"><div className="emptyDoc" /><div className="emptyDoc shifted" /></div>
          <strong>등록된 문서가 없습니다</strong>
          <span>새 문서를 등록하면 여기 목록에 표시됩니다.</span>
          <button className="demoButton primary" type="button" onClick={() => setHasData(true)}>+ 새 문서 등록</button>
        </div>
      )}
    </div></div></div>
  );
}

function ToastDemo() {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);
  function push(kind, msg) {
    counter.current += 1;
    const id = counter.current;
    setToasts((l) => [...l, { id, kind, msg }]);
    setTimeout(() => setToasts((l) => l.filter((t) => t.id !== id)), 2600);
  }
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <div className="toastButtonRow">
        <button className="demoButton success" type="button" onClick={() => push("success", "문서가 저장되었습니다")}>저장 토스트</button>
        <button className="demoButton danger" type="button" onClick={() => push("error", "발송 실패: 수신자 미지정")}>에러 토스트</button>
        <button className="demoButton info" type="button" onClick={() => push("info", "검토 요청을 보냈습니다")}>알림 토스트</button>
      </div>
      <div className="toastZone" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div className={`toast toast-${t.kind}`} key={t.id} role="status">
            <span className="toastDot" /><span>{t.msg}</span>
          </div>
        ))}
      </div>
      <small className="demoHint">데모 영역 안에서 약 2.6초 뒤 자동 사라집니다.</small>
    </div></div></div>
  );
}

function PaginationDemo() {
  const pageSize = 4;
  const [page, setPage] = useState(1);
  const total = Math.ceil(sampleRows.length / pageSize);
  const visible = sampleRows.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <table className="demoTable">
        <thead><tr><th>문서번호</th><th>제목</th><th>상태</th></tr></thead>
        <tbody>{visible.map((r) => (<tr key={r.id}><td>{r.id}</td><td>{r.title}</td><td>{r.status}</td></tr>))}</tbody>
      </table>
      <div className="paginationBar">
        <button className="pageButton" type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>이전</button>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} type="button" className={`pageButton ${page === i + 1 ? "current" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
        ))}
        <button className="pageButton" type="button" disabled={page === total} onClick={() => setPage(page + 1)}>다음</button>
      </div>
      <small className="demoHint">전체 {sampleRows.length}건 / 페이지당 {pageSize}건</small>
    </div></div></div>
  );
}

function MicroDemo() {
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <div className="microGrid">
        <button className="liftCard" type="button"><strong>Hover Lift</strong><span>마우스 올리면 떠오릅니다</span></button>
        <button className="pressButton" type="button"><strong>Active Scale</strong><span>누르는 순간 줄어듭니다</span></button>
        <button className="rippleButton" type="button"><strong>Color Pulse</strong><span>호버 시 색 전환</span></button>
      </div>
    </div></div></div>
  );
}

function FocusDemo() {
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <small className="demoHint">아래 칸들에 마우스 말고 <strong>Tab 키</strong>로 이동해 보세요.</small>
      <div className="focusRow">
        <input className="focusInput" placeholder="문서번호" />
        <input className="focusInput" placeholder="제목" />
        <button className="focusButton" type="button">검색</button>
        <button className="focusButton" type="button">초기화</button>
      </div>
    </div></div></div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <button className="demoButton primary" type="button" onClick={() => setOpen(true)}>모달 열기</button>
      {open ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <header><strong>문서 삭제 확인</strong></header>
            <p>DOC-0001 RFI 문서를 삭제하시겠습니까?</p>
            <div className="modalActions">
              <button className="demoButton" type="button" onClick={() => setOpen(false)}>취소</button>
              <button className="demoButton danger" type="button" onClick={() => setOpen(false)}>삭제</button>
            </div>
          </div>
        </div>
      ) : null}
    </div></div></div>
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <button className="demoButton primary" type="button" onClick={() => setOpen(true)}>드로어 열기</button>
      <div className={`drawerStage ${open ? "open" : ""}`}>
        <div className="drawerScrim" onClick={() => setOpen(false)} />
        <aside className="drawerPanel">
          <header><strong>새 문서 등록</strong><button className="iconButton" type="button" onClick={() => setOpen(false)}>X</button></header>
          <div className="drawerForm">
            <label>문서번호 <input placeholder="DOC-AUTO" /></label>
            <label>제목 <input placeholder="문서 제목" /></label>
            <label>유형 <select><option>RFI</option><option>Submittal</option></select></label>
            <label>설명 <textarea rows={3} placeholder="설명" /></label>
          </div>
          <footer>
            <button className="demoButton" type="button" onClick={() => setOpen(false)}>취소</button>
            <button className="demoButton primary" type="button" onClick={() => setOpen(false)}>등록</button>
          </footer>
        </aside>
      </div>
    </div></div></div>
  );
}

function DarkModeDemo() {
  // 원본은 props 받음 — 본 사이트 통합 시 자체 state 로 단순화 (격리된 데모용)
  const [theme, setTheme] = useState('light');
  return (
    <div className="frontGuideShell" data-theme={theme}><div className="frontGuideDemo"><div className="demoStack">
      <button className="demoButton primary" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      </button>
      <div className="themePreview">
        <div className="themeSwatch swatch-bg">배경</div>
        <div className="themeSwatch swatch-surface">표면</div>
        <div className="themeSwatch swatch-text">텍스트</div>
        <div className="themeSwatch swatch-brand">브랜드</div>
      </div>
      <small className="demoHint">현재: <strong>{theme === "dark" ? "Dark" : "Light"}</strong></small>
    </div></div></div>
  );
}

function ZebraDemo() {
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <table className="demoTable zebra">
        <thead><tr><th>문서번호</th><th>제목</th><th>유형</th><th>상태</th></tr></thead>
        <tbody>{sampleRows.slice(0, 8).map((r) => (<tr key={r.id}><td>{r.id}</td><td>{r.title}</td><td>{r.type}</td><td>{r.status}</td></tr>))}</tbody>
      </table>
    </div></div></div>
  );
}

function SortDemo() {
  const [sortBy, setSortBy] = useState({ key: "id", dir: "asc" });
  function toggle(key) {
    setSortBy((c) => c.key !== key ? { key, dir: "asc" } : { key, dir: c.dir === "asc" ? "desc" : "asc" });
  }
  const sorted = useMemo(() => {
    const list = [...sampleRows.slice(0, 6)];
    list.sort((a, b) => {
      const x = a[sortBy.key], y = b[sortBy.key];
      if (x < y) return sortBy.dir === "asc" ? -1 : 1;
      if (x > y) return sortBy.dir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [sortBy]);
  const arrow = (k) => sortBy.key === k ? (sortBy.dir === "asc" ? " ▲" : " ▼") : "";
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <table className="demoTable zebra">
        <thead><tr>
          <th><button className="sortHead" type="button" onClick={() => toggle("id")}>문서번호{arrow("id")}</button></th>
          <th><button className="sortHead" type="button" onClick={() => toggle("title")}>제목{arrow("title")}</button></th>
          <th><button className="sortHead" type="button" onClick={() => toggle("type")}>유형{arrow("type")}</button></th>
          <th><button className="sortHead" type="button" onClick={() => toggle("status")}>상태{arrow("status")}</button></th>
        </tr></thead>
        <tbody>{sorted.map((r) => (<tr key={r.id}><td>{r.id}</td><td>{r.title}</td><td>{r.type}</td><td>{r.status}</td></tr>))}</tbody>
      </table>
    </div></div></div>
  );
}

function IconDemo() {
  return (
    <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">
      <div className="iconCompare">
        <div>
          <h3>텍스트 라벨만</h3>
          <ul className="navStubs"><li>대시보드</li><li>문서 대장</li><li>받은 문서함</li><li>발송장</li></ul>
        </div>
        <div>
          <h3>아이콘 + 라벨</h3>
          <ul className="navStubs withIcon">
            <li><span className="ico"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg></span>대시보드</li>
            <li><span className="ico"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h9l3 3v15H6z" /><path d="M9 8h6M9 12h6M9 16h4" /></svg></span>문서 대장</li>
            <li><span className="ico"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18v12H3z" /><path d="m3 7 9 7 9-7" /></svg></span>받은 문서함</li>
            <li><span className="ico"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-8-7 18-3-7z" /></svg></span>발송장</li>
          </ul>
        </div>
      </div>
    </div></div></div>
  );
}

export default {
  SkeletonDemo,
  EmptyStateDemo,
  ToastDemo,
  PaginationDemo,
  MicroDemo,
  FocusDemo,
  ModalDemo,
  DrawerDemo,
  DarkModeDemo,
  ZebraDemo,
  SortDemo,
  IconDemo,
};
