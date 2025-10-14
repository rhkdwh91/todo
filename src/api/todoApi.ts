import { apiClient } from './client';
import type { Todo, PaginatedResponse, TodoFormData, TodoFilter } from '../types/todo';

export const todoApi = {
  getTodos: async (page: number, limit: number, filter: TodoFilter) => {
    const response = await apiClient.get<PaginatedResponse<Todo>>('/todos', {
      params: { page, limit, filter },
    });
    return response.data;
  },

  getAllTodos: async () => {
    const response = await apiClient.get<PaginatedResponse<Todo>>('/all-todos');
    return response.data;
  },

  createTodo: async (data: TodoFormData) => {
    const response = await apiClient.post<Todo>('/todos', data);
    return response.data;
  },

  updateTodo: async (id: string, data: Partial<Todo>) => {
    const response = await apiClient.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  batchUpdateTodos: async (updates: { id: string; data: Partial<Todo> }[]) => {
    const response = await apiClient.patch<Todo[]>('/todos/batch', { updates });
    return response.data;
  },

  deleteTodo: async (id: string) => {
    const response = await apiClient.delete(`/todos/${id}`);
    return response.data;
  },
};
