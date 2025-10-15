import { useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../../types/todo';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import styles from './TodoItem.module.css';

interface TodoItemEditProps {
  todo: Todo;
  editText: string;
  setEditText: (text: string) => void;
  editReferences: string[];
  setEditReferences: (refs: string[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TodoItemEdit = ({
  todo,
  editText,
  setEditText,
  editReferences,
  setEditReferences,
  onSave,
  onCancel,
}: TodoItemEditProps) => {
  const queryClient = useQueryClient();
  const cachedAll = queryClient.getQueryData<Todo[]>(['todos', 'all']) ?? [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onSave();
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
    </div>
  );
};
