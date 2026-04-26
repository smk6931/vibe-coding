import { lazy } from 'react';

const GuideIndex    = lazy(() => import('../pages/guide/index'));
const OnedayInstall = lazy(() => import('../pages/guide/oneday/Install'));
const OnedayPreview = lazy(() => import('../pages/guide/oneday/Preview'));
const BeginnerIndex = lazy(() => import('../pages/guide/beginner/index'));
const ClaudeIndex   = lazy(() => import('../pages/guide/claude/index'));

export const guideRoutes = [
  { path: '/guide',                element: <GuideIndex /> },
  { path: '/guide/oneday/install', element: <OnedayInstall /> },
  { path: '/guide/oneday/preview', element: <OnedayPreview /> },
  { path: '/guide/beginner',       element: <BeginnerIndex /> },
  { path: '/guide/claude',         element: <ClaudeIndex /> },
];
