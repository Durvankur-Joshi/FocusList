import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Task } from '../../src/types/task';
import { TASK_STORAGE_KEY } from '../../src/constants/task';
import {
  isLocalStorageAvailable,
  loadTasks,
  saveTasks,
  clearTasks,
} from '../../src/lib/storage';

describe('Storage Layer', () => {
  const sampleTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Write unit tests',
      priority: 'high',
      completed: false,
      createdAt: '2026-09-19T08:00:00.000Z',
      updatedAt: '2026-09-19T08:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Check storage abstraction',
      priority: 'low',
      completed: true,
      createdAt: '2026-09-19T08:30:00.000Z',
      updatedAt: '2026-09-19T09:00:00.000Z',
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('isLocalStorageAvailable', () => {
    it('returns true in standard browser/jsdom environment', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('returns false when setItem throws an error', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(isLocalStorageAvailable()).toBe(false);
    });
  });

  describe('loadTasks', () => {
    it('returns empty array when storage is empty', () => {
      expect(loadTasks()).toEqual([]);
    });

    it('loads and parses valid stored tasks', () => {
      window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(sampleTasks));
      const loaded = loadTasks();
      expect(loaded).toEqual(sampleTasks);
    });

    it('returns empty array when storage contains malformed JSON', () => {
      window.localStorage.setItem(TASK_STORAGE_KEY, 'invalid-json{{[}');
      expect(loadTasks()).toEqual([]);
    });

    it('returns empty array when storage contains non-array JSON', () => {
      window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify({ not: 'an array' }));
      expect(loadTasks()).toEqual([]);
    });

    it('returns empty array when stored tasks contain invalid task objects', () => {
      window.localStorage.setItem(
        TASK_STORAGE_KEY,
        JSON.stringify([
          { id: '1', title: 'Valid', priority: 'high', completed: false, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
          { id: '2', title: '', priority: 'invalid-priority' },
        ])
      );
      expect(loadTasks()).toEqual([]);
    });

    it('returns empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadTasks()).toEqual([]);
    });
  });

  describe('saveTasks', () => {
    it('saves valid tasks to localStorage and returns true', () => {
      const result = saveTasks(sampleTasks);
      expect(result).toBe(true);

      const raw = window.localStorage.getItem(TASK_STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual(sampleTasks);
    });

    it('rejects saving invalid task objects and returns false', () => {
      const invalidTasks = [
        { id: '1', title: '' } as unknown as Task,
      ];
      const result = saveTasks(invalidTasks);
      expect(result).toBe(false);
    });

    it('handles localStorage errors gracefully and returns false', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage disabled');
      });
      const result = saveTasks(sampleTasks);
      expect(result).toBe(false);
    });
  });

  describe('clearTasks', () => {
    it('removes the tasks storage key and returns true', () => {
      window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(sampleTasks));
      expect(window.localStorage.getItem(TASK_STORAGE_KEY)).not.toBeNull();

      const result = clearTasks();
      expect(result).toBe(true);
      expect(window.localStorage.getItem(TASK_STORAGE_KEY)).toBeNull();
    });

    it('handles removal errors gracefully and returns false', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Access denied');
      });
      const result = clearTasks();
      expect(result).toBe(false);
    });
  });
});
