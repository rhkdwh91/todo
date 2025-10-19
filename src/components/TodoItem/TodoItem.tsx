import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../../types/todo';
import { clsx } from 'clsx';
import { Checkbox } from '../common/Checkbox';
import { useUpdateTodo, useBatchUpdateTodos } from '../../hooks/useTodos';
import { getTodosToUncomplete } from '../../utils/validation';
import { TodoItemView } from './TodoItemView';
import { TodoItemEdit } from './TodoItemEdit';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const updateTodo = useUpdateTodo();
  const batchUpdateTodos = useBatchUpdateTodos();

  const cachedAll = queryClient.getQueryData<Todo[]>(['todos', 'all']) ?? [];

  const showErrorAlert = (action: string) => {
    alert(`${action} 중 오류가 발생했습니다. 다시 시도해주세요.`);
  };

  const handleUncomplete = () => {
    const todosToUncomplete = getTodosToUncomplete(todo.id, cachedAll);

    if (todosToUncomplete.length > 1) {
      const confirmed = confirm(
        `이 할 일을 미완료로 변경하면 다음 할 일들도 미완료로 변경됩니다:\n${todosToUncomplete.map((id) => `@${id}`).join(', ')}\n\n계속하시겠습니까?`
      );
      if (!confirmed) return;
    }

    const updates = [
      { id: todo.id, data: { completed: false } },
      ...todosToUncomplete.map((id) => ({ id, data: { completed: false } })),
    ];

    if (updates.length > 1) {
      batchUpdateTodos.mutate(updates, {
        onError: () => showErrorAlert('미완료 처리'),
      });
    } else {
      updateTodo.mutate(updates[0], {
        onError: () => showErrorAlert('미완료 처리'),
      });
    }
  };

  const handleComplete = () => {
    updateTodo.mutate(
      {
        id: todo.id,
        data: { completed: true },
      },
      {
        onError: () => showErrorAlert('완료 처리'),
      }
    );
  };

  const handleToggle = () => {
    if (!todo.canComplete) return;

    if (todo.completed) {
      handleUncomplete();
    } else {
      handleComplete();
    }
  };

  return (
    <div className={clsx(styles.item, todo.completed && styles.completed)}>
      <Checkbox
        checked={todo.completed}
        onChange={handleToggle}
        disabled={!todo.completed && !todo.canComplete}
      />

      <div className={styles.content}>
        {isEditing ? (
          <TodoItemEdit todo={todo} onCancel={() => setIsEditing(false)} />
        ) : (
          <TodoItemView todo={todo} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
};
