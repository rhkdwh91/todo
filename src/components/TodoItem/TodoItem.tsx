import type { Todo } from '../../types/todo';
import { Checkbox } from '../common/Checkbox';
import { useTodoItemActions } from '../../hooks/useTodoItemActions';
import { TodoItemView } from './TodoItemView';
import { TodoItemEdit } from './TodoItemEdit';
import { TodoItemActions } from './TodoItemActions';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const {
    isEditing,
    editText,
    setEditText,
    editReferences,
    setEditReferences,
    cachedAll,
    handleToggle,
    startEditing,
    cancelEditing,
    saveEdit,
    handleDelete,
  } = useTodoItemActions({ todo });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <Checkbox
        checked={todo.completed}
        onChange={handleToggle}
        disabled={!todo.completed && !todo.canComplete}
      />

      <div className={styles.content}>
        {isEditing ? (
          <TodoItemEdit
            todo={todo}
            editText={editText}
            setEditText={setEditText}
            editReferences={editReferences}
            setEditReferences={setEditReferences}
            cachedAll={cachedAll}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <TodoItemView todo={todo} />
        )}
      </div>

      <TodoItemActions
        isEditing={isEditing}
        onSave={saveEdit}
        onCancel={cancelEditing}
        onEdit={startEditing}
        onDelete={handleDelete}
      />
    </div>
  );
};
