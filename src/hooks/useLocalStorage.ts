import { useState, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../lib/storage';

export type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

/**
 * Generic persistence hook connecting React state to the storage infrastructure adapter.
 * Performs I/O reads strictly during initial state hydration.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  validator?: (value: unknown) => value is T
): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const rawValue = getStorageItem(key);
    if (rawValue !== null) {
      try {
        const parsed: unknown = JSON.parse(rawValue);
        if (validator) {
          if (validator(parsed)) {
            return parsed;
          }
        } else {
          return parsed as T;
        }
      } catch {
        // Corrupted JSON - fall back to initial value
      }
    }

    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStoredValue((currentValue) => {
        const resolvedValue =
          typeof value === 'function'
            ? (value as (prevValue: T) => T)(currentValue)
            : value;

        if (resolvedValue !== currentValue) {
          try {
            const serialized = JSON.stringify(resolvedValue);
            setStorageItem(key, serialized);
          } catch {
            // Gracefully ignore serialization errors
          }
        }

        return resolvedValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
