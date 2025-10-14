import { describe, it, expect } from 'vitest';
import { canComplete, removeReferenceFromTodos, getTodosToUncomplete } from './validation';
import type { Todo } from '../types/todo';

const createTodo = (id: string, completed: boolean, references: string[] = []): Todo => ({
  id,
  text: `Todo ${id}`,
  completed,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  references,
});

describe('canComplete', () => {
  it('참조가 없으면 완료 가능해야 함', () => {
    const todo = createTodo('1', false);
    const allTodos: Todo[] = [];

    expect(canComplete(todo, allTodos)).toBe(true);
  });

  it('참조된 모든 할 일이 완료되면 완료 가능해야 함', () => {
    const todo = createTodo('3', false, ['1', '2']);
    const allTodos = [createTodo('1', true), createTodo('2', true), todo];

    expect(canComplete(todo, allTodos)).toBe(true);
  });

  it('참조된 할 일 중 일부가 미완료면 완료 불가능해야 함', () => {
    const todo = createTodo('3', false, ['1', '2']);
    const allTodos = [createTodo('1', true), createTodo('2', false), todo];

    expect(canComplete(todo, allTodos)).toBe(false);
  });

  it('참조된 할 일이 존재하지 않으면 완료 불가능해야 함', () => {
    const todo = createTodo('2', false, ['1']);
    const allTodos = [todo];

    expect(canComplete(todo, allTodos)).toBe(false);
  });
});

describe('removeReferenceFromTodos', () => {
  it('특정 할 일에 대한 참조를 제거해야 함', () => {
    const todos = [
      createTodo('1', false),
      createTodo('2', false, ['1']),
      createTodo('3', false, ['1', '2']),
    ];

    const result = removeReferenceFromTodos('1', todos);

    expect(result[1].references).toEqual([]);
    expect(result[2].references).toEqual(['2']);
  });

  it('해당 참조가 없는 할 일은 수정하지 않아야 함', () => {
    const todos = [createTodo('1', false), createTodo('2', false, ['3'])];

    const result = removeReferenceFromTodos('1', todos);

    expect(result[1].references).toEqual(['3']);
  });
});

describe('getTodosToUncomplete', () => {
  it('참조하는 할 일이 없으면 빈 배열을 반환해야 함', () => {
    const todos = [createTodo('1', true), createTodo('2', true), createTodo('3', false)];

    const result = getTodosToUncomplete('1', todos);

    expect(result).toEqual([]);
  });

  it('직접 참조하는 할 일을 반환해야 함', () => {
    const todos = [createTodo('1', true), createTodo('2', true, ['1']), createTodo('3', false)];

    const result = getTodosToUncomplete('1', todos);

    expect(result).toEqual(['2']);
  });

  it('중첩된 참조(cascade)도 모두 반환해야 함', () => {
    const todos = [
      createTodo('1', true),
      createTodo('2', true, ['1']),
      createTodo('3', true, ['2']),
      createTodo('4', true, ['3']),
    ];

    const result = getTodosToUncomplete('1', todos);

    expect(result).toContain('2');
    expect(result).toContain('3');
    expect(result).toContain('4');
  });

  it('완료된 할 일만 반환해야 함', () => {
    const todos = [
      createTodo('1', true),
      createTodo('2', true, ['1']),
      createTodo('3', false, ['2']),
    ];

    const result = getTodosToUncomplete('1', todos);

    expect(result).toEqual(['2']);
    expect(result).not.toContain('3');
  });
});
