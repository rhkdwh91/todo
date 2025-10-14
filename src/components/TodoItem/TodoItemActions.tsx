import { Button } from '../common/Button';
import styles from './TodoItem.module.css';

interface TodoItemActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TodoItemActions = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: TodoItemActionsProps) => {
  return (
    <div className={styles.actions}>
      {isEditing ? (
        <>
          <Button size="small" variant="primary" onClick={onSave}>
            저장
          </Button>
          <Button size="small" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        </>
      ) : (
        <>
          <Button size="small" variant="secondary" onClick={onEdit}>
            수정
          </Button>
          <Button size="small" variant="danger" onClick={onDelete}>
            삭제
          </Button>
        </>
      )}
    </div>
  );
};
