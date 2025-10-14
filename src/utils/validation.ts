import type { Todo } from '../types/todo';

export function canComplete(todo: Todo, allTodos: Todo[]): boolean {
  if (todo.references.length === 0) {
    return true;
  }

  return todo.references.every((refId) => {
    const referencedTodo = allTodos.find((t) => t.id === refId);
    return referencedTodo?.completed === true;
  });
}

export function removeReferenceFromTodos(todoIdToRemove: string, todos: Todo[]): Todo[] {
  return todos.map((todo) => ({
    ...todo,
    references: todo.references.filter((refId) => refId !== todoIdToRemove),
  }));
}

export function getTodosToUncomplete(todoId: string, allTodos: Todo[]): string[] {
  const collectDependents = (id: string, collected: Set<string> = new Set()): Set<string> => {
    const dependents = allTodos.filter(
      (todo) => todo.completed && todo.references.includes(id) && !collected.has(todo.id)
    );

    dependents.forEach((todo) => {
      collected.add(todo.id);
      collectDependents(todo.id, collected);
    });

    return collected;
  };

  return Array.from(collectDependents(todoId));
}
