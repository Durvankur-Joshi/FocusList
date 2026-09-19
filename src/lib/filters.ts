import type { Task, TaskFilters, StatusFilter, PriorityFilter } from '../types/task';

const VALID_STATUSES: readonly StatusFilter[] = ['all', 'active', 'completed'] as const;
const VALID_PRIORITIES: readonly PriorityFilter[] = ['all', 'high', 'medium', 'low'] as const;

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  if (!Array.isArray(tasks)) {
    return [];
  }

  // Defensively normalize search input
  const normalizedQuery =
    typeof filters?.search === 'string' ? filters.search.trim().toLowerCase() : '';

  // Defensively normalize status filter
  const normalizedStatus =
    filters && VALID_STATUSES.includes(filters.status) ? filters.status : 'all';

  // Defensively normalize priority filter
  const normalizedPriority =
    filters && VALID_PRIORITIES.includes(filters.priority) ? filters.priority : 'all';

  return tasks.filter((task) => {
    // 1. Search filter (safe plain text substring match on task title)
    if (normalizedQuery !== '' && !task.title.toLowerCase().includes(normalizedQuery)) {
      return false;
    }

    // 2. Status filter
    if (normalizedStatus === 'active' && task.completed) {
      return false;
    }
    if (normalizedStatus === 'completed' && !task.completed) {
      return false;
    }

    // 3. Priority filter
    if (normalizedPriority !== 'all' && task.priority !== normalizedPriority) {
      return false;
    }

    return true;
  });
}
