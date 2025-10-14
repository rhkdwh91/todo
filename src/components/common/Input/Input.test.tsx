import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('value와 함께 렌더링되어야 함', () => {
    render(<Input value="테스트 값" onChange={vi.fn()} />);

    const input = screen.getByDisplayValue('테스트 값');
    expect(input).toBeInTheDocument();
  });

  it('입력 시 onChange를 호출해야 함', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '안녕');

    expect(handleChange).toHaveBeenCalled();
  });

  it('placeholder와 함께 렌더링되어야 함', () => {
    render(<Input value="" onChange={vi.fn()} placeholder="텍스트 입력" />);

    expect(screen.getByPlaceholderText('텍스트 입력')).toBeInTheDocument();
  });

  it('disabled prop이 true일 때 비활성화되어야 함', () => {
    render(<Input value="" onChange={vi.fn()} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('키를 누를 때 onKeyDown을 호출해야 함', async () => {
    const handleKeyDown = vi.fn();
    const user = userEvent.setup();

    render(<Input value="" onChange={vi.fn()} onKeyDown={handleKeyDown} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '{Enter}');

    expect(handleKeyDown).toHaveBeenCalled();
  });
});
