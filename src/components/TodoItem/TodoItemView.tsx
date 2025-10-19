import type { Todo } from '../../types/todo';
import { Button } from '../common/Button';
import { useDeleteTodo } from '../../hooks/useTodos';
import { formatDateTime } from '../../utils/date';
import styles from './TodoItem.module.css';

interface TodoItemViewProps {
  todo: Todo;
  onEdit: () => void;
}

const showErrorAlert = () => {
  alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
};

export const TodoItemView = ({ todo, onEdit }: TodoItemViewProps) => {
  const deleteTodo = useDeleteTodo();

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteTodo.mutate(todo.id, {
        onError: showErrorAlert,
      });
    }
  };

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

      <div className={styles.actions}>
        <Button size="small" variant="secondary" onClick={onEdit}>
          수정
        </Button>
        <Button size="small" variant="danger" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </>
  );
};
