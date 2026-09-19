import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../src/App';

describe('FocusList App Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders header, tagline, and empty state initially', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'FocusList', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Focus on what matters.')).toBeInTheDocument();
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('performs full task lifecycle: create, toggle, edit, and delete', () => {
    render(<App />);

    // 1. Create a new task
    const input = screen.getByLabelText(/task title/i);
    const select = screen.getByLabelText(/priority:/i);
    const addBtn = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: 'Buy groceries' } });
    fireEvent.change(select, { target: { value: 'high' } });
    fireEvent.click(addBtn);

    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();

    const taskList = screen.getByRole('list', { name: /tasks/i });
    expect(within(taskList).getByText('Buy groceries')).toBeInTheDocument();
    expect(within(taskList).getByText('High')).toBeInTheDocument();

    // 2. Toggle completion
    const toggleCheckbox = screen.getByRole('checkbox', {
      name: /mark "buy groceries" as complete/i,
    });
    fireEvent.click(toggleCheckbox);

    expect(within(taskList).getByText('Completed')).toBeInTheDocument();
    expect(toggleCheckbox).toBeChecked();

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
  });
});
