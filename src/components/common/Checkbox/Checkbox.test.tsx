import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('기본적으로 체크되지 않은 상태로 렌더링되어야 함', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('checked prop이 true일 때 체크된 상태로 렌더링되어야 함', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('클릭 시 onChange를 호출해야 함', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox checked={false} onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태일 때 onChange를 호출하지 않아야 함', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox checked={false} onChange={handleChange} disabled />);

    await user.click(screen.getByRole('checkbox'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('disabled prop이 true일 때 비활성화되어야 함', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });
});
