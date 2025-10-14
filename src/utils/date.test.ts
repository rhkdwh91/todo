import { describe, it, expect } from 'vitest';
import { formatDateTime, getCurrentISODate } from './date';

describe('formatDateTime', () => {
  it('날짜 문자열을 올바르게 포맷해야 함', () => {
    const dateString = '2025-01-15T14:30:00.000Z';
    const result = formatDateTime(dateString);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    expect(result).toContain('2025-01-15');
  });

  it('다양한 날짜 문자열을 처리해야 함', () => {
    const dateString = '2024-12-25T00:00:00.000Z';
    const result = formatDateTime(dateString);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    expect(result).toContain('2024-12-25');
  });
});

describe('getCurrentISODate', () => {
  it('ISO 날짜 문자열을 반환해야 함', () => {
    const result = getCurrentISODate();

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('유효한 날짜를 반환해야 함', () => {
    const result = getCurrentISODate();
    const date = new Date(result);

    expect(date).toBeInstanceOf(Date);
    expect(date.toString()).not.toBe('Invalid Date');
  });
});
