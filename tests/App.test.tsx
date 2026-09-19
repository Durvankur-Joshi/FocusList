import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../src/App';

describe('FocusList App Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const createTask = (title: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const titleInput = screen.getByLabelText(/^task title$/i);
    const form = screen.getByRole('form', { name: /create new task/i });
    const prioritySelect = within(form).getByLabelText(/priority:/i);
    const addBtn = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.change(prioritySelect, { target: { value: priority } });
    fireEvent.click(addBtn);
  };

  it('renders header, tagline, and empty state initially', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'FocusList', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Focus on what matters.')).toBeInTheDocument();
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();

    // Initial statistics
    expect(screen.getByLabelText(/total tasks: 0/i)).toHaveTextContent('0');
    expect(screen.getByLabelText(/completed tasks: 0/i)).toHaveTextContent('0');
    expect(screen.getByLabelText(/pending tasks: 0/i)).toHaveTextContent('0');
  });

  it('performs full task lifecycle: create, toggle, edit, and delete', () => {
    render(<App />);

    // 1. Create a new task
    createTask('Buy groceries', 'high');

    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();

    const taskList = screen.getByRole('list', { name: /tasks/i });
    expect(within(taskList).getByText('Buy groceries')).toBeInTheDocument();
    expect(within(taskList).getByText('High')).toBeInTheDocument();

    // Statistics update
    expect(screen.getByLabelText(/total tasks: 1/i)).toHaveTextContent('1');
    expect(screen.getByLabelText(/pending tasks: 1/i)).toHaveTextContent('1');
    expect(screen.getByLabelText(/completed tasks: 0/i)).toHaveTextContent('0');

    // 2. Toggle completion
    const toggleCheckbox = screen.getByRole('checkbox', {
      name: /mark "buy groceries" as complete/i,
    });
    fireEvent.click(toggleCheckbox);

    expect(within(taskList).getByText('Completed')).toBeInTheDocument();
    expect(toggleCheckbox).toBeChecked();

    // Statistics update after toggle
    expect(screen.getByLabelText(/total tasks: 1/i)).toHaveTextContent('1');
    expect(screen.getByLabelText(/pending tasks: 0/i)).toHaveTextContent('0');
    expect(screen.getByLabelText(/completed tasks: 1/i)).toHaveTextContent('1');

    // 3. Edit the task
    const editBtn = screen.getByRole('button', { name: /edit task: buy groceries/i });
    fireEvent.click(editBtn);

    const editForm = screen.getByRole('form', { name: /edit task: buy groceries/i });
    const editInput = within(editForm).getByLabelText(/edit task title/i);
    const editSelect = within(editForm).getByLabelText(/priority:/i);
    const saveBtn = within(editForm).getByRole('button', { name: /save changes/i });

    fireEvent.change(editInput, { target: { value: 'Buy organic groceries' } });
    fireEvent.change(editSelect, { target: { value: 'medium' } });
    fireEvent.click(saveBtn);

    expect(within(taskList).getByText('Buy organic groceries')).toBeInTheDocument();
    expect(within(taskList).getByText('Medium')).toBeInTheDocument();

    // 4. Delete the task
    const deleteBtn = screen.getByRole('button', {
      name: /delete task: buy organic groceries/i,
    });
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('Buy organic groceries')).not.toBeInTheDocument();
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();

    // Statistics update after delete
    expect(screen.getByLabelText(/total tasks: 0/i)).toHaveTextContent('0');
  });

  it('filters tasks by search, status, and priority while preserving global statistics', () => {
    render(<App />);

    createTask('Alpha Project plan', 'high');
    createTask('Beta Project audit', 'medium');
    createTask('Gamma maintenance', 'low');

    // Mark 'Beta Project audit' as completed
    const betaToggle = screen.getByRole('checkbox', {
      name: /mark "beta project audit" as complete/i,
    });
    fireEvent.click(betaToggle);

    // Verify global stats: Total = 3, Completed = 1, Pending = 2
    expect(screen.getByLabelText(/total tasks: 3/i)).toHaveTextContent('3');
    expect(screen.getByLabelText(/completed tasks: 1/i)).toHaveTextContent('1');
    expect(screen.getByLabelText(/pending tasks: 2/i)).toHaveTextContent('2');

    // --- SEARCH FILTER ---
    const searchInput = screen.getByLabelText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'project' } });

    const taskList = screen.getByRole('list', { name: /tasks/i });
    expect(within(taskList).getByText('Alpha Project plan')).toBeInTheDocument();
    expect(within(taskList).getByText('Beta Project audit')).toBeInTheDocument();
    expect(within(taskList).queryByText('Gamma maintenance')).not.toBeInTheDocument();

    // Stats MUST remain total underlying counts (3, 1, 2)
    expect(screen.getByLabelText(/total tasks: 3/i)).toHaveTextContent('3');

    // --- STATUS FILTER ---
    const activeBtn = screen.getByRole('button', { name: /^active$/i });
    fireEvent.click(activeBtn);

    // Both search 'project' AND status 'active' => only 'Alpha Project plan'
    expect(within(taskList).getByText('Alpha Project plan')).toBeInTheDocument();
    expect(within(taskList).queryByText('Beta Project audit')).not.toBeInTheDocument();

    // --- PRIORITY FILTER ---
    const filterSection = screen.getByRole('search', { name: /task filters/i });
    const prioritySelect = within(filterSection).getByLabelText(/priority:/i);
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });

    // Combined: 'project' + 'active' + 'medium' => 0 matches (Alpha is high)
    expect(screen.getByText(/no tasks match your filters/i)).toBeInTheDocument();

    // --- CLEAR FILTERS BUTTON IN EMPTY STATE ---
    const clearInEmptyState = screen.getByRole('button', {
      name: /clear all active filters/i,
    });
    fireEvent.click(clearInEmptyState);

    // All 3 tasks should reappear
    const restoredTaskList = screen.getByRole('list', { name: /tasks/i });
    expect(within(restoredTaskList).getByText('Alpha Project plan')).toBeInTheDocument();
    expect(within(restoredTaskList).getByText('Beta Project audit')).toBeInTheDocument();
    expect(within(restoredTaskList).getByText('Gamma maintenance')).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });
});
