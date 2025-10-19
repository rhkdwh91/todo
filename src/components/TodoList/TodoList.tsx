import type { TodoFilter as FilterType } from '../../types/todo';
import { TodoItem } from '../TodoItem';
import { Pagination } from '../Pagination';
import styles from './TodoList.module.css';
import { PAGINATION } from '../../constants/pagination.ts';
import { useTodos } from '../../hooks/useTodos.ts';

interface TodoListProps {
  page: number;
  filter: FilterType;
  onPageChange: (page: number) => void;
}

export const TodoList = ({ page, filter, onPageChange }: TodoListProps) => {
  const { data } = useTodos(page, PAGINATION.DEFAULT_PAGE_SIZE, filter);

  if (data.data.length === 0) {
    return <div className={styles.message}>할 일이 없습니다.</div>;
  }

  return (
    <div>
      <div className={styles.list}>
        {data.data.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
