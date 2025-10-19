import { clsx } from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  onRemove?: () => void;
  variant?: 'default' | 'primary';
}

export const Badge = ({ children, onRemove, variant = 'default' }: BadgeProps) => {
  return (
    <span className={clsx(styles.badge, styles[variant])}>
      <span className={styles.text}>{children}</span>
      {onRemove && (
        <button type="button" className={styles.removeButton} onClick={onRemove} aria-label="제거">
          ×
        </button>
      )}
    </span>
  );
};
