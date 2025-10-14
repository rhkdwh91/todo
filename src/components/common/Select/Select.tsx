import { useState } from 'react';
import type { Todo } from '../../../types/todo';
import styles from './Select.module.css';

interface SelectProps {
  todos: Todo[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  excludeId?: string;
  label?: string;
  defaultCollapsed?: boolean;
}

export const Select = ({
  todos,
  selectedIds,
  onChange,
  excludeId,
  label,
  defaultCollapsed = false,
}: SelectProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const availableTodos = todos.filter((todo) => todo.id !== excludeId);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (availableTodos.length === 0) {
    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.empty}>선택 가능한 할 일이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelRow}>
          <label className={styles.label}>{label}</label>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={styles.toggleButton}
          >
            {isCollapsed ? '펼치기 ▼' : '접기 ▲'}
          </button>
        </div>
      )}
      {!isCollapsed && (
        <div className={styles.list}>
          {availableTodos.map((todo) => (
            <label key={todo.id} className={styles.item}>
              <input
                type="checkbox"
                checked={selectedIds.includes(todo.id)}
                onChange={() => handleToggle(todo.id)}
                className={styles.checkbox}
              />
              <span className={styles.text}>
                {todo.text} {todo.completed && <span className={styles.completed}>(완료)</span>}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
