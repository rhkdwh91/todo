import { useState } from 'react';
import type { Todo } from '../../types/todo';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useUpdateTodo, useDeleteTodo, useBatchUpdateTodos } from '../../hooks/useTodos';
import { canComplete, getTodosToUncomplete } from '../../utils/validation';
import { formatDateTime } from '../../utils/date';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  referencedTodos: Todo[];
}

export const TodoItem = ({ todo, referencedTodos }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editReferences, setEditReferences] = useState<string[]>(todo.references);

  const updateTodo = useUpdateTodo();
  const batchUpdateTodos = useBatchUpdateTodos();
  const deleteTodo = useDeleteTodo();

  const isCompletable = canComplete(todo, referencedTodos);

  const getUncompleteConfirmationMessage = (todoIds: string[]) => {
    const affectedTodos = todoIds
      .map((id) => referencedTodos.find((t) => t.id === id))
      .filter(Boolean)
      .map((t) => `${t?.id}. ${t?.text}`)
      .join('\n');

    return `이 할 일을 미완료로 변경하면 다음 할 일들도 미완료로 변경됩니다:\n${affectedTodos}\n\n계속하시겠습니까?`;
  };

  const handleComplete = () => {
    updateTodo.mutate({
      id: todo.id,
      data: { completed: true },
    });
  };

  const handleUncomplete = () => {
    const todosToUncomplete = getTodosToUncomplete(todo.id, referencedTodos);

    if (todosToUncomplete.length > 0) {
      const message = getUncompleteConfirmationMessage(todosToUncomplete);
      if (!confirm(message)) return;

      batchUpdateTodos.mutate([
        { id: todo.id, data: { completed: false } },
        ...todosToUncomplete.map((id) => ({ id, data: { completed: false } })),
      ]);
    } else {
      updateTodo.mutate({
        id: todo.id,
        data: { completed: false },
      });
    }
  };

  const handleToggle = () => {
    if (todo.completed) {
      handleUncomplete();
    } else if (isCompletable) {
      handleComplete();
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditReferences(todo.references);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditReferences(todo.references);
  };

  const saveEdit = () => {
    const trimmedText = editText.trim();
    if (!trimmedText) return;

    updateTodo.mutate(
      {
        id: todo.id,
        data: { text: trimmedText, references: editReferences },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteTodo.mutate(todo.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const renderEditForm = () => (
    <div className={styles.editForm}>
      <Input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Select
        todos={referencedTodos}
        selectedIds={editReferences}
        onChange={setEditReferences}
        excludeId={todo.id}
        label="참조 수정"
      />
    </div>
  );

  const renderTodoText = () => (
    <div className={styles.text}>
      {todo.id}. {todo.text}
    </div>
  );

  const renderMetadata = () => (
    <div className={styles.meta}>
      <span>생성: {formatDateTime(todo.createdAt)}</span>
      <span>수정: {formatDateTime(todo.updatedAt)}</span>
      {todo.references.length > 0 && (
        <span className={styles.references}>
          참조: {todo.references.map((id) => `@${id}`).join(', ')}
        </span>
      )}
    </div>
  );

  const renderEditActions = () => (
    <>
      <Button size="small" variant="primary" onClick={saveEdit}>
        저장
      </Button>
      <Button size="small" variant="secondary" onClick={cancelEditing}>
        취소
      </Button>
    </>
  );

  const renderDefaultActions = () => (
    <>
      <Button size="small" variant="secondary" onClick={startEditing}>
        수정
      </Button>
      <Button size="small" variant="danger" onClick={handleDelete}>
        삭제
      </Button>
    </>
  );

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <Checkbox
        checked={todo.completed}
        onChange={handleToggle}
        disabled={!todo.completed && !isCompletable}
      />

      <div className={styles.content}>
        {isEditing ? renderEditForm() : renderTodoText()}
        {renderMetadata()}
      </div>

      <div className={styles.actions}>
        {isEditing ? renderEditActions() : renderDefaultActions()}
      </div>
    </div>
  );
};
