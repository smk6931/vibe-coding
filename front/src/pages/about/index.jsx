import { Link } from 'react-router-dom';
import OperatorProfile from '../../components/operator/OperatorProfile';

export default function About() {
  return (
    <div>
      <OperatorProfile variant="section" />

      <div className="container-page py-8 sm:py-12 text-center">
        <Link to="/" className="btn-primary">모임 보러 가기</Link>
      </div>
    </div>
  );
}
