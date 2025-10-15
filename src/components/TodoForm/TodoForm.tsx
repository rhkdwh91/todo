import { useState, useMemo, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../../types/todo';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Badge } from '../common/Badge';
import { useCreateTodo } from '../../hooks/useTodos';
import styles from './TodoForm.module.css';

export const TodoForm = () => {
  const [text, setText] = useState('');
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const createTodo = useCreateTodo();

  const cachedAll = queryClient.getQueryData<Todo[]>(['todos', 'all']) ?? [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    createTodo.mutate(
      { text: text.trim(), references: selectedReferences },
      {
        onSuccess: () => {
          setText('');
          setSelectedReferences([]);
        },
        onError: () => {
          alert('할 일 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleRemoveReference = (id: string) => {
    setSelectedReferences((prev) => prev.filter((refId) => refId !== id));
  };

  const selectedTodos = useMemo(() => {
    return selectedReferences
      .map((id) => cachedAll.find((todo) => todo.id === id))
      .filter((todo) => todo !== undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReferences]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="새로운 할 일을 입력하세요"
          disabled={createTodo.isPending}
        />
        <Button type="submit" disabled={createTodo.isPending || !text.trim()}>
          추가
        </Button>
      </div>

      {selectedReferences.length > 0 && (
        <div className={styles.badgeContainer}>
          {selectedTodos.map((todo) => (
            <Badge key={todo.id} variant="primary" onRemove={() => handleRemoveReference(todo.id)}>
              @{todo.id} {todo.text}
            </Badge>
          ))}
        </div>
      )}

      {cachedAll.length > 0 && (
        <Select
          todos={cachedAll}
          selectedIds={selectedReferences}
          onChange={setSelectedReferences}
          label="참조 (선택사항)"
          defaultCollapsed={true}
        />
      )}
    </form>
  );
};
