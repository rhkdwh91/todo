import { delay, http, HttpResponse } from 'msw';
import type { PaginatedResponse, Todo, TodoFormData } from '../types/todo';
import { getTodos, saveTodos } from './data';
import { getCurrentISODate } from '../utils/date';
import { removeReferenceFromTodos } from '../utils/validation';

const BASE_URL = '/api';

const getNextId = (todos: Todo[]): string => {
  if (todos.length === 0) return '1';
  const maxId = Math.max(...todos.map((todo) => parseInt(todo.id, 10)));
  return String(maxId + 1);
};

export const handlers = [
  http.get(`${BASE_URL}/todos`, async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const filter = url.searchParams.get('filter') || 'all';

    const allTodos = getTodos();
    let todos = allTodos;

    if (filter === 'active') {
      todos = todos.filter((todo) => !todo.completed);
    } else if (filter === 'completed') {
      todos = todos.filter((todo) => todo.completed);
    }

    const total = todos.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTodos = todos.slice(start, end).map((todo) => ({
      ...todo,
      canComplete: todo.references.every((refId) => {
        const referencedTodo = allTodos.find((t) => t.id === refId);
        return referencedTodo?.completed === true;
      }),
    }));

    const response: PaginatedResponse<Todo> = {
      data: paginatedTodos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/all-todos`, async () => {
    await delay(300);

    const allTodos = getTodos();

    return HttpResponse.json(allTodos);
  }),

  http.post(`${BASE_URL}/todos`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as TodoFormData;
    const todos = getTodos();

    const newTodo: Todo = {
      id: getNextId(todos),
      text: body.text,
      completed: false,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
      references: body.references || [],
    };

    todos.push(newTodo);
    saveTodos(todos);

    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.patch(`${BASE_URL}/todos/batch`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as { updates: { id: string; data: Partial<Todo> }[] };
    const todos = getTodos();
    const updatedTodos: Todo[] = [];

    body.updates.forEach(({ id, data }) => {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        todos[index] = {
          ...todos[index],
          ...data,
          updatedAt: getCurrentISODate(),
        };
        updatedTodos.push(todos[index]);
      }
    });

    saveTodos(todos);

    return HttpResponse.json(updatedTodos);
  }),

  http.patch(`${BASE_URL}/todos/:id`, async ({ request, params }) => {
    await delay(300);

    const { id } = params;
    const body = (await request.json()) as Partial<Todo>;
    const todos = getTodos();

    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    todos[index] = {
      ...todos[index],
      ...body,
      updatedAt: getCurrentISODate(),
    };

    saveTodos(todos);

    return HttpResponse.json(todos[index]);
  }),

  http.delete(`${BASE_URL}/todos/:id`, async ({ params }) => {
    await delay(300);

    const { id } = params as { id: string };
    let todos = getTodos();

    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    todos = todos.filter((todo) => todo.id !== id);
    todos = removeReferenceFromTodos(id, todos);

    saveTodos(todos);

    return HttpResponse.json({ success: true });
  }),
];
