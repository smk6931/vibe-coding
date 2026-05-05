/**
 * Tier2Demos — 19개 운영 수준 패턴.
 * source/Tier2.jsx 통째 이전. 각 데모는 .frontGuideShell wrapper 로 격리.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { sampleRows, recipients } from './_data';
import './patterns.css';

const Shell = ({ children }) => (
  <div className="frontGuideShell"><div className="frontGuideDemo"><div className="demoStack">{children}</div></div></div>
);

function FilterChipsDemo() {
  const [filters, setFilters] = useState({ status: "결재중", discipline: "토목", period: "4월" });
  const remove = (key) => setFilters((f) => { const next = { ...f }; delete next[key]; return next; });
  const reset = () => setFilters({ status: "결재중", discipline: "토목", period: "4월" });
  const labels = { status: "상태", discipline: "공종", period: "기간" };
  const entries = Object.entries(filters);
  return (
    <Shell>
      <div className="filterChipRow">
        {entries.length === 0 ? <span className="demoHint">적용된 필터 없음</span> : entries.map(([k, v]) => (
          <span className="chip" key={k}>
            <span className="chipKey">{labels[k]}</span>
            <span>{v}</span>
            <button type="button" aria-label={`${labels[k]} 필터 제거`} onClick={() => remove(k)}>×</button>
          </span>
        ))}
      </div>
      <button className="demoButton" type="button" onClick={reset}>전체 다시 적용</button>
      <small className="demoHint">필터 상태는 객체 하나. 칩은 그 객체를 시각화한 결과물.</small>
    </Shell>
  );
}

function ComboboxDemo() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);
  const filtered = recipients.filter((r) => r.toLowerCase().includes(debounced.toLowerCase())).slice(0, 6);
  return (
    <Shell>
      <div className="comboboxWrap">
        <input className="focusInput full" placeholder="수신자 검색 (예: 김, 현대, PM)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)} />
        {open && filtered.length > 0 && (
          <ul className="comboboxList">
            {filtered.map((r) => (
              <li key={r}><button type="button" onClick={() => { setSelected(r); setQuery(r); setOpen(false); }}>{r}</button></li>
            ))}
          </ul>
        )}
      </div>
      {selected && <div className="selectedHint">선택됨: <strong>{selected}</strong></div>}
      <small className="demoHint">300ms debounce 적용. 실 서비스에서는 이 시점에 서버 API 호출.</small>
    </Shell>
  );
}

function DateRangeDemo() {
  const [start, setStart] = useState("2026-04-01");
  const [end, setEnd] = useState("2026-04-30");
  const days = Math.max(0, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
  return (
    <Shell>
      <div className="dateRangeRow">
        <label>시작일 <input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <span className="rangeArrow">→</span>
        <label>종료일 <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      </div>
      <div className="rangeQuick">
        <button className="demoButton" type="button" onClick={() => { const d = new Date(); setEnd(d.toISOString().slice(0, 10)); d.setDate(d.getDate() - 7); setStart(d.toISOString().slice(0, 10)); }}>최근 7일</button>
        <button className="demoButton" type="button" onClick={() => { const d = new Date(); setEnd(d.toISOString().slice(0, 10)); d.setDate(d.getDate() - 30); setStart(d.toISOString().slice(0, 10)); }}>최근 30일</button>
      </div>
      <small className="demoHint">선택 범위: <strong>{days}일</strong></small>
    </Shell>
  );
}

function BulkActionDemo() {
  const [selected, setSelected] = useState(new Set());
  const allChecked = selected.size === sampleRows.length;
  const someChecked = selected.size > 0 && !allChecked;
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(sampleRows.map((r) => r.id)));
  const toggle = (id) => setSelected((s) => { const next = new Set(s); next.has(id) ? next.delete(id) : next.add(id); return next; });
  return (
    <Shell>
      {selected.size > 0 && (
        <div className="bulkActionBar">
          <strong>{selected.size}건 선택됨</strong>
          <div className="bulkActions">
            <button type="button">일괄 발송</button>
            <button type="button">일괄 승인</button>
            <button type="button" className="danger">일괄 삭제</button>
          </div>
          <button type="button" className="bulkClear" onClick={() => setSelected(new Set())}>선택 해제</button>
        </div>
      )}
      <table className="demoTable selectableTable">
        <thead><tr>
          <th><input type="checkbox" checked={allChecked} ref={(el) => { if (el) el.indeterminate = someChecked; }} onChange={toggleAll} /></th>
          <th>문서번호</th><th>제목</th><th>상태</th>
        </tr></thead>
        <tbody>
          {sampleRows.slice(0, 6).map((r) => (
            <tr key={r.id} className={selected.has(r.id) ? "rowSelected" : ""}>
              <td><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} /></td>
              <td>{r.id}</td><td>{r.title}</td><td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small className="demoHint">헤더 체크박스의 <strong>3 상태</strong>: 미선택 / 일부 선택(─) / 전체 선택</small>
    </Shell>
  );
}

function StickyBarDemo() {
  return (
    <Shell>
      <div className="stickyDemoFrame">
        <div className="stickyBar">상단 고정 액션 바: 스크롤해도 항상 화면 위에 유지</div>
        <div className="stickyContent">
          {sampleRows.concat(sampleRows).map((r, i) => (
            <div className="stickyRow" key={i}>{r.id} · {r.title}</div>
          ))}
        </div>
      </div>
      <small className="demoHint">데모 박스 안을 스크롤하면 노란 바가 따라옵니다 (position: sticky).</small>
    </Shell>
  );
}

function InlineEditDemo() {
  const [rows, setRows] = useState(sampleRows.slice(0, 4).map((r) => ({ ...r })));
  const [editing, setEditing] = useState(null);
  function save(id, field, value) {
    setRows((rs) => rs.map((r) => r.id === id ? { ...r, [field]: value } : r));
    setEditing(null);
  }
  return (
    <Shell>
      <table className="demoTable">
        <thead><tr><th>문서번호</th><th>제목 (클릭하여 편집)</th><th>우선순위 (클릭하여 편집)</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>
                {editing === `${r.id}-title` ? (
                  <input autoFocus className="inlineInput" defaultValue={r.title}
                    onBlur={(e) => save(r.id, "title", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && save(r.id, "title", e.currentTarget.value)} />
                ) : (
                  <span className="inlineCell" onClick={() => setEditing(`${r.id}-title`)}>{r.title}<span className="editPen">✎</span></span>
                )}
              </td>
              <td>
                {editing === `${r.id}-priority` ? (
                  <select autoFocus className="inlineInput" defaultValue={r.priority}
                    onBlur={(e) => save(r.id, "priority", e.target.value)}>
                    <option>Low</option><option>Normal</option><option>High</option><option>Critical</option>
                  </select>
                ) : (
                  <span className="inlineCell" onClick={() => setEditing(`${r.id}-priority`)}>{r.priority}<span className="editPen">✎</span></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <small className="demoHint">셀 클릭 → 인풋으로 변신 → Enter/Tab/포커스 아웃 시 저장.</small>
    </Shell>
  );
}

function ConfirmDemo() {
  const [variant, setVariant] = useState(null);
  const [typed, setTyped] = useState("");
  function close() { setVariant(null); setTyped(""); }
  return (
    <Shell>
      <div className="toastButtonRow">
        <button className="demoButton" type="button" onClick={() => setVariant("low")}>가벼운 확인</button>
        <button className="demoButton info" type="button" onClick={() => setVariant("mid")}>일반 확인</button>
        <button className="demoButton danger" type="button" onClick={() => setVariant("high")}>고위험 확인</button>
      </div>
      {variant && (
        <div className="modalBackdrop" onClick={close}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <header><strong>{variant === "high" ? "프로젝트 영구 삭제" : variant === "mid" ? "문서 반려 확인" : "임시 저장"}</strong></header>
            <p>
              {variant === "high" && "이 작업은 되돌릴 수 없습니다. 계속하려면 'PRJ01-DELETE' 를 입력하세요."}
              {variant === "mid" && "선택한 문서를 반려하시겠습니까?"}
              {variant === "low" && "현재 작성 내용을 임시 저장합니다."}
            </p>
            {variant === "high" && (
              <input className="focusInput full" placeholder="PRJ01-DELETE 입력" value={typed} onChange={(e) => setTyped(e.target.value)} />
            )}
            <div className="modalActions">
              <button className="demoButton" type="button" onClick={close}>취소</button>
              <button className={`demoButton ${variant === "high" ? "danger" : "primary"}`} type="button"
                disabled={variant === "high" && typed !== "PRJ01-DELETE"} onClick={close}>
                {variant === "high" ? "영구 삭제" : variant === "mid" ? "반려" : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
      <small className="demoHint">위험도에 따라 3가지 변형. 고위험은 GitHub 레포 삭제 방식.</small>
    </Shell>
  );
}

function UndoSnackbarDemo() {
  const [items, setItems] = useState(sampleRows.slice(0, 4));
  const [trash, setTrash] = useState(null);
  const timerRef = useRef(null);
  function remove(id) {
    const removed = items.find((r) => r.id === id);
    setItems((rs) => rs.filter((r) => r.id !== id));
    setTrash(removed);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTrash(null), 5000);
  }
  function undo() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setItems((rs) => [trash, ...rs]);
    setTrash(null);
  }
  return (
    <Shell>
      <div className="demoList">
        {items.length === 0 ? <span className="demoHint">모두 삭제됨</span> : items.map((r) => (
          <div className="demoListRow" key={r.id}>
            <div className="demoAvatar">{r.type[0]}</div>
            <div style={{ flex: 1 }}><strong>{r.title}</strong><span>{r.id}</span></div>
            <button className="demoButton danger" type="button" onClick={() => remove(r.id)}>삭제</button>
          </div>
        ))}
      </div>
      {trash && (
        <div className="undoSnack" role="status">
          <span><strong>{trash.id}</strong> 삭제됨</span>
          <button type="button" onClick={undo}>되돌리기</button>
        </div>
      )}
      <small className="demoHint">5초 안에 [되돌리기] 누르면 복원. Gmail 전송 취소와 같은 패턴.</small>
    </Shell>
  );
}

function OptimisticDemo() {
  const [rows, setRows] = useState(sampleRows.slice(0, 3).map((r) => ({ ...r })));
  const [pending, setPending] = useState(new Set());
  function approve(id) {
    const prev = rows.find((r) => r.id === id);
    setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: "승인" } : r));
    setPending((s) => new Set(s).add(id));
    setTimeout(() => {
      const success = Math.random() > 0.4;
      setPending((s) => { const next = new Set(s); next.delete(id); return next; });
      if (!success) {
        setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: prev.status, failed: true } : r));
        setTimeout(() => setRows((rs) => rs.map((r) => r.id === id ? { ...r, failed: false } : r)), 2500);
      }
    }, 800);
  }
  return (
    <Shell>
      <div className="demoList">
        {rows.map((r) => (
          <div className={`demoListRow ${r.failed ? "failedRow" : ""}`} key={r.id}>
            <div className="demoAvatar">{r.type[0]}</div>
            <div style={{ flex: 1 }}>
              <strong>{r.title}</strong>
              <span>상태: {r.status}{pending.has(r.id) && " · 동기화 중..."}{r.failed && " · 실패! 원복됨"}</span>
            </div>
            <button className="demoButton primary" type="button" disabled={pending.has(r.id) || r.status === "승인"} onClick={() => approve(r.id)}>승인</button>
          </div>
        ))}
      </div>
      <small className="demoHint">UI는 즉시 "승인" 표시 → 800ms 후 60% 확률로 성공. 실패 시 원복 + 빨간 표시.</small>
    </Shell>
  );
}

function TabsDemo() {
  const [tab, setTab] = useState("overview");
  return (
    <Shell>
      <div className="tabBar" role="tablist">
        {[["overview", "개요"], ["history", "Rev/Ver"], ["files", "첨부"], ["audit", "Audit"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="tabPanel" role="tabpanel">
        {tab === "overview" && <p>DOC-0001 RFI 토목 옹벽 철근 간격 문의. 결재중 / 우선순위 High.</p>}
        {tab === "history" && <p>Rev.A → Rev.B (2026-04-15) → Rev.C (2026-04-22) 3건의 개정 이력.</p>}
        {tab === "files" && <p>RFI_001_Question.pdf (1.2MB), Drawing_Reference.dwg (3.4MB)</p>}
        {tab === "audit" && <p>김PM 열람 (2026-04-29 14:32), 이공무 다운로드 (2026-04-30 09:15)</p>}
      </div>
    </Shell>
  );
}

function SegmentedDemo() {
  const [view, setView] = useState("list");
  return (
    <Shell>
      <div className="segmented">
        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>목록</button>
        <button className={view === "card" ? "active" : ""} onClick={() => setView("card")}>카드</button>
        <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}>칸반</button>
      </div>
      <div className="segmentedView">
        {view === "list" && sampleRows.slice(0, 3).map((r) => <div key={r.id} className="segListItem">{r.id} · {r.title}</div>)}
        {view === "card" && <div className="segCardGrid">{sampleRows.slice(0, 3).map((r) => <div key={r.id} className="segCard"><strong>{r.id}</strong><span>{r.title}</span></div>)}</div>}
        {view === "kanban" && <div className="segCardGrid">{["작성중", "결재중", "승인"].map((s) => <div key={s} className="segCard"><strong>{s}</strong><span>{sampleRows.filter((r) => r.status === s).length}건</span></div>)}</div>}
      </div>
      <small className="demoHint">Tabs는 콘텐츠가 다름 / Segmented는 같은 콘텐츠의 표시 방식만 변경.</small>
    </Shell>
  );
}

function StepperDemo() {
  const [step, setStep] = useState(0);
  const steps = ["문서 정보", "첨부파일", "수신자", "확인"];
  return (
    <Shell>
      <ol className="stepperBar">
        {steps.map((s, i) => (
          <li key={s} className={`${i < step ? "done" : ""} ${i === step ? "current" : ""}`}>
            <span className="stepNum">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <div className="stepBody">
        <strong>현재 단계: {steps[step]}</strong>
        <p>{step === 0 ? "문서번호, 제목, 유형 입력" : step === 1 ? "PDF / DWG 파일 업로드" : step === 2 ? "수신자 회사·담당자 선택" : "최종 검토 후 등록"}</p>
      </div>
      <div className="stepNav">
        <button className="demoButton" type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>이전</button>
        <button className="demoButton primary" type="button" disabled={step === 3} onClick={() => setStep(step + 1)}>{step === 3 ? "완료" : "다음"}</button>
      </div>
    </Shell>
  );
}

function MasterDetailDemo() {
  const [selected, setSelected] = useState(sampleRows[0].id);
  const doc = sampleRows.find((r) => r.id === selected);
  return (
    <Shell>
      <div className="masterDetail">
        <div className="masterList">
          {sampleRows.slice(0, 5).map((r) => (
            <button key={r.id} className={`masterItem ${selected === r.id ? "active" : ""}`} onClick={() => setSelected(r.id)}>
              <strong>{r.id}</strong><span>{r.title}</span>
            </button>
          ))}
        </div>
        <div className="detailPane">
          <h3>{doc.title}</h3>
          <p>유형: {doc.type} / 상태: {doc.status} / 우선순위: {doc.priority}</p>
        </div>
      </div>
    </Shell>
  );
}

function TooltipDemo() {
  return (
    <Shell>
      <div className="tooltipDemo">
        <span className="hasTooltip" data-tooltip="검토 요청을 보낸 상태입니다">
          <span className="statusBadge inreview">검토중</span>
        </span>
        <span className="hasTooltip" data-tooltip="결재선 진행 중. 1/3 단계">
          <span className="statusBadge inapproval">결재중</span>
        </span>
        <span className="hasTooltip" data-tooltip="최종 승인 완료된 문서입니다">
          <span className="statusBadge approved">승인</span>
        </span>
      </div>
      <small className="demoHint">상태 뱃지에 마우스를 올려보세요. 작은 텍스트 풍선만 — 인터랙션 없음.</small>
    </Shell>
  );
}

function PopoverDemo() {
  const [openId, setOpenId] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpenId(null); }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  const users = [{ id: "u1", name: "김PM", role: "프로젝트 매니저", company: "현대건설" }, { id: "u2", name: "이공무", role: "공무 담당", company: "현대건설" }];
  return (
    <Shell>
      <div className="popoverWrap" ref={ref}>
        {users.map((u) => (
          <div className="popoverAnchor" key={u.id}>
            <button type="button" className="avatarBtn" onClick={() => setOpenId(openId === u.id ? null : u.id)}>
              {u.name[0]}
            </button>
            {openId === u.id && (
              <div className="popoverBox">
                <strong>{u.name}</strong>
                <p>{u.role}<br />{u.company}</p>
                <div className="popoverActions">
                  <button className="demoButton" type="button">메시지</button>
                  <button className="demoButton primary" type="button">프로필 보기</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <small className="demoHint">아바타 클릭 → 미니 카드 + 액션 버튼. 툴팁과 달리 클릭으로 열고 액션 가능.</small>
    </Shell>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(""); setActive(0); }
  }, [open]);

  const commands = [
    ...sampleRows.slice(0, 8).map((r) => ({ kind: "doc", label: `${r.id} · ${r.title}`, hint: "문서 열기" })),
    { kind: "action", label: "새 문서 등록", hint: "Ctrl+N" },
    { kind: "action", label: "발송장 작성", hint: "Transmittal" },
    { kind: "action", label: "관리자 설정", hint: "Admin" }
  ];
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter") { setOpen(false); }
  }
  return (
    <Shell>
      <button className="demoButton primary" type="button" onClick={() => setOpen(true)}>Ctrl + K (또는 클릭)</button>
      {open && (
        <div className="cmdBackdrop" onClick={() => setOpen(false)}>
          <div className="cmdPalette" onClick={(e) => e.stopPropagation()}>
            <input ref={inputRef} className="cmdInput" placeholder="명령 또는 문서 검색..."
              value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }} onKeyDown={onKeyDown} />
            <ul className="cmdList">
              {filtered.length === 0 && <li className="cmdEmpty">결과 없음</li>}
              {filtered.map((c, i) => (
                <li key={i} className={`cmdItem ${i === active ? "active" : ""}`}>
                  <span className={`cmdKind cmd-${c.kind}`}>{c.kind === "doc" ? "DOC" : "ACT"}</span>
                  <span className="cmdLabel">{c.label}</span>
                  <span className="cmdHint">{c.hint}</span>
                </li>
              ))}
            </ul>
            <div className="cmdFooter">
              <kbd>↑↓</kbd> 이동 <kbd>Enter</kbd> 선택 <kbd>Esc</kbd> 닫기
            </div>
          </div>
        </div>
      )}
      <small className="demoHint">키보드 5초만에 모든 기능 접근 — Linear / Notion 스타일.</small>
    </Shell>
  );
}

function VirtualListDemo() {
  const total = 1000;
  const rowHeight = 32;
  const viewHeight = 220;
  const [scrollTop, setScrollTop] = useState(0);
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - 3);
  const visibleCount = Math.ceil(viewHeight / rowHeight) + 6;
  const endIdx = Math.min(total, startIdx + visibleCount);
  const rendered = [];
  for (let i = startIdx; i < endIdx; i++) {
    const r = sampleRows[i % sampleRows.length];
    rendered.push(
      <div key={i} className="virtRow" style={{ position: "absolute", top: i * rowHeight, height: rowHeight, left: 0, right: 0 }}>
        <span className="virtNum">#{i + 1}</span> {r.id} · {r.title}
      </div>
    );
  }
  return (
    <Shell>
      <div className="virtFrame" style={{ height: viewHeight }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
        <div style={{ height: total * rowHeight, position: "relative" }}>{rendered}</div>
      </div>
      <small className="demoHint">전체 {total}건. 실제 DOM에는 ~{visibleCount}개만. 스크롤 위치에 따라 동적 교체.</small>
    </Shell>
  );
}

function DebounceDemo() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [callCount, setCallCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query);
      setCallCount((c) => c + 1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);
  return (
    <Shell>
      <input className="focusInput full" placeholder="여기에 빠르게 타이핑하세요" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="debounceStats">
        <div><span>입력값:</span><strong>{query || "(빈 값)"}</strong></div>
        <div><span>API 호출값 (400ms 후):</span><strong>{debounced || "(아직)"}</strong></div>
        <div><span>API 호출 횟수:</span><strong>{callCount}회</strong></div>
      </div>
      <small className="demoHint">debounce 없으면 키 한 번마다 호출. 400ms 멈췄을 때만 마지막 1번.</small>
    </Shell>
  );
}

function LazyImageDemo() {
  const placeholders = [
    "https://placehold.co/400x180/0f766e/ffffff?text=Drawing+A-101",
    "https://placehold.co/400x180/2563eb/ffffff?text=Site+Photo+1",
    "https://placehold.co/400x180/b45309/ffffff?text=Site+Photo+2",
    "https://placehold.co/400x180/15803d/ffffff?text=Inspection",
    "https://placehold.co/400x180/b91c1c/ffffff?text=NCR+Photo",
    "https://placehold.co/400x180/6d28d9/ffffff?text=As-Built"
  ];
  return (
    <Shell>
      <div className="lazyGrid">
        {placeholders.concat(placeholders).map((src, i) => (
          <img key={i} src={src} loading="lazy" alt={`도면 미리보기 ${i + 1}`} />
        ))}
      </div>
      <small className="demoHint">img 태그에 <code>loading="lazy"</code> — 화면 진입 직전에 로드. 네트워크 탭에서 스크롤하면 차례대로 요청.</small>
    </Shell>
  );
}

export default {
  FilterChipsDemo,
  ComboboxDemo,
  DateRangeDemo,
  BulkActionDemo,
  StickyBarDemo,
  InlineEditDemo,
  ConfirmDemo,
  UndoSnackbarDemo,
  OptimisticDemo,
  TabsDemo,
  SegmentedDemo,
  StepperDemo,
  MasterDetailDemo,
  TooltipDemo,
  PopoverDemo,
  CommandPaletteDemo,
  VirtualListDemo,
  DebounceDemo,
  LazyImageDemo,
};
