import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TodoFilter as FilterType } from '../types/todo';
import { TodoForm } from '../components/TodoForm';
import { TodoFilter } from '../components/TodoFilter';
import { TodoList } from '../components/TodoList';
import { ErrorBoundary } from '../components/ErrorBoundary';
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

        <ErrorBoundary>
          <Suspense fallback={<div className={styles.loading}>로딩 중...</div>}>
            <TodoList filter={filter} page={page} onPageChange={setPage} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};
