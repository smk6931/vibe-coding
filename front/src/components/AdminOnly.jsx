import { useRole } from '../lib/RoleContext';

/**
 * AdminOnly — children 을 admin role 일 때만 렌더.
 *
 * 사용:
 *   <AdminOnly><EditButton /></AdminOnly>
 *   <AdminOnly fallback={<LoginPrompt />}>...</AdminOnly>
 *
 * Phase 0 한정 가드 — role 은 localStorage 토글이라 진짜 인증이 아니다.
 * 백엔드/JWT 도입(Phase 1+) 시 이 컴포넌트 내부만 교체하면 호출부 무수정.
 */
export default function AdminOnly({ children, fallback = null }) {
  const { role } = useRole();
  if (role !== 'admin') return fallback;
  return children;
}

/** dev 환경에서만 렌더 (Vite dev 미들웨어 의존 컴포넌트용) */
export function DevOnly({ children, fallback = null }) {
  if (!import.meta.env.DEV) return fallback;
  return children;
}

/** admin AND dev 동시 만족할 때만 렌더 (CRUD 액션 진입점에 권장) */
export function AdminDevOnly({ children, fallback = null }) {
  const { role } = useRole();
  if (!import.meta.env.DEV) return fallback;
  if (role !== 'admin') return fallback;
  return children;
}
