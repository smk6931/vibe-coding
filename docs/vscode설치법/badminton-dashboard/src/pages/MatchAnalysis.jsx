import { useState } from 'react'

const initialMatches = [
  {
    id: 1,
    date: '2025-04-14',
    opponent: '한국체대',
    result: '승',
    score: '3-1',
    notes: [
      { time: '00:12', tag: '전략', text: '초반 백핸드 공략 효과적. 상대 오른쪽 약점 집중 공략.' },
      { time: '00:28', tag: '약점', text: '3세트 네트 앞 처리 불안정. 훈련 필요.' },
    ],
    stats: { smashWin: 14, smashFail: 4, serveFail: 3, rallyAvg: 8 },
  },
  {
    id: 2,
    date: '2025-04-07',
    opponent: '연세대',
    result: '패',
    score: '1-3',
    notes: [
      { time: '00:05', tag: '패인', text: '상대 롱 랠리에 체력 소진. 후반 집중력 저하.' },
    ],
    stats: { smashWin: 9, smashFail: 7, serveFail: 5, rallyAvg: 12 },
  },
]

const tagColors = {
  전략: 'bg-blue-900 text-blue-300',
  약점: 'bg-red-900 text-red-300',
  패인: 'bg-orange-900 text-orange-300',
  강점: 'bg-green-900 text-green-300',
  메모: 'bg-gray-800 text-gray-300',
}

function StatBadge({ label, value }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 text-center">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  )
}

export default function MatchAnalysis() {
  const [matches] = useState(initialMatches)
  const [selected, setSelected] = useState(matches[0])
  const [newNote, setNewNote] = useState({ time: '', tag: '메모', text: '' })
  const [notes, setNotes] = useState(
    Object.fromEntries(matches.map(m => [m.id, m.notes]))
  )

  function addNote() {
    if (!newNote.text.trim()) return
    setNotes(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { ...newNote }],
    }))
    setNewNote({ time: '', tag: '메모', text: '' })
  }

  const currentNotes = notes[selected.id] || []

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-white">경기 분석</h1>

      {/* 경기 목록 */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {matches.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border text-left transition ${
              selected.id === m.id
                ? 'border-green-500 bg-green-950'
                : 'border-gray-700 bg-gray-900 hover:border-gray-500'
            }`}
          >
            <p className="text-white font-semibold text-sm">vs {m.opponent}</p>
            <p className="text-gray-400 text-xs">{m.date} · {m.result} {m.score}</p>
          </button>
        ))}
      </div>

      {/* 선택된 경기 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">vs {selected.opponent}</h2>
            <p className="text-gray-400 text-sm">{selected.date}</p>
          </div>
          <span className={`text-lg font-bold px-4 py-1 rounded-full ${
            selected.result === '승' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
          }`}>
            {selected.result} {selected.score}
          </span>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBadge label="스매시 성공" value={selected.stats.smashWin} />
          <StatBadge label="스매시 실패" value={selected.stats.smashFail} />
          <StatBadge label="서브 실수" value={selected.stats.serveFail} />
          <StatBadge label="평균 랠리" value={`${selected.stats.rallyAvg}회`} />
        </div>

        {/* 노트 목록 */}
        <div>
          <h3 className="text-gray-300 font-semibold text-sm mb-3">경기 메모</h3>
          <div className="space-y-2">
            {currentNotes.map((n, i) => (
              <div key={i} className="bg-gray-800 rounded-lg px-4 py-3 flex gap-3 items-start">
                {n.time && <span className="text-gray-500 text-xs mt-0.5 w-10 flex-shrink-0">{n.time}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${tagColors[n.tag] || tagColors['메모']}`}>
                  {n.tag}
                </span>
                <p className="text-gray-200 text-sm">{n.text}</p>
              </div>
            ))}
            {currentNotes.length === 0 && (
              <p className="text-gray-600 text-sm">아직 메모가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 노트 추가 */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <h3 className="text-gray-300 font-semibold text-sm">메모 추가</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="타임스탬프 (예: 00:45)"
              value={newNote.time}
              onChange={e => setNewNote(p => ({ ...p, time: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 w-36"
            />
            <select
              value={newNote.tag}
              onChange={e => setNewNote(p => ({ ...p, tag: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {Object.keys(tagColors).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="메모 내용을 입력하세요..."
              value={newNote.text}
              onChange={e => setNewNote(p => ({ ...p, text: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addNote()}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500"
            />
            <button
              onClick={addNote}
              className="bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              추가
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
