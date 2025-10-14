import { useState } from 'react';
import type { TodoFilter as FilterType } from '../types/todo';
import { TodoForm } from '../components/TodoForm';
import { TodoFilter } from '../components/TodoFilter';
import { TodoList } from '../components/TodoList';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>To-Do List</h1>
      </header>

      <main className={styles.main}>
        <TodoForm />
        <TodoFilter current={filter} onChange={handleFilterChange} />
        <TodoList filter={filter} page={page} onPageChange={setPage} />
      </main>
    </div>
  );
};
