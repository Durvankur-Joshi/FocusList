import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskStats } from '../../src/components/dashboard/TaskStats';
import type { Task } from '../../src/types/task';

describe('TaskStats Component', () => {
  const sampleTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Active Task 1',
      priority: 'high',
      completed: false,
      createdAt: '2026-09-19T08:00:00.000Z',
      updatedAt: '2026-09-19T08:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Completed Task 1',
      priority: 'medium',
      completed: true,
      createdAt: '2026-09-19T08:10:00.000Z',
      updatedAt: '2026-09-19T08:10:00.000Z',
    },
    {
      id: 'task-3',
      title: 'Completed Task 2',
      priority: 'low',
      completed: true,
      createdAt: '2026-09-19T08:20:00.000Z',
      updatedAt: '2026-09-19T08:20:00.000Z',
    },
  ];

  it('renders zero counts when tasks list is empty', () => {
    render(<TaskStats tasks={[]} />);

    expect(screen.getByRole('region', { name: /task statistics/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/total tasks: 0/i)).toHaveTextContent('0');
    expect(screen.getByLabelText(/completed tasks: 0/i)).toHaveTextContent('0');
    expect(screen.getByLabelText(/pending tasks: 0/i)).toHaveTextContent('0');
  });

  it('accurately displays total, completed, and pending counts', () => {
    render(<TaskStats tasks={sampleTasks} />);

    // Total: 3, Completed: 2, Pending: 1
    expect(screen.getByLabelText(/total tasks: 3/i)).toHaveTextContent('3');
    expect(screen.getByLabelText(/completed tasks: 2/i)).toHaveTextContent('2');
    expect(screen.getByLabelText(/pending tasks: 1/i)).toHaveTextContent('1');
  });
});
