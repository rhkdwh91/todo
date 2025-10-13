# Todo App (React + TypeScript)
## 실행 방법
- Requirements: Node vXX, PNPM/NPM/Yarn
- Install:
  `
  pnpm install`
- Dev:
  `
  pnpm dev
  ` (http://localhost:5173)
- Test:
  `
  pnpm test`
## 기술 스택 & 선택 이유
- React, TypeScript, (예: Zustand for state, Fetch API for HTTP)
- 스타일링: (예: CSS Modules)
- Mock API: (예: MSW / 커스텀 핸들러)
## 구조
- src/
- components/
- pages/
- hooks/
- store/
- api/
- mocks/handlers.ts
- types/todo.ts
- utils/
## 주요 설계/트레이드오프
- 완료 제약: 모든 참조 todo가 완료되어야 본 todo 완료 가능
- 삭제 정책: (예: 참조받는 todo가 있을 경우 경고/삭제 불가/일괄 해제 중
  택1)
- 페이지네이션: (예: 무한 스크롤 + 옵저버 방식)
## 가산점 구현
- [ ] 페이지네이션/무한 스크롤
- [ ] Mock API 연동
- [ ] 유닛 테스트
## 데모 계정/시연 방법
- 시연 시나리오: 생성 → 참조 추가 → 완료 제약 확인 → 수정/삭제 →
  페이지네이션