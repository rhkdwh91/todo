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
      text: 'API 개발',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['1'],
    },
    {
      id: '4',
      text: '프론트엔드 개발',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['2'],
    },
    {
      id: '5',
      text: '통합 테스트',
      completed: false,
      createdAt: now,
      updatedAt: now,
      references: ['3', '4'],
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
