import { describe, it, expect } from 'vitest';
import type { Task } from '../../src/types/task';
import { TASK_LIMITS } from '../../src/constants/task';
import {
  isValidPriority,
  isValidId,
  isValidTimestamp,
  validateTaskTitle,
  isValidTask,
  validateTasks,
} from '../../src/lib/validation';

describe('Task Validation Layer', () => {
  const validTask: Task = {
    id: 'task-1',
    title: 'Complete Phase 1 Architecture',
    priority: 'high',
    completed: false,
    createdAt: '2026-09-19T08:00:00.000Z',
    updatedAt: '2026-09-19T08:00:00.000Z',
  };

  describe('validateTaskTitle', () => {
    it('accepts valid titles and trims surrounding whitespace', () => {
      const result = validateTaskTitle('  Learn Vitest  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Learn Vitest');
      expect(result.error).toBeUndefined();
    });

    it('rejects empty title', () => {
      const result = validateTaskTitle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('rejects whitespace-only title', () => {
      const result = validateTaskTitle('   \t\n  ');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('rejects non-string values', () => {
      expect(validateTaskTitle(null).isValid).toBe(false);
      expect(validateTaskTitle(123).isValid).toBe(false);
      expect(validateTaskTitle(undefined).isValid).toBe(false);
      expect(validateTaskTitle({}).isValid).toBe(false);
    });

    it('rejects titles exceeding maximum title length', () => {
      const longTitle = 'a'.repeat(TASK_LIMITS.MAX_TITLE_LENGTH + 1);
      const result = validateTaskTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain(`exceed ${TASK_LIMITS.MAX_TITLE_LENGTH}`);
    });

    it('accepts title at maximum title length', () => {
      const maxTitle = 'a'.repeat(TASK_LIMITS.MAX_TITLE_LENGTH);
      const result = validateTaskTitle(maxTitle);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(maxTitle);
    });
  });

  describe('isValidPriority', () => {
    it('accepts valid priorities', () => {
      expect(isValidPriority('high')).toBe(true);
      expect(isValidPriority('medium')).toBe(true);
      expect(isValidPriority('low')).toBe(true);
    });

    it('rejects invalid priority strings', () => {
      expect(isValidPriority('urgent')).toBe(false);
      expect(isValidPriority('critical')).toBe(false);
      expect(isValidPriority('HIGH')).toBe(false);
      expect(isValidPriority('')).toBe(false);
    });

    it('rejects non-string priority values', () => {
      expect(isValidPriority(null)).toBe(false);
      expect(isValidPriority(undefined)).toBe(false);
      expect(isValidPriority(1)).toBe(false);
      expect(isValidPriority({})).toBe(false);
    });
  });

  describe('isValidId', () => {
    it('accepts non-empty strings', () => {
      expect(isValidId('abc-123')).toBe(true);
      expect(isValidId('1')).toBe(true);
    });

    it('rejects empty, whitespace-only or non-string IDs', () => {
      expect(isValidId('')).toBe(false);
      expect(isValidId('   ')).toBe(false);
      expect(isValidId(null)).toBe(false);
      expect(isValidId(123)).toBe(false);
    });
  });

  describe('isValidTimestamp', () => {
    it('accepts valid ISO timestamp strings', () => {
      expect(isValidTimestamp('2026-09-19T08:00:00.000Z')).toBe(true);
      expect(isValidTimestamp('2026-01-01')).toBe(true);
    });

    it('rejects invalid date strings', () => {
      expect(isValidTimestamp('not-a-date')).toBe(false);
      expect(isValidTimestamp('')).toBe(false);
      expect(isValidTimestamp('   ')).toBe(false);
    });

    it('rejects non-string timestamps', () => {
      expect(isValidTimestamp(null)).toBe(false);
      expect(isValidTimestamp(Date.now())).toBe(false);
      expect(isValidTimestamp(undefined)).toBe(false);
    });
  });

  describe('isValidTask', () => {
    it('returns true for a fully valid task object', () => {
      expect(isValidTask(validTask)).toBe(true);
    });

    it('rejects non-object or null values', () => {
      expect(isValidTask(null)).toBe(false);
      expect(isValidTask(undefined)).toBe(false);
      expect(isValidTask('task')).toBe(false);
      expect(isValidTask(123)).toBe(false);
      expect(isValidTask([])).toBe(false);
    });

    it('rejects task with missing or invalid id', () => {
      expect(isValidTask({ ...validTask, id: '' })).toBe(false);
      expect(isValidTask({ ...validTask, id: 123 })).toBe(false);
    });

    it('rejects task with empty or invalid title', () => {
      expect(isValidTask({ ...validTask, title: '' })).toBe(false);
      expect(isValidTask({ ...validTask, title: '   ' })).toBe(false);
      expect(isValidTask({ ...validTask, title: 123 })).toBe(false);
    });

    it('rejects task with invalid priority', () => {
      expect(isValidTask({ ...validTask, priority: 'urgent' })).toBe(false);
      expect(isValidTask({ ...validTask, priority: 1 })).toBe(false);
    });

    it('rejects task with invalid completed field', () => {
      expect(isValidTask({ ...validTask, completed: 'true' })).toBe(false);
      expect(isValidTask({ ...validTask, completed: 1 })).toBe(false);
      expect(isValidTask({ ...validTask, completed: null })).toBe(false);
    });

    it('rejects task with invalid createdAt or updatedAt timestamp', () => {
      expect(isValidTask({ ...validTask, createdAt: 'invalid-date' })).toBe(false);
      expect(isValidTask({ ...validTask, updatedAt: 'invalid-date' })).toBe(false);
    });

    it('rejects task missing required keys', () => {
      const missingId = {
        title: validTask.title,
        priority: validTask.priority,
        completed: validTask.completed,
        createdAt: validTask.createdAt,
        updatedAt: validTask.updatedAt,
      };
      expect(isValidTask(missingId)).toBe(false);

      const missingTitle = {
        id: validTask.id,
        priority: validTask.priority,
        completed: validTask.completed,
        createdAt: validTask.createdAt,
        updatedAt: validTask.updatedAt,
      };
      expect(isValidTask(missingTitle)).toBe(false);
    });
  });

  describe('validateTasks', () => {
    it('accepts array of valid tasks', () => {
      const tasks = [validTask, { ...validTask, id: 'task-2', title: 'Second task' }];
      expect(validateTasks(tasks)).toEqual(tasks);
    });

    it('returns empty array when input is empty array', () => {
      expect(validateTasks([])).toEqual([]);
    });

    it('returns empty array when input is not an array', () => {
      expect(validateTasks(null)).toEqual([]);
      expect(validateTasks(undefined)).toEqual([]);
      expect(validateTasks({})).toEqual([]);
      expect(validateTasks('invalid')).toEqual([]);
    });

    it('returns empty array if any item in the array is invalid', () => {
      const corruptedList = [
        validTask,
        { id: 'corrupted', title: '' },
      ];
      expect(validateTasks(corruptedList)).toEqual([]);
    });
  });
});
