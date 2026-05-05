import { lazy } from 'react';

const GuideIndex     = lazy(() => import('../pages/guide/index'));
const OnedayInstall  = lazy(() => import('../pages/guide/oneday/Install'));
const OnedayDemo     = lazy(() => import('../pages/guide/oneday/Demo'));
const Week1          = lazy(() => import('../pages/guide/oneday/Week1'));
const Week2          = lazy(() => import('../pages/guide/oneday/Week2'));
const Week3          = lazy(() => import('../pages/guide/oneday/Week3'));
const Week4          = lazy(() => import('../pages/guide/oneday/Week4'));

export const guideRoutes = [
  { path: '/guide',                              element: <GuideIndex /> },
  { path: '/guide/oneday/install',               element: <OnedayInstall /> },
  { path: '/guide/oneday/demo',                  element: <OnedayDemo /> },
  { path: '/guide/oneday/week1',                 element: <Week1 /> },
  { path: '/guide/oneday/week2',                 element: <Week2 /> },
  { path: '/guide/oneday/week3',                 element: <Week3 /> },
  { path: '/guide/oneday/week4',                 element: <Week4 /> },
];
