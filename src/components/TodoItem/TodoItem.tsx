import { useState } from 'react';
import type { Todo } from '../../types/todo';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useUpdateTodo, useDeleteTodo } from '../../hooks/useTodos';
import { canComplete } from '../../utils/validation';
import { formatDateTime } from '../../utils/date';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  allTodos: Todo[];
}

export const TodoItem = ({ todo, allTodos }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editReferences, setEditReferences] = useState<string[]>(todo.references);

  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const isCompletable = canComplete(todo, allTodos);

  const handleToggle = () => {
    if (!todo.completed || isCompletable) {
      updateTodo.mutate({
        id: todo.id,
        data: { completed: !todo.completed },
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditReferences(todo.references);
  };

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo.mutate(
        {
          id: todo.id,
          data: { text: editText.trim(), references: editReferences },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditReferences(todo.references);
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteTodo.mutate(todo.id);
    }
  };

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <Checkbox
        checked={todo.completed}
        onChange={handleToggle}
        disabled={!todo.completed && !isCompletable}
      />

      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editForm}>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
            />
            <Select
              todos={allTodos}
              selectedIds={editReferences}
              onChange={setEditReferences}
              excludeId={todo.id}
              label="참조 수정"
            />
          </div>
        ) : (
          <div className={styles.text}>
            {todo.id}. {todo.text}
          </div>
        )}
        <div className={styles.meta}>
          <span>생성: {formatDateTime(todo.createdAt)}</span>
          <span>수정: {formatDateTime(todo.updatedAt)}</span>
          {todo.references.length > 0 && (
            <span className={styles.references}>
              참조: {todo.references.map((id) => `@${id}`).join(', ')}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {isEditing ? (
          <>
            <Button size="small" variant="primary" onClick={handleSave}>
              저장
            </Button>
            <Button size="small" variant="secondary" onClick={handleCancel}>
              취소
            </Button>
          </>
        ) : (
          <>
            <Button size="small" variant="secondary" onClick={handleEdit}>
              수정
            </Button>
            <Button size="small" variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
