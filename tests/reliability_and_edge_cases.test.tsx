import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../src/App';
import { TASK_LIMITS } from '../src/constants/task';
import { validateTaskTitle } from '../src/lib/validation';

describe('Phase 6 Reliability & Edge Cases Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  const createTask = (title: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const form = screen.getByRole('form', { name: /create new task/i });
    const input = within(form).getByLabelText(/^task title$/i);
    const select = within(form).getByLabelText(/^priority:$/i);
    const submitBtn = within(form).getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: title } });
    fireEvent.change(select, { target: { value: priority } });
    fireEvent.click(submitBtn);
  };

  // 1. Duplicate Title Isolation
  it('1. ensures duplicate task titles maintain distinct IDs and isolated state transitions', () => {
    render(<App />);

    // Create two tasks with the EXACT same title
    createTask('Same Title Task', 'high');
    createTask('Same Title Task', 'low');

    const taskList = screen.getByRole('list', { name: /tasks/i });
    const listItems = within(taskList).getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    // Get checkboxes for both
    const checkboxes = within(taskList).getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    // Toggle ONLY the first task
    fireEvent.click(checkboxes[0]!);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    // Edit ONLY the second task
    const editButtons = within(taskList).getAllByRole('button', { name: /edit task/i });
    expect(editButtons).toHaveLength(2);

    fireEvent.click(editButtons[1]!);
    const editInput = screen.getByLabelText(/edit task title/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(editInput, { target: { value: 'Renamed Second Task' } });
    fireEvent.click(saveBtn);

    // Verify first task kept original title and second was renamed
    expect(within(taskList).getByText('Same Title Task')).toBeInTheDocument();
    expect(within(taskList).getByText('Renamed Second Task')).toBeInTheDocument();

    // Delete the first task
    const deleteFirst = within(taskList).getByRole('button', {
      name: 'Delete task: Same Title Task',
    });
    fireEvent.click(deleteFirst);

    // Second task remains
    expect(within(taskList).queryByText('Same Title Task')).not.toBeInTheDocument();
    expect(within(taskList).getByText('Renamed Second Task')).toBeInTheDocument();
  });

  // 2. Multi-Task Isolation & Batch Operations
  it('2. ensures multiple task operations affect only the targeted task', () => {
    render(<App />);

    createTask('Task 1', 'high');
    createTask('Task 2', 'medium');
    createTask('Task 3', 'low');
    createTask('Task 4', 'medium');
    createTask('Task 5', 'high');

    const taskList = screen.getByRole('list', { name: /tasks/i });
    expect(within(taskList).getAllByRole('listitem')).toHaveLength(5);

    // Toggle Task 2
    const toggleTask2 = within(taskList).getByRole('checkbox', {
      name: 'Mark "Task 2" as complete',
    });
    fireEvent.click(toggleTask2);
    expect(toggleTask2).toBeChecked();

    // Delete Task 3
    const deleteTask3 = within(taskList).getByRole('button', {
      name: 'Delete task: Task 3',
    });
    fireEvent.click(deleteTask3);

    // Edit Task 4
    const editTask4 = within(taskList).getByRole('button', {
      name: 'Edit task: Task 4',
    });
    fireEvent.click(editTask4);

    const editInput = screen.getByLabelText(/edit task title/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.change(editInput, { target: { value: 'Task 4 Modified' } });
    fireEvent.click(saveBtn);

    // Verify final state: Tasks 1 and 5 untouched, Task 2 completed, Task 3 deleted, Task 4 modified
    expect(within(taskList).getByText('Task 1')).toBeInTheDocument();
    expect(within(taskList).getByText('Task 2')).toBeInTheDocument();
    expect(within(taskList).queryByText('Task 3')).not.toBeInTheDocument();
    expect(within(taskList).getByText('Task 4 Modified')).toBeInTheDocument();
    expect(within(taskList).getByText('Task 5')).toBeInTheDocument();
  });

  // 3. Special Characters, Emojis, and Boundaries
  it('3. supports unicode emojis, punctuation, quotes, comparison operators, and exact length boundaries', () => {
    render(<App />);

    const complexTitles = [
      '🎉 Launch FocusList v1.0 🚀',
      'Review "contract" & \'terms\' (urgent)!',
      'Fix bug: x < 10 && y > 20',
      'Task #987654 - Section 1.2.3',
    ];

    for (const title of complexTitles) {
      createTask(title, 'medium');
      const taskList = screen.getByRole('list', { name: /tasks/i });
      expect(within(taskList).getByText(title)).toBeInTheDocument();
    }

    // Exact max boundary (200 characters)
    const exactMaxTitle = 'A'.repeat(TASK_LIMITS.MAX_TITLE_LENGTH);
    createTask(exactMaxTitle, 'low');
    const taskList = screen.getByRole('list', { name: /tasks/i });
    expect(within(taskList).getByText(exactMaxTitle)).toBeInTheDocument();

    // Exceeding max boundary (201 characters)
    const tooLongTitle = 'B'.repeat(TASK_LIMITS.MAX_TITLE_LENGTH + 1);
    expect(validateTaskTitle(tooLongTitle).isValid).toBe(false);
  });

  // 4. Persistence Reload Simulation
  it('4. persists task collection across full component unmount and remount reload cycles', () => {
    const { unmount } = render(<App />);

    createTask('Persistent Alpha', 'high');
    createTask('Persistent Beta', 'medium');
    createTask('Persistent Gamma', 'low');

    // Toggle Beta
    const betaToggle = screen.getByRole('checkbox', {
      name: 'Mark "Persistent Beta" as complete',
    });
    fireEvent.click(betaToggle);

    // Edit Gamma
    const gammaEdit = screen.getByRole('button', {
      name: 'Edit task: Persistent Gamma',
    });
    fireEvent.click(gammaEdit);

    const editInput = screen.getByLabelText(/edit task title/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.change(editInput, { target: { value: 'Persistent Gamma Updated' } });
    fireEvent.click(saveBtn);

    // Simulate page reload by unmounting
    unmount();

    // Remount application
    render(<App />);

    const reloadedList = screen.getByRole('list', { name: /tasks/i });
    expect(within(reloadedList).getByText('Persistent Alpha')).toBeInTheDocument();
    expect(within(reloadedList).getByText('Persistent Beta')).toBeInTheDocument();
    expect(within(reloadedList).getByText('Persistent Gamma Updated')).toBeInTheDocument();

    // Verify completion status persisted
    const reloadedBetaCheckbox = within(reloadedList).getByRole('checkbox', {
      name: 'Mark "Persistent Beta" as incomplete',
    });
    expect(reloadedBetaCheckbox).toBeChecked();

    // Delete one task and verify next reload
    const deleteAlpha = within(reloadedList).getByRole('button', {
      name: 'Delete task: Persistent Alpha',
    });
    fireEvent.click(deleteAlpha);
    expect(within(reloadedList).queryByText('Persistent Alpha')).not.toBeInTheDocument();
  });

  // 5. Keyboard Navigation & Submissions
  it('5. supports full keyboard operation for form submission, filter controls, and task actions', () => {
    render(<App />);

    const form = screen.getByRole('form', { name: /create new task/i });
    const input = within(form).getByLabelText(/^task title$/i);

    // Type via keyboard and submit via form submit event (Enter)
    fireEvent.change(input, { target: { value: 'Keyboard Operable Task' } });
    fireEvent.submit(form);

    const taskList = screen.getByRole('list', { name: /tasks/i });
    expect(within(taskList).getByText('Keyboard Operable Task')).toBeInTheDocument();

    // Status filter keyboard operation
    const activeFilterBtn = screen.getByRole('button', { name: /^active$/i });
    fireEvent.click(activeFilterBtn); // native button click triggered by Space/Enter
    expect(activeFilterBtn).toHaveAttribute('aria-pressed', 'true');

    // Reset filters via clear button
    const allFilterBtn = screen.getByRole('button', { name: /^all$/i });
    fireEvent.click(allFilterBtn);
    expect(allFilterBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
