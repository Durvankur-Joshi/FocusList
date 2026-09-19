import { useState, useCallback } from 'react';

export type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(key: string, serializedValue: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(key, serializedValue);
    return true;
  } catch {
    return false;
  }
}

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

        try {
          const serialized = JSON.stringify(resolvedValue);
          setStorageItem(key, serialized);
        } catch {
          // Gracefully ignore serialization errors
        }

        return resolvedValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
