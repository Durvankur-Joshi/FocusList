import type { Priority, Task } from '../types/task';
import { TASK_LIMITS, TASK_PRIORITIES } from '../constants/task';

export interface TitleValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export function isValidPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (TASK_PRIORITIES as readonly string[]).includes(value);
}

export function isValidId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return false;
  }
  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp);
}

export function validateTaskTitle(value: unknown): TitleValidationResult {
  if (typeof value !== 'string') {
    return {
      isValid: false,
      error: 'Task title must be a string.',
    };
  }

  const trimmed = value.trim();

  if (trimmed.length < TASK_LIMITS.MIN_TITLE_LENGTH) {
    return {
      isValid: false,
      error: 'Task title cannot be empty or whitespace only.',
    };
  }

  if (trimmed.length > TASK_LIMITS.MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Task title must not exceed ${TASK_LIMITS.MAX_TITLE_LENGTH} characters.`,
    };
  }

  return {
    isValid: true,
    sanitized: trimmed,
  };
}

export function isValidTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  if (!isValidId(record['id'])) {
    return false;
  }

  if (!validateTaskTitle(record['title']).isValid) {
    return false;
  }

  if (!isValidPriority(record['priority'])) {
    return false;
  }

  if (typeof record['completed'] !== 'boolean') {
    return false;
  }

  if (!isValidTimestamp(record['createdAt'])) {
    return false;
  }

  if (!isValidTimestamp(record['updatedAt'])) {
    return false;
  }

  return true;
}

export function validateTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const allValid = value.every(isValidTask);
  if (!allValid) {
    return [];
  }

  return value;
}
