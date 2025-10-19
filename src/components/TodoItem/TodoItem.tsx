import type { Todo } from '../../types/todo';
import { clsx } from 'clsx';
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
    handleToggle,
    startEditing,
    cancelEditing,
    saveEdit,
    handleDelete,
  } = useTodoItemActions({ todo });

  return (
    <div className={clsx(styles.item, todo.completed && styles.completed)}>
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
            onSave={saveEdit}
            onCancel={cancelEditing}
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
