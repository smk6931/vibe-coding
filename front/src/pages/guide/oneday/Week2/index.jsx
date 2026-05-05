import { Link } from 'react-router-dom';
import GuideLayout from '../../GuideLayout';
import s from './Week2.module.css';

const TOPICS = [
  '프로필 사진 + 이름 + 상태메시지 섹션 만들기',
  '방문자카운터 — localStorage로 숫자 누적 저장',
  '숫자 카운터 애니메이션 (자릿수 표시)',
  'CSS 모듈로 컴포넌트 스타일 분리하는 법',
];

export default function Week2() {
  return (
    <GuideLayout>
      <div className={s.wrap}>
        <span className={s.badge}>오픈 예정</span>
        <h1 className={s.title}>2강 — 미니홈피 프로필 + 방문자카운터</h1>
        <p className={s.desc}>
          내 소개 페이지에 프로필과 방문자카운터를 추가합니다.
          localStorage를 처음 써보는 시간이에요.
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
          <Link to="/guide/oneday/week1" className={s.linkBtn}>← 1강 교안 먼저 보기</Link>
        </div>
      </div>
    </GuideLayout>
  );
}
