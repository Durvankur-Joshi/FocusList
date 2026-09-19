import { Search, RotateCcw } from 'lucide-react';
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
      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3.5 transition-shadow hover:shadow-sm"
    >
      {/* Search Input with Icon */}
      <div className="space-y-1">
        <label
          htmlFor="task-search"
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          Search Tasks
        </label>
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="task-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full h-9.5 pl-9 pr-3.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Filters Row: Status segmented controls & Priority dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
        {/* Status segmented group */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-0.5">
            Status:
          </span>
          <div
            role="group"
            aria-label="Filter by status"
            className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200/80"
          >
            {STATUS_FILTERS.map((s) => {
              const isActive = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  aria-pressed={isActive}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {STATUS_FILTER_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority dropdown & Clear filters */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="task-priority-filter"
              className="text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap"
            >
              Priority:
            </label>
            <select
              id="task-priority-filter"
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value as PriorityFilter)}
              className="h-8.5 px-2.5 py-1 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all"
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
              className="inline-flex items-center gap-1 h-8.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" aria-hidden="true" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
