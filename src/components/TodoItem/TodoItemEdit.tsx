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
  cachedAll: Todo[];
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TodoItemEdit = ({
  todo,
  editText,
  setEditText,
  editReferences,
  setEditReferences,
  cachedAll,
  onKeyDown,
}: TodoItemEditProps) => {
  return (
    <div className={styles.editForm}>
      <Input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={onKeyDown}
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
