import { lazy } from 'react';

const CommunityIndex   = lazy(() => import('../pages/community/index'));
const CommunityBoard   = lazy(() => import('../pages/community/board'));
const CommunityMembers = lazy(() => import('../pages/community/members'));
const CommunityQA      = lazy(() => import('../pages/community/qa'));

export const communityRoutes = [
  { path: '/community',         element: <CommunityIndex /> },
  { path: '/community/board',   element: <CommunityBoard /> },
  { path: '/community/members', element: <CommunityMembers /> },
  { path: '/community/qa',      element: <CommunityQA /> },
];
