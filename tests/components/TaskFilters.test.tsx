import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFilters } from '../../src/components/tasks/TaskFilters';

describe('TaskFilters Component', () => {
  it('renders search input, status button group, and priority dropdown', () => {
    render(
      <TaskFilters
        search=""
        status="all"
        priority="all"
        hasActiveFilters={false}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/search tasks/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /filter by status/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^all$/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^active$/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /^completed$/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText(/priority:/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear all filters/i })).not.toBeInTheDocument();
  });

  it('triggers onSearchChange when user types', () => {
    const handleSearch = vi.fn();
    render(
      <TaskFilters
        search=""
        status="all"
        priority="all"
        hasActiveFilters={false}
        onSearchChange={handleSearch}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/search tasks/i);
    fireEvent.change(input, { target: { value: 'meeting' } });

    expect(handleSearch).toHaveBeenCalledWith('meeting');
  });

  it('triggers onStatusChange when clicking status buttons', () => {
    const handleStatus = vi.fn();
    render(
      <TaskFilters
        search=""
        status="all"
        priority="all"
        hasActiveFilters={false}
        onSearchChange={vi.fn()}
        onStatusChange={handleStatus}
        onPriorityChange={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^active$/i }));
    expect(handleStatus).toHaveBeenCalledWith('active');

    fireEvent.click(screen.getByRole('button', { name: /^completed$/i }));
    expect(handleStatus).toHaveBeenCalledWith('completed');
  });

  it('triggers onPriorityChange when selecting priority', () => {
    const handlePriority = vi.fn();
    render(
      <TaskFilters
        search=""
        status="all"
        priority="all"
        hasActiveFilters={false}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={handlePriority}
        onResetFilters={vi.fn()}
      />
    );

    const select = screen.getByLabelText(/priority:/i);
    fireEvent.change(select, { target: { value: 'high' } });

    expect(handlePriority).toHaveBeenCalledWith('high');
  });

  it('shows clear filters button when filters are active and triggers onResetFilters', () => {
    const handleReset = vi.fn();
    render(
      <TaskFilters
        search="test"
        status="active"
        priority="high"
        hasActiveFilters={true}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onResetFilters={handleReset}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear all filters/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
