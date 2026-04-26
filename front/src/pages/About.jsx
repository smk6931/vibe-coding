import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container-page py-10">
      <h1 className="page-title mb-4">바이브 세션이란</h1>
      <p className="text-slate-600 text-sm leading-relaxed mb-6">
        바이브코딩 · AI 도구로 실제 프로젝트를 만드는 소수정예 오프라인 모임입니다.
      </p>
      <Link to="/" className="btn-primary">모임 보러 가기</Link>
    </div>
  );
}
