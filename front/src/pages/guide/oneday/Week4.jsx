import { Link } from 'react-router-dom';
import GuideLayout from '../GuideLayout';
import s from './Week4.module.css';

const TOPICS = [
  'Canvas로 별 파티클 애니메이션 추가하기',
  'CSS 변수로 테마 컬러 한 번에 바꾸기',
  'GitHub + Vercel 배포 — 내 URL 생성',
  '프로필·카드 내용 내 것으로 커스터마이징',
];

export default function Week4() {
  return (
    <GuideLayout>
      <div className={s.wrap}>
        <span className={s.badge}>오픈 예정</span>
        <h1 className={s.title}>4강 — 꾸미기 + 배포 완성</h1>
        <p className={s.desc}>
          별 파티클로 분위기를 살리고 내 색으로 꾸민 뒤, Vercel에 올려 실제 URL을 만듭니다.
          4주 완성의 마지막 강이에요.
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
