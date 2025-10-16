import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TodoFilter as FilterType } from '../types/todo';
import { TodoForm } from '../components/TodoForm';
import { TodoFilter } from '../components/TodoFilter';
import { TodoList } from '../components/TodoList';
import { Pagination } from '../components/Pagination';
import { useTodos } from '../hooks/useTodos';
import { todoApi } from '../api/todoApi';
import { PAGINATION } from '../constants/pagination';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState<number>(PAGINATION.INITIAL_PAGE);

  useQuery({
    queryKey: ['todos', 'all'],
    queryFn: () => todoApi.getAllTodos(),
    staleTime: Infinity,
  });

  const { data, isLoading, error } = useTodos(page, PAGINATION.DEFAULT_PAGE_SIZE, filter);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(PAGINATION.INITIAL_PAGE);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>To-Do List</h1>
      </header>

      <main className={styles.main}>
        <TodoForm />
        <TodoFilter current={filter} onChange={handleFilterChange} />

        {isLoading && <div className={styles.message}>로딩 중...</div>}
        {error && <div className={styles.error}>에러가 발생했습니다.</div>}
        {data && <TodoList todos={data.data} />}

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setPage(page)}
          />
        )}
      </main>
    </div>
  );
};
