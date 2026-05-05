import { Link } from 'react-router-dom';
import GuideLayout from '../GuideLayout';
import s from './Week3.module.css';

const TOPICS = [
  '좋아하는 것 카드 — props로 데이터 넘기기',
  '다이어리 메모 — useState + localStorage 저장/불러오기',
  'Enter 키 제출, 글자 수 제한 UX',
  'grid 레이아웃으로 카드 2열 배치',
];

export default function Week3() {
  return (
    <GuideLayout>
      <div className={s.wrap}>
        <span className={s.badge}>오픈 예정</span>
        <h1 className={s.title}>3강 — 카드 + 다이어리</h1>
        <p className={s.desc}>
          좋아하는 것을 카드로 표현하고, 한 줄 다이어리 기능을 붙입니다.
          React의 상태(state)가 처음으로 진짜 쓸모 있어지는 시간이에요.
        </p>

        <div className={s.topicBox}>
          <p className={s.topicLabel}>이번 강에서 만들 것</p>
          <ul className={s.topicList}>
            {TOPICS.map((t, i) => (
              <li key={i} className={s.topicItem}>
                <span className={s.bullet}>▸</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className={s.linkRow}>
          <Link to="/events/evt-week1-2026-05-10" className={s.linkBtn}>← 1강 먼저 완료하기</Link>
        </div>
      </div>
    </GuideLayout>
  );
}
