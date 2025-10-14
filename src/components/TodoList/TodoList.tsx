import type { TodoFilter as FilterType } from '../../types/todo';
import { useTodos } from '../../hooks/useTodos';
import { TodoItem } from '../TodoItem';
import { Pagination } from '../Pagination';
import styles from './TodoList.module.css';

interface TodoListProps {
  filter: FilterType;
  page: number;
  onPageChange: (page: number) => void;
}

export const TodoList = ({ filter, page, onPageChange }: TodoListProps) => {
  const { data, isLoading, error } = useTodos(page, 10, filter);

  if (isLoading) {
    return <div className={styles.message}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>에러가 발생했습니다.</div>;
  }

  if (!data || data.data.length === 0) {
    return <div className={styles.message}>할 일이 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {data.data.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
