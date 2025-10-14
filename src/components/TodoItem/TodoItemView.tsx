import type { Todo } from '../../types/todo';
import { formatDateTime } from '../../utils/date';
import styles from './TodoItem.module.css';

interface TodoItemViewProps {
  todo: Todo;
}

export const TodoItemView = ({ todo }: TodoItemViewProps) => {
  return (
    <>
      <div className={styles.text}>
        {todo.id}. {todo.text}
      </div>

      <div className={styles.meta}>
        <span>생성: {formatDateTime(todo.createdAt)}</span>
        <span>수정: {formatDateTime(todo.updatedAt)}</span>
        {todo.references.length > 0 && (
          <span className={styles.references}>
            참조: {todo.references.map((id) => `@${id}`).join(', ')}
          </span>
        )}
      </div>
    </>
  );
};
