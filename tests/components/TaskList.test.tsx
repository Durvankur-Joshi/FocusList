import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '../../src/components/tasks/TaskList';
import type { Task } from '../../src/types/task';

describe('TaskList Component', () => {
  const sampleTasks: Task[] = [
    {
      id: 'task-1',
      title: 'First task in list',
      priority: 'high',
      completed: false,
      createdAt: '2026-09-19T10:00:00.000Z',
      updatedAt: '2026-09-19T10:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Second task in list',
      priority: 'medium',
      completed: true,
      createdAt: '2026-09-19T10:05:00.000Z',
      updatedAt: '2026-09-19T10:05:00.000Z',
    },
  ];

  it('renders EmptyState when there are no tasks in total', () => {
    render(
      <TaskList
        tasks={[]}
        totalTasksCount={0}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('renders empty filter state when tasks exist but active filters yield zero matches', () => {
    const handleReset = vi.fn();
    render(
      <TaskList
        tasks={[]}
        totalTasksCount={3}
        hasActiveFilters={true}
        onResetFilters={handleReset}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/no tasks match your filters/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /clear all active filters/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('renders tasks in a semantic unordered list', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        totalTasksCount={2}
        onToggle={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const list = screen.getByRole('list', { name: /tasks/i });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(screen.getByText('First task in list')).toBeInTheDocument();
    expect(screen.getByText('Second task in list')).toBeInTheDocument();
  });
});
