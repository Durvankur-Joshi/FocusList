import type { Task, TaskFilters } from '../types/task';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const normalizedQuery = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    // 1. Search filter (case-insensitive substring match on task title)
    if (normalizedQuery !== '' && !task.title.toLowerCase().includes(normalizedQuery)) {
      return false;
    }

    // 2. Status filter
    if (filters.status === 'active' && task.completed) {
      return false;
    }
    if (filters.status === 'completed' && !task.completed) {
      return false;
    }

    // 3. Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    return true;
  });
}
