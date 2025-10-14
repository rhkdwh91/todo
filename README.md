# Todo App (React + TypeScript)

## 실행 방법
- Requirements: Node v22.12+, NPM
- Install:
  ```
  npm install
  npx playwright install  # E2E 테스트용 브라우저 설치
  ```
- Dev:
  ```
  npm run dev
  ```
  (http://localhost:5173)
- Test:
  ```
  npm run test        # 유닛 테스트 (Vitest)
  npm run test:e2e    # E2E 테스트 (Playwright)
  ```

## 기술 스택 & 선택 이유
- **React 19.1.1, TypeScript**: 최신 React와 타입 안정성
- **@tanstack/react-query**: 서버 상태 관리 및 Optimistic Updates
- **스타일링**: CSS Modules (컴포넌트 스코프 스타일)
- **Mock API**: MSW (Mock Service Worker) + LocalStorage 영속성
- **날짜**: dayjs (한국어 로케일 및 가벼움)
- **테스팅**: Vitest (유닛), Playwright (E2E)

## 구조
```
src/
├── components/
│   ├── common/          # Button, Input, Checkbox, Select
│   ├── TodoForm/        # 할 일 생성 폼
│   ├── TodoItem/        # 할 일 항목
│   ├── TodoList/        # 할 일 목록
│   ├── TodoFilter/      # 필터 버튼
│   └── Pagination/      # 페이지네이션
├── pages/
│   └── HomePage/        # 메인 페이지
├── hooks/
│   └── useTodos.ts      # React Query 훅
├── mocks/
│   ├── browser.ts       # MSW worker
│   ├── handlers.ts      # API 핸들러
│   └── data.ts          # 초기 데이터
├── types/
│   └── todo.ts          # Todo, PaginatedResponse
└── utils/
    ├── validation.ts    # 참조 검증
    └── date.ts          # 날짜 포맷팅

e2e/
└── todo.spec.ts         # E2E 테스트
```

## 주요 설계/트레이드오프

### 완료 제약
- 모든 참조 todo가 완료되어야 본 todo 완료 가능
- `canComplete()` 함수로 검증
- 체크박스 disabled 처리로 UI에 반영

### 삭제 정책
- 참조받는 todo가 있어도 삭제 가능
- 삭제 시 다른 todo의 참조에서 자동으로 제거
- `removeReferenceFromTodos()` 유틸 함수 사용

### 미완료 변경시 참조된 할 일 처리
- 할 일을 미완료로 변경 시, 이를 참조하는 모든 완료된 할 일도 미완료로 변경
- `getTodosToUncomplete()` - 참조하는 할 일 찾기
- Batch Update API로 한 번에 처리
- 사용자 확인 컨펌 창 표시

### 페이지네이션
- 전통적인 페이지 버튼 방식
- 페이지당 10개 항목
- MSW에서 slice로 구현

### ID 생성
- 순차적 ID (max + 1) 방식
- 간단하고 예측 가능

### Optimistic Updates
- React Query의 `onMutate`/`onError`/`onSettled` 활용
- 체크박스 클릭 시 즉시 UI 업데이트 + 관련 todo들의 `canComplete` 재계산
- 에러 시 자동 롤백

## 가산점 구현
- [x] 페이지네이션 (페이지 버튼)
- [x] Mock API 연동 (MSW + LocalStorage)
- [x] 유닛 테스트 (30개 - Vitest)