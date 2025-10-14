import type { TodoFilter as FilterType } from '../../types/todo';
import { Button } from '../common/Button';
import styles from './TodoFilter.module.css';

interface TodoFilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
}

export const TodoFilter = ({ current, onChange }: TodoFilterProps) => {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className={styles.container}>
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant={current === value ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
