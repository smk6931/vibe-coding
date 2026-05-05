import { lazy } from 'react';

const InfoIndex      = lazy(() => import('../pages/info/index'));
const PatternsIndex  = lazy(() => import('../pages/info/front/patterns/index'));
const PatternDetail  = lazy(() => import('../pages/info/front/patterns/PatternDetail'));

export const infoRoutes = [
  { path: '/info',                              element: <InfoIndex /> },
  { path: '/info/front/patterns',               element: <PatternsIndex /> },
  { path: '/info/front/patterns/:tier/:id',     element: <PatternDetail /> },
];
