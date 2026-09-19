import type { Priority } from '../types/task';

export const TASK_PRIORITIES: readonly Priority[] = ['high', 'medium', 'low'] as const;

export const DEFAULT_PRIORITY: Priority = 'medium';

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const TASK_STORAGE_KEY = 'focuslist:tasks';

export const TASK_LIMITS = {
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
} as const;
