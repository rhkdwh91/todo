import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('children을 렌더링해야 함', () => {
    render(<Button>클릭</Button>);

    expect(screen.getByText('클릭')).toBeInTheDocument();
  });

  it('클릭 시 onClick을 호출해야 함', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>클릭</Button>);

    await user.click(screen.getByText('클릭'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태일 때 onClick을 호출하지 않아야 함', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        클릭
      </Button>
    );

    await user.click(screen.getByText('클릭'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('variant 클래스를 적용해야 함', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector('button');

    expect(button?.className).toContain('primary');
  });

  it('size 클래스를 적용해야 함', () => {
    const { container } = render(<Button size="small">Small</Button>);
    const button = container.querySelector('button');

    expect(button?.className).toContain('small');
  });

  it('disabled 상태를 적용해야 함', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');

    expect(button).toBeDisabled();
  });
});
