import type { Task } from '../types/task';

export interface TaskStatsData {
  total: number;
  completed: number;
  pending: number;
}

/**
 * Pure utility function to compute task metrics in a single O(N) pass.
 * Completely decoupled from React and presentation logic.
 */
export function calculateTaskStats(tasks: readonly Task[]): TaskStatsData {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return { total: 0, completed: 0, pending: 0 };
  }

  let completed = 0;
  const total = tasks.length;

  for (let i = 0; i < total; i++) {
    if (tasks[i]?.completed) {
      completed++;
    }
  }

  return {
    total,
    completed,
    pending: total - completed,
  };
}
