import { Search, RotateCcw } from 'lucide-react';
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
          className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white/70 text-slate-600 shadow-xs space-y-3"
        >
          <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">No tasks match your filters</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
              Try adjusting your search query or filter criteria.
            </p>
          </div>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              aria-label="Clear all active filters"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      );
    }
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Tasks ({tasks.length})
        </h2>
      </div>

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
    </div>
  );
}
