import type { Task } from '../types/task';
import { TASK_STORAGE_KEY } from '../constants/task';
import { validateTasks } from './validation';

/**
 * Checks if window.localStorage is accessible and writable in the current runtime environment.
 */
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

/**
 * Low-level storage adapter read with exception handling.
 */
export function getStorageItem(key: string): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Low-level storage adapter write with exception handling.
 */
export function setStorageItem(key: string, serializedValue: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, serializedValue);
    return true;
  } catch {
    return false;
  }
}

/**
 * Low-level storage adapter removal with exception handling.
 */
export function removeStorageItem(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads and validates tasks array from localStorage.
 */
export function loadTasks(): Task[] {
  const rawData = getStorageItem(TASK_STORAGE_KEY);
  if (rawData === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawData);
    return validateTasks(parsed);
  } catch {
    return [];
  }
}

/**
 * Validates and persists tasks array to localStorage.
 */
export function saveTasks(tasks: Task[]): boolean {
  const validated = validateTasks(tasks);
  if (validated.length !== tasks.length) {
    return false;
  }

  try {
    return setStorageItem(TASK_STORAGE_KEY, JSON.stringify(validated));
  } catch {
    return false;
  }
}

/**
 * Clears stored tasks from localStorage.
 */
export function clearTasks(): boolean {
  return removeStorageItem(TASK_STORAGE_KEY);
}
