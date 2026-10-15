import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/common/ThemeToggle';

describe('Theme Feature Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('ThemeToggle hiển thị đúng biểu tượng và gọi hàm khi nhấn', () => {
    const handleToggle = vi.fn();

    // Render ở chế độ sáng
    const { rerender } = render(<ThemeToggle isDark={false} onToggle={handleToggle} />);
    const toggleBtn = screen.getByRole('button', { name: /chuyển sang giao diện tối/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);

    // Re-render ở chế độ tối
    rerender(<ThemeToggle isDark={true} onToggle={handleToggle} />);
    expect(screen.getByRole('button', { name: /chuyển sang giao diện sáng/i })).toBeInTheDocument();
  });
});
