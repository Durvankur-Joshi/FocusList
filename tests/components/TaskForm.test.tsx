import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from '../../src/components/tasks/TaskForm';

describe('TaskForm Component', () => {
  it('renders title input, priority select, and submit button', () => {
    render(<TaskForm onAddTask={vi.fn()} />);

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('calls onAddTask with trimmed title and default medium priority', () => {
    const handleAddTask = vi.fn();
    render(<TaskForm onAddTask={handleAddTask} />);

    const input = screen.getByLabelText(/task title/i);
    const button = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: '  Write documentation  ' } });
    fireEvent.click(button);

    expect(handleAddTask).toHaveBeenCalledTimes(1);
    expect(handleAddTask).toHaveBeenCalledWith({
      title: 'Write documentation',
      priority: 'medium',
    });
    expect(input).toHaveValue('');
  });

  it('allows changing priority and submits with chosen priority', () => {
    const handleAddTask = vi.fn();
    render(<TaskForm onAddTask={handleAddTask} />);

    const input = screen.getByLabelText(/task title/i);
    const select = screen.getByLabelText(/priority:/i);
    const button = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: 'Fix critical bug' } });
    fireEvent.change(select, { target: { value: 'high' } });
    fireEvent.click(button);

    expect(handleAddTask).toHaveBeenCalledWith({
      title: 'Fix critical bug',
      priority: 'high',
    });
  });

  it('shows error when submitting empty title and does not call onAddTask', () => {
    const handleAddTask = vi.fn();
    render(<TaskForm onAddTask={handleAddTask} />);

    const button = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(button);

    expect(handleAddTask).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be empty/i);
  });

  it('shows error when submitting whitespace-only title', () => {
    const handleAddTask = vi.fn();
    render(<TaskForm onAddTask={handleAddTask} />);

    const input = screen.getByLabelText(/task title/i);
    const button = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: '    ' } });
    fireEvent.click(button);

    expect(handleAddTask).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be empty/i);
  });

  it('clears error message when typing in the title input', () => {
    render(<TaskForm onAddTask={vi.fn()} />);

    const input = screen.getByLabelText(/task title/i);
    const button = screen.getByRole('button', { name: /add task/i });

    fireEvent.click(button);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'A' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
