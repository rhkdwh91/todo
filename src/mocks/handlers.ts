import { http, HttpResponse, delay } from 'msw';
import type { Todo, PaginatedResponse, TodoFormData } from '../types/todo';
import { getTodos, saveTodos } from './data';
import { getCurrentISODate } from '../utils/date';
import { removeReferenceFromTodos } from '../utils/validation';

const BASE_URL = '/api';

export const handlers = [
  http.get(`${BASE_URL}/todos`, async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const filter = url.searchParams.get('filter') || 'all';

    let todos = getTodos();

    if (filter === 'active') {
      todos = todos.filter((todo) => !todo.completed);
    } else if (filter === 'completed') {
      todos = todos.filter((todo) => todo.completed);
    }

    const total = todos.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTodos = todos.slice(start, end);

    const response: PaginatedResponse<Todo> = {
      data: paginatedTodos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return HttpResponse.json(response);
  }),

  http.post(`${BASE_URL}/todos`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as TodoFormData;
    const todos = getTodos();

    const newTodo: Todo = {
      id: String(Date.now()),
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
