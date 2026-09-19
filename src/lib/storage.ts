import type { Task } from '../types/task';
import { TASK_STORAGE_KEY } from '../constants/task';
import { validateTasks } from './validation';

export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const testKey = '__focuslist_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function loadTasks(): Task[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const rawData = window.localStorage.getItem(TASK_STORAGE_KEY);
    if (rawData === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(rawData);
    return validateTasks(parsed);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const validated = validateTasks(tasks);
    if (validated.length !== tasks.length) {
      return false;
    }

    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(validated));
    return true;
  } catch {
    return false;
  }
}

export function clearTasks(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(TASK_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
