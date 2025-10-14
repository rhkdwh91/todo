import { useState, type FormEvent } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Badge } from '../common/Badge';
import { useTodos, useCreateTodo } from '../../hooks/useTodos';
import styles from './TodoForm.module.css';

export const TodoForm = () => {
  const [text, setText] = useState('');
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);

  const { data: todosData } = useTodos(1, 100, 'all');
  const createTodo = useCreateTodo();

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
      }
    );
  };

  const handleRemoveReference = (id: string) => {
    setSelectedReferences((prev) => prev.filter((refId) => refId !== id));
  };

  const getSelectedTodos = () => {
    if (!todosData) return [];
    return selectedReferences
      .map((id) => todosData.data.find((todo) => todo.id === id))
      .filter((todo) => todo !== undefined);
  };

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
          {getSelectedTodos().map((todo) => (
            <Badge key={todo.id} variant="primary" onRemove={() => handleRemoveReference(todo.id)}>
              @{todo.id} {todo.text}
            </Badge>
          ))}
        </div>
      )}

      {todosData && todosData.data.length > 0 && (
        <Select
          todos={todosData.data}
          selectedIds={selectedReferences}
          onChange={setSelectedReferences}
          label="참조 (선택사항)"
          defaultCollapsed={true}
        />
      )}
    </form>
  );
};
