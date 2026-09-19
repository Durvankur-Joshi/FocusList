import { useState, useMemo, useCallback } from 'react';
import type { Task, StatusFilter, PriorityFilter } from '../types/task';
import { filterTasks } from '../lib/filters';

export interface UseTaskFiltersReturn {
  searchQuery: string;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  hasActiveFilters: boolean;
  filteredTasks: Task[];
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setPriorityFilter: (priority: PriorityFilter) => void;
  resetFilters: () => void;
}

/**
 * Custom hook to isolate task filtering state and memoized search/filter computation.
 * Decouples filtering business logic from App.tsx composition layer.
 */
export function useTaskFilters(tasks: Task[]): UseTaskFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const hasActiveFilters = useMemo(
    () => searchQuery.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all',
    [searchQuery, statusFilter, priorityFilter]
  );

  const filteredTasks = useMemo(
    () =>
      filterTasks(tasks, {
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
      }),
    [tasks, searchQuery, statusFilter, priorityFilter]
  );

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  }, []);

  return {
    searchQuery,
    statusFilter,
    priorityFilter,
    hasActiveFilters,
    filteredTasks,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    resetFilters,
  };
}
