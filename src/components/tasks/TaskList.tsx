import type { Task, UpdateTaskInput } from '../../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

export interface TaskListProps {
  tasks: Task[];
  totalTasksCount?: number;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTaskInput) => boolean;
  onDelete: (id: string) => void;
}

export function TaskList({
  tasks,
  totalTasksCount = tasks.length,
  hasActiveFilters = false,
  onResetFilters,
  onToggle,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    if (totalTasksCount > 0 && hasActiveFilters) {
      return (
        <div
          role="status"
          className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white/50 text-slate-600 space-y-3"
        >
          <h2 className="text-lg font-semibold text-slate-800">No tasks match your filters</h2>
          <p className="text-sm text-slate-500">
            Try adjusting your search query or filter criteria.
          </p>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              aria-label="Clear all active filters"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
            >
              Clear filters
            </button>
          )}
        </div>
      );
    }
    return <EmptyState />;
  }

  return (
    <ul
      className="space-y-2.5 p-0 m-0"
      aria-label="Tasks"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
