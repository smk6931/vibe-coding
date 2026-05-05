# 지식 용어 캡처 규칙

Keywords: docs/info, 개발 지식, 용어 설명, hero, seo, og, 백엔드 용어, 프론트엔드 용어, 강의 자료

AI 에이전트가 사용자에게 프론트엔드, 백엔드, 배포, 운영, 제품 용어를 설명했거나 사용자가 “이게 뭐냐”고 물어본 경우, 강의 자료로 재사용할 수 있는 지식은 `docs/info/`에 남긴다.

## 저장 대상

다음처럼 추후 강의나 운영 판단에 재사용할 수 있는 설명은 저장한다.

- 프론트엔드 용어: hero, CTA, SEO, OG, hydration, route, component, state
- 백엔드 용어: API, serializer, migration, ORM, auth, permission, transaction
- 배포 용어: Nginx, static hosting, proxy, domain, SSL, environment variable
- 제품/운영 용어: conversion, onboarding, funnel, refund policy, 신청 CTA

단순한 코드 한 줄 설명, 일회성 오류 메시지, 이미 문서화된 동일 설명은 중복 저장하지 않는다.

## 저장 위치

- 기본 폴더: `docs/info/`
- 프론트엔드 일반 용어: `docs/info/frontend-basics.md`
- 백엔드 일반 용어: `docs/info/backend-basics.md`
- 배포/인프라 용어: `docs/info/deploy-basics.md`
- 운영/마케팅 용어: `docs/info/operation-basics.md`

파일이 없으면 새로 만든다.

## 작성 형식

각 용어는 아래 순서로 짧게 정리한다.

```md
## 용어명

한 줄 정의.

보통 포함되는 것:
- 항목

이 프로젝트에서 중요한 이유:
- 이유

예시:

```text
간단 예시
```
```

## 작업 흐름

1. 사용자가 용어를 물어보면 먼저 대화에서 이해하기 쉽게 답한다.
2. 해당 설명이 재사용 가치가 있으면 `docs/info/`의 적절한 문서에 추가한다.
3. final 답변에 저장한 파일 경로를 짧게 알려준다.

