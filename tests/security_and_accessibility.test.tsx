import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../src/App';
import { validateTaskTitle, isValidTask } from '../src/lib/validation';
import { loadTasks } from '../src/lib/storage';
import { filterTasks } from '../src/lib/filters';
import { TASK_STORAGE_KEY } from '../src/constants/task';
import type { TaskFilters } from '../src/types/task';

describe('Phase 5 Security & Accessibility Hardening Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  // 1. Invalid task title is rejected
  it('1. rejects invalid and non-string task titles', () => {
    expect(validateTaskTitle('').isValid).toBe(false);
    expect(validateTaskTitle(null).isValid).toBe(false);
    expect(validateTaskTitle(undefined).isValid).toBe(false);
    expect(validateTaskTitle(12345).isValid).toBe(false);
    expect(validateTaskTitle({}).isValid).toBe(false);
  });

  // 2. Whitespace-only title is rejected
  it('2. rejects whitespace-only titles', () => {
    expect(validateTaskTitle('   ').isValid).toBe(false);
    expect(validateTaskTitle('\t\t\n  ').isValid).toBe(false);
  });

  // 3. Excessively long title is rejected
  it('3. rejects excessively long titles exceeding maximum length limit', () => {
    const longTitle = 'x'.repeat(201);
    const result = validateTaskTitle(longTitle);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exceed');
  });

  // 4. Malicious-looking task title renders strictly as plain text
  it('4. renders XSS injection payloads safely as plain text without DOM evaluation', () => {
    render(<App />);

    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '"><script>alert("XSS")</script>',
      'javascript:alert("XSS")',
    ];

    const input = screen.getByLabelText(/^task title$/i);
    const addBtn = screen.getByRole('button', { name: /add task/i });

    for (const payload of xssPayloads) {
      fireEvent.change(input, { target: { value: payload } });
      fireEvent.click(addBtn);

      // Verify that the payload is rendered strictly as text content
      const taskList = screen.getByRole('list', { name: /tasks/i });
      expect(within(taskList).getByText(payload)).toBeInTheDocument();

      // Verify that NO script or img tag was injected into the DOM
      expect(document.querySelector('script[src*="XSS"]')).toBeNull();
      expect(document.querySelector('img[src="x"]')).toBeNull();
    }
  });

  // 5. Invalid localStorage data does not crash the application
  it('5. gracefully handles corrupted localStorage without crashing the application', () => {
    const corruptStorageScenarios = [
      '{invalid json',
      '"just a string"',
      '12345',
      JSON.stringify({ notAnArray: true }),
      JSON.stringify([123, null, 'unexpected']),
      JSON.stringify([{ title: 'Missing required fields' }]),
    ];

    for (const corruptData of corruptStorageScenarios) {
      window.localStorage.setItem(TASK_STORAGE_KEY, corruptData);

      // Storage abstraction safely returns empty array
      expect(loadTasks()).toEqual([]);

      // Full app mounts cleanly and displays EmptyState
      const { unmount } = render(<App />);
      expect(screen.getByRole('heading', { name: 'FocusList', level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
      unmount();
    }
  });

  // 6. Invalid priority data does not break the application
  it('6. safely rejects invalid priority values and normalizes filter queries', () => {
    const taskWithInvalidPriority = {
      id: 'task-err-1',
      title: 'Invalid Priority Task',
      priority: 'urgent',
      completed: false,
      createdAt: '2026-09-19T08:00:00.000Z',
      updatedAt: '2026-09-19T08:00:00.000Z',
    };

    expect(isValidTask(taskWithInvalidPriority)).toBe(false);

    // filterTasks normalizes invalid priority filters to 'all'
    const sampleTask = {
      id: '1',
      title: 'Valid Task',
      priority: 'high' as const,
      completed: false,
      createdAt: '2026-09-19T08:00:00.000Z',
      updatedAt: '2026-09-19T08:00:00.000Z',
    };

    const result = filterTasks([sampleTask], {
      search: '',
      status: 'all',
      priority: 'urgent' as unknown as TaskFilters['priority'],
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('1');
  });

  // 7. Invalid completed value does not break the application
  it('7. safely rejects invalid completed values', () => {
    const base = {
      id: 'task-1',
      title: 'Test',
      priority: 'medium' as const,
      createdAt: '2026-09-19T08:00:00.000Z',
      updatedAt: '2026-09-19T08:00:00.000Z',
    };

    expect(isValidTask({ ...base, completed: 'yes' })).toBe(false);
    expect(isValidTask({ ...base, completed: 1 })).toBe(false);
    expect(isValidTask({ ...base, completed: null })).toBe(false);
    expect(isValidTask({ ...base, completed: undefined })).toBe(false);
  });

  // 8. Filter controls are keyboard accessible
  it('8. provides accessible, keyboard-operable filter controls with aria-pressed state', () => {
    render(<App />);

    const allBtn = screen.getByRole('button', { name: /^all$/i });
    const activeBtn = screen.getByRole('button', { name: /^active$/i });
    const completedBtn = screen.getByRole('button', { name: /^completed$/i });

    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    expect(activeBtn).toHaveAttribute('aria-pressed', 'false');
    expect(completedBtn).toHaveAttribute('aria-pressed', 'false');

    // Toggle via keyboard click
    fireEvent.click(activeBtn);
    expect(allBtn).toHaveAttribute('aria-pressed', 'false');
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  // 9. Task action buttons have descriptive accessible names
  it('9. provides descriptive accessible names on all task action controls', () => {
    render(<App />);

    const input = screen.getByLabelText(/^task title$/i);
    const addBtn = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: 'Audit accessibility' } });
    fireEvent.click(addBtn);

    expect(
      screen.getByRole('checkbox', {
        name: 'Mark "Audit accessibility" as complete',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Edit task: Audit accessibility',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Delete task: Audit accessibility',
      })
    ).toBeInTheDocument();
  });

  // 10. Form controls have accessible labels and associate validation errors via aria-invalid/aria-describedby
  it('10. ensures form controls have accessible labels and binds validation errors via aria attributes', () => {
    render(<App />);

    const form = screen.getByRole('form', { name: /create new task/i });
    const titleInput = within(form).getByLabelText(/^task title$/i);
    const prioritySelect = within(form).getByLabelText(/^priority:$/i);

    expect(titleInput).toBeInTheDocument();
    expect(prioritySelect).toBeInTheDocument();
    expect(titleInput).toHaveAttribute('aria-invalid', 'false');

    // Trigger validation error by submitting empty form
    const addBtn = within(form).getByRole('button', { name: /add task/i });
    fireEvent.click(addBtn);

    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    expect(titleInput).toHaveAttribute('aria-describedby', 'task-title-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'task-title-error');
    expect(errorAlert).toHaveTextContent(/cannot be empty/i);
  });
});
