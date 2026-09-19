import { describe, it, expect } from 'vitest';
import { calculateTaskStats } from '../../src/lib/stats';
import type { Task } from '../../src/types/task';

describe('calculateTaskStats utility', () => {
  it('returns zero metrics for an empty task list', () => {
    expect(calculateTaskStats([])).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
    });
  });

  it('safely handles non-array or invalid input', () => {
    expect(calculateTaskStats(null as unknown as Task[])).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
    });
    expect(calculateTaskStats(undefined as unknown as Task[])).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
    });
  });

  it('computes metrics accurately for mixed tasks in a single pass', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        priority: 'high',
        completed: true,
        createdAt: '2026-09-19T00:00:00Z',
        updatedAt: '2026-09-19T00:00:00Z',
      },
      {
        id: '2',
        title: 'Task 2',
        priority: 'medium',
        completed: false,
        createdAt: '2026-09-19T00:00:00Z',
        updatedAt: '2026-09-19T00:00:00Z',
      },
      {
        id: '3',
        title: 'Task 3',
        priority: 'low',
        completed: true,
        createdAt: '2026-09-19T00:00:00Z',
        updatedAt: '2026-09-19T00:00:00Z',
      },
    ];

    const stats = calculateTaskStats(tasks);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(2);
    expect(stats.pending).toBe(1);
  });

  it('computes metrics when all tasks are active', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        priority: 'high',
        completed: false,
        createdAt: '2026-09-19T00:00:00Z',
        updatedAt: '2026-09-19T00:00:00Z',
      },
    ];

    const stats = calculateTaskStats(tasks);
    expect(stats.total).toBe(1);
    expect(stats.completed).toBe(0);
    expect(stats.pending).toBe(1);
  });

  it('computes metrics when all tasks are completed', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        priority: 'high',
        completed: true,
        createdAt: '2026-09-19T00:00:00Z',
        updatedAt: '2026-09-19T00:00:00Z',
      },
    ];

    const stats = calculateTaskStats(tasks);
    expect(stats.total).toBe(1);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(0);
  });
});
