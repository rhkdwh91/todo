import type { Todo } from '../../types/todo';
import { TodoItem } from '../TodoItem';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
}

export const TodoList = ({ todos }: TodoListProps) => {
  if (todos.length === 0) {
    return <div className={styles.message}>할 일이 없습니다.</div>;
  }

  return (
    <div className={styles.list}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
