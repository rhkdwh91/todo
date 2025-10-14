import type { Todo } from '../types/todo';
import { getCurrentISODate } from '../utils/date';

const STORAGE_KEY = 'msw-todos';

export const getInitialTodos = (): Todo[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const now = getCurrentISODate();
  const initialTodos: Todo[] = [
    {
      id: '1',
      text: '프로젝트 기획서 작성',
      completed: true,
      createdAt: now,
      updatedAt: now,
      references: [],
    },
    {
      id: '2',
      text: 'UI 디자인 시안 제작',
      completed: true,
      createdAt: now,
      updatedAt: now,
      references: [],
    },
    {
      id: '3',
      text: 'API 명세서 작성',
      completed: true,
      createdAt: now,
      updatedAt: now,
      references: ['1'],
    },
    {
      id: '4',
      text: '데이터베이스 설계',
      completed: true,
      createdAt: now,
      updatedAt: now,
      references: ['1'],
    },
    {
      id: '5',
      text: 'API 개발',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['3', '4'],
    },
    {
      id: '6',
      text: '프론트엔드 개발',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['2'],
    },
    {
      id: '7',
      text: '사용자 인증 구현',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['5'],
    },
    {
      id: '8',
      text: '페이지네이션 구현',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['6'],
    },
    {
      id: '9',
      text: '검색 기능 구현',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['6'],
    },
    {
      id: '10',
      text: '필터링 기능 구현',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['6'],
    },
    {
      id: '11',
      text: '단위 테스트 작성',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['5', '6'],
    },
    {
      id: '12',
      text: '통합 테스트 작성',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['11'],
    },
    {
      id: '13',
      text: 'E2E 테스트 작성',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['12'],
    },
    {
      id: '14',
      text: '성능 최적화',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['6'],
    },
    {
      id: '15',
      text: 'SEO 최적화',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['6'],
    },
    {
      id: '16',
      text: '접근성 개선',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['6'],
    },
    {
      id: '17',
      text: '문서화 작성',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['5', '6'],
    },
    {
      id: '18',
      text: '배포 환경 설정',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: [],
    },
    {
      id: '19',
      text: 'CI/CD 파이프라인 구축',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['18'],
    },
    {
      id: '20',
      text: '모니터링 설정',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['18'],
    },
    {
      id: '21',
      text: '로깅 시스템 구축',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['18'],
    },
    {
      id: '22',
      text: '에러 트래킹 설정',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['18'],
    },
    {
      id: '23',
      text: '보안 검토',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['5', '6'],
    },
    {
      id: '24',
      text: '코드 리뷰',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['5', '6'],
    },
    {
      id: '25',
      text: '최종 배포',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['13', '19', '23', '24'],
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTodos));
  return initialTodos;
};

export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const getTodos = (): Todo[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : getInitialTodos();
};
