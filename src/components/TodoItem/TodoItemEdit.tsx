import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../../types/todo';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useUpdateTodo } from '../../hooks/useTodos';
import styles from './TodoItem.module.css';

interface TodoItemEditProps {
  todo: Todo;
  onCancel: () => void;
}

const showErrorAlert = () => {
  alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
};

export const TodoItemEdit = ({ todo, onCancel }: TodoItemEditProps) => {
  const [editText, setEditText] = useState(todo.text);
  const [editReferences, setEditReferences] = useState<string[]>(todo.references);

  const queryClient = useQueryClient();
  const updateTodo = useUpdateTodo();
  const cachedAll = queryClient.getQueryData<Todo[]>(['todos', 'all']) ?? [];

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (!trimmedText) return;

    updateTodo.mutate(
      {
        id: todo.id,
        data: { text: trimmedText, references: editReferences },
      },
      {
        onSuccess: onCancel,
        onError: showErrorAlert,
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className={styles.editForm}>
      <Input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Select
        todos={cachedAll}
        selectedIds={editReferences}
        onChange={setEditReferences}
        excludeId={todo.id}
        label="참조 수정"
      />
      <div className={styles.actions}>
        <Button size="small" variant="primary" onClick={handleSave}>
          저장
        </Button>
        <Button size="small" variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
};
