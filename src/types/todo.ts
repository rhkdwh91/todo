export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  references: string[];
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoFormData {
  text: string;
  references: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  allTodos: Todo[];
}
