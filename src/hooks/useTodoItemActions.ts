import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../types/todo';
import { useUpdateTodo, useDeleteTodo, useBatchUpdateTodos } from './useTodos';
import { getTodosToUncomplete } from '../utils/validation';

interface UseTodoItemActionsProps {
  todo: Todo;
}

export const useTodoItemActions = ({ todo }: UseTodoItemActionsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editReferences, setEditReferences] = useState<string[]>(todo.references);

  const queryClient = useQueryClient();
  const updateTodo = useUpdateTodo();
  const batchUpdateTodos = useBatchUpdateTodos();
  const deleteTodo = useDeleteTodo();

  const cachedAll = queryClient.getQueryData<Todo[]>(['todos', 'all']) ?? [];

  const createUncompleteConfirmMessage = (todoIds: string[]): string => {
    return `이 할 일을 미완료로 변경하면 다음 할 일들도 미완료로 변경됩니다:\n${todoIds.map((id) => `@${id}`).join(', ')}\n\n계속하시겠습니까?`;
  };

  const handleUncomplete = async () => {
    const todosToUncomplete = getTodosToUncomplete(todo.id, cachedAll);

    if (todosToUncomplete.length > 0) {
      const confirmed = confirm(createUncompleteConfirmMessage(todosToUncomplete));
      if (!confirmed) return;

      batchUpdateTodos.mutate(
        [
          { id: todo.id, data: { completed: false } },
          ...todosToUncomplete.map((id) => ({ id, data: { completed: false } })),
        ],
        {
          onError: () => {
            alert('미완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
          },
        }
      );
    } else {
      updateTodo.mutate(
        {
          id: todo.id,
          data: { completed: false },
        },
        {
          onError: () => {
            alert('미완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
          },
        }
      );
    }
  };

  const handleComplete = () => {
    updateTodo.mutate(
      {
        id: todo.id,
        data: { completed: true },
      },
      {
        onError: () => {
          alert('완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
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

  const startEditing = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditReferences(todo.references);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditReferences(todo.references);
  };

  const saveEdit = () => {
    const trimmedText = editText.trim();
    if (!trimmedText) return;

    updateTodo.mutate(
      {
        id: todo.id,
        data: { text: trimmedText, references: editReferences },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: () => {
          alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteTodo.mutate(todo.id, {
        onError: () => {
          alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      });
    }
  };

  return {
    isEditing,
    editText,
    setEditText,
    editReferences,
    setEditReferences,
    handleToggle,
    startEditing,
    cancelEditing,
    saveEdit,
    handleDelete,
  };
};
