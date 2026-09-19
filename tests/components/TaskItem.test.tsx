import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from '../../src/components/tasks/TaskItem';
import type { Task } from '../../src/types/task';

describe('TaskItem Component', () => {
  const sampleTask: Task = {
    id: 'test-1',
    title: 'Design component',
    priority: 'high',
    completed: false,
    createdAt: '2026-09-19T10:00:00.000Z',
    updatedAt: '2026-09-19T10:00:00.000Z',
  };

  it('renders task details and controls with accessible names', () => {
    render(
      <TaskItem
        task={sampleTask}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Design component')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /mark "design component" as complete/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /edit task: design component/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete task: design component/i })
    ).toBeInTheDocument();
  });

  it('indicates completed state clearly', () => {
    const completedTask: Task = { ...sampleTask, completed: true };
    render(
      <TaskItem
        task={completedTask}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /mark "design component" as incomplete/i })
    ).toBeChecked();
  });

  it('calls onToggle when completion checkbox is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <TaskItem
        task={sampleTask}
        onToggle={handleToggle}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleToggle).toHaveBeenCalledWith(sampleTask.id);
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(
      <TaskItem
        task={sampleTask}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete task/i });
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith(sampleTask.id);
  });

  it('enters edit mode and allows saving modified title and priority', () => {
    const handleUpdate = vi.fn().mockReturnValue(true);
    render(
      <TaskItem
        task={sampleTask}
        onToggle={vi.fn()}
        onUpdate={handleUpdate}
        onDelete={vi.fn()}
      />
    );

    const editBtn = screen.getByRole('button', { name: /edit task/i });
    fireEvent.click(editBtn);

    // Now in edit mode
    const titleInput = screen.getByLabelText(/edit task title/i);
    const prioritySelect = screen.getByLabelText(/priority:/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });

    expect(titleInput).toHaveValue(sampleTask.title);

    fireEvent.change(titleInput, { target: { value: 'Updated component title' } });
    fireEvent.change(prioritySelect, { target: { value: 'low' } });
    fireEvent.click(saveBtn);

    expect(handleUpdate).toHaveBeenCalledWith(sampleTask.id, {
      title: 'Updated component title',
      priority: 'low',
    });

    // Should return to normal display mode after successful update
    expect(screen.queryByLabelText(/edit task title/i)).not.toBeInTheDocument();
  });

  it('cancels edit mode without updating', () => {
    const handleUpdate = vi.fn();
    render(
      <TaskItem
        task={sampleTask}
        onToggle={vi.fn()}
        onUpdate={handleUpdate}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit task/i }));

    const cancelBtn = screen.getByRole('button', { name: /cancel editing/i });
    fireEvent.click(cancelBtn);

    expect(handleUpdate).not.toHaveBeenCalled();
    expect(screen.getByText(sampleTask.title)).toBeInTheDocument();
  });

  it('shows error in edit mode when saving empty title', () => {
    const handleUpdate = vi.fn();
    render(
      <TaskItem
        task={sampleTask}
        onToggle={vi.fn()}
        onUpdate={handleUpdate}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit task/i }));

    const titleInput = screen.getByLabelText(/edit task title/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(saveBtn);

    expect(handleUpdate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be empty/i);
  });
});
