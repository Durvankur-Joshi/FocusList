import type { StatusFilter, PriorityFilter } from '../../types/task';
import {
  STATUS_FILTERS,
  STATUS_FILTER_LABELS,
  PRIORITY_FILTERS,
  PRIORITY_FILTER_LABELS,
} from '../../constants/task';

export interface TaskFiltersProps {
  search: string;
  status: StatusFilter;
  priority: PriorityFilter;
  hasActiveFilters: boolean;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onPriorityChange: (priority: PriorityFilter) => void;
  onResetFilters: () => void;
}

export function TaskFilters({
  search,
  status,
  priority,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onResetFilters,
}: TaskFiltersProps) {
  return (
    <div
      role="search"
      aria-label="Task filters"
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4"
    >
      {/* Search Input */}
      <div className="space-y-1">
        <label
          htmlFor="task-search"
          className="block text-xs font-semibold text-slate-700"
        >
          Search Tasks
        </label>
        <input
          id="task-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {/* Status Buttons & Priority Select */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Status:</span>
          <div
            role="group"
            aria-label="Filter by status"
            className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200"
          >
            {STATUS_FILTERS.map((s) => {
              const isActive = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  aria-pressed={isActive}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {STATUS_FILTER_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="task-priority-filter"
              className="text-xs font-medium text-slate-500 whitespace-nowrap"
            >
              Priority:
            </label>
            <select
              id="task-priority-filter"
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value as PriorityFilter)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {PRIORITY_FILTERS.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_FILTER_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              aria-label="Clear all filters"
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
