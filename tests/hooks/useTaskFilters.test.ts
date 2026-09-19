import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskFilters } from '../../src/hooks/useTaskFilters';
import type { Task } from '../../src/types/task';

describe('useTaskFilters Hook', () => {
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Design Wireframes',
      priority: 'high',
      completed: false,
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
    {
      id: '2',
      title: 'Implement API',
      priority: 'medium',
      completed: true,
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
    {
      id: '3',
      title: 'Write Documentation',
      priority: 'low',
      completed: false,
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
  ];

  it('initializes with default filter state and all tasks', () => {
    const { result } = renderHook(() => useTaskFilters(sampleTasks));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.priorityFilter).toBe('all');
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredTasks).toHaveLength(3);
  });

  it('filters tasks by search query and marks hasActiveFilters', () => {
    const { result } = renderHook(() => useTaskFilters(sampleTasks));

    act(() => {
      result.current.setSearchQuery('api');
    });

    expect(result.current.searchQuery).toBe('api');
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0]?.id).toBe('2');
  });

  it('filters tasks by status', () => {
    const { result } = renderHook(() => useTaskFilters(sampleTasks));

    act(() => {
      result.current.setStatusFilter('active');
    });

    expect(result.current.statusFilter).toBe('active');
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.filteredTasks).toHaveLength(2);
    expect(result.current.filteredTasks.every((t) => !t.completed)).toBe(true);

    act(() => {
      result.current.setStatusFilter('completed');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0]?.id).toBe('2');
  });

  it('filters tasks by priority', () => {
    const { result } = renderHook(() => useTaskFilters(sampleTasks));

    act(() => {
      result.current.setPriorityFilter('high');
    });

    expect(result.current.priorityFilter).toBe('high');
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0]?.id).toBe('1');
  });

  it('resets all filters back to default values', () => {
    const { result } = renderHook(() => useTaskFilters(sampleTasks));

    act(() => {
      result.current.setSearchQuery('wireframes');
      result.current.setStatusFilter('active');
      result.current.setPriorityFilter('high');
    });

    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.filteredTasks).toHaveLength(1);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.priorityFilter).toBe('all');
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredTasks).toHaveLength(3);
  });
});
