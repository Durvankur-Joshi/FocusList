import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../../src/hooks/useTasks';
import { TASK_STORAGE_KEY } from '../../src/constants/task';
import type { Task } from '../../src/types/task';

describe('useTasks Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts with an empty task array', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });

  it('adds a task with default medium priority and stores it', () => {
    const { result } = renderHook(() => useTasks());

    let createdTask: Task | null = null;
    act(() => {
      createdTask = result.current.addTask({ title: 'First Task' });
    });

    expect(createdTask).not.toBeNull();
    expect(createdTask!.title).toBe('First Task');
    expect(createdTask!.priority).toBe('medium');
    expect(createdTask!.completed).toBe(false);
    expect(createdTask!.id).toBeTruthy();
    expect(createdTask!.createdAt).toBeTruthy();
    expect(createdTask!.updatedAt).toBe(createdTask!.createdAt);

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]).toEqual(createdTask);

    // Verify localStorage persistence
    const stored = JSON.parse(window.localStorage.getItem(TASK_STORAGE_KEY)!);
    expect(stored).toEqual([createdTask]);
  });

  it('adds a task with explicit priority', () => {
    const { result } = renderHook(() => useTasks());

    let highTask: Task | null = null;
    act(() => {
      highTask = result.current.addTask({ title: 'High priority task', priority: 'high' });
    });

    expect(highTask).not.toBeNull();
    expect(highTask!.priority).toBe('high');
    expect(result.current.tasks[0]?.priority).toBe('high');
  });

  it('rejects adding a task with empty or whitespace-only title', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      const emptyRes = result.current.addTask({ title: '' });
      expect(emptyRes).toBeNull();

      const whitespaceRes = result.current.addTask({ title: '    ' });
      expect(whitespaceRes).toBeNull();
    });

    expect(result.current.tasks).toEqual([]);
  });

  it('updates an existing task title and priority immutably', () => {
    const { result } = renderHook(() => useTasks());

    let created: Task | null = null;
    act(() => {
      created = result.current.addTask({ title: 'Old Title', priority: 'low' });
    });

    const initialCreatedAt = created!.createdAt;

    let updateSuccess = false;
    act(() => {
      updateSuccess = result.current.updateTask(created!.id, {
        title: 'New Updated Title',
        priority: 'high',
      });
    });

    expect(updateSuccess).toBe(true);
    expect(result.current.tasks[0]?.title).toBe('New Updated Title');
    expect(result.current.tasks[0]?.priority).toBe('high');
    expect(result.current.tasks[0]?.createdAt).toBe(initialCreatedAt);
  });

  it('rejects invalid updates', () => {
    const { result } = renderHook(() => useTasks());

    let created: Task | null = null;
    act(() => {
      created = result.current.addTask({ title: 'Valid Task' });
    });

    act(() => {
      const invalidTitleUpdate = result.current.updateTask(created!.id, { title: '   ' });
      expect(invalidTitleUpdate).toBe(false);

      const nonExistentUpdate = result.current.updateTask('fake-id', { title: 'Changed' });
      expect(nonExistentUpdate).toBe(false);
    });

    expect(result.current.tasks[0]?.title).toBe('Valid Task');
  });

  it('toggles task completion', () => {
    const { result } = renderHook(() => useTasks());

    let created: Task | null = null;
    act(() => {
      created = result.current.addTask({ title: 'To be toggled' });
    });

    expect(result.current.tasks[0]?.completed).toBe(false);

    let toggleSuccess = false;
    act(() => {
      toggleSuccess = result.current.toggleTask(created!.id);
    });

    expect(toggleSuccess).toBe(true);
    expect(result.current.tasks[0]?.completed).toBe(true);

    act(() => {
      result.current.toggleTask(created!.id);
    });
    expect(result.current.tasks[0]?.completed).toBe(false);
  });

  it('returns false when toggling non-existent task', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      const res = result.current.toggleTask('unknown-id');
      expect(res).toBe(false);
    });
  });

  it('deletes a task immutably', () => {
    const { result } = renderHook(() => useTasks());

    let task1: Task | null = null;
    let task2: Task | null = null;

    act(() => {
      task1 = result.current.addTask({ title: 'Task 1' });
      task2 = result.current.addTask({ title: 'Task 2' });
    });

    expect(result.current.tasks).toHaveLength(2);

    let deleteSuccess = false;
    act(() => {
      deleteSuccess = result.current.deleteTask(task1!.id);
    });

    expect(deleteSuccess).toBe(true);
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]?.id).toBe(task2!.id);

    // Deleting non-existent returns false
    act(() => {
      const secondDelete = result.current.deleteTask(task1!.id);
      expect(secondDelete).toBe(false);
    });
  });

  it('clears all tasks', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask({ title: 'Task A' });
      result.current.addTask({ title: 'Task B' });
    });

    expect(result.current.tasks).toHaveLength(2);

    act(() => {
      result.current.clearAllTasks();
    });

    expect(result.current.tasks).toEqual([]);
    expect(window.localStorage.getItem(TASK_STORAGE_KEY)).toBe('[]');
  });

  it('persists and loads tasks across hook instances', () => {
    const { result: firstInstance } = renderHook(() => useTasks());

    act(() => {
      firstInstance.current.addTask({ title: 'Persistent Task', priority: 'high' });
    });

    // Render a separate instance of the hook
    const { result: secondInstance } = renderHook(() => useTasks());
    expect(secondInstance.current.tasks).toHaveLength(1);
    expect(secondInstance.current.tasks[0]?.title).toBe('Persistent Task');
    expect(secondInstance.current.tasks[0]?.priority).toBe('high');
  });
});
