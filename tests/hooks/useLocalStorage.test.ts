import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../src/hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  const TEST_KEY = 'test_item_key';

  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default_val'));
    expect(result.current[0]).toBe('default_val');
  });

  it('initializes with default value from an initializer function', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, () => 'computed_val'));
    expect(result.current[0]).toBe('computed_val');
  });

  it('initializes with existing valid data in localStorage', () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify({ count: 42 }));
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, { count: 0 }));
    expect(result.current[0]).toEqual({ count: 42 });
  });

  it('falls back to default value if stored JSON is corrupt', () => {
    window.localStorage.setItem(TEST_KEY, 'corrupted{json');
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('falls back to default value if validator returns false', () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify({ count: -1 }));
    const isPositiveNumberRecord = (val: unknown): val is { count: number } =>
      typeof val === 'object' && val !== null && 'count' in val && typeof (val as { count: number }).count === 'number' && (val as { count: number }).count > 0;

    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, { count: 1 }, isPositiveNumberRecord)
    );
    expect(result.current[0]).toEqual({ count: 1 });
  });

  it('updates state and persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('updated'));
  });

  it('supports functional state updates', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(15));
  });

  it('handles localStorage errors gracefully during write', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'safe'));

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });

    // Should update in-memory state without crashing
    act(() => {
      result.current[1]('new_val');
    });

    expect(result.current[0]).toBe('new_val');
  });
});
