import { useMemo } from 'react';
import { ListTodo, CheckCircle2, Clock } from 'lucide-react';
import type { Task } from '../../types/task';
import { calculateTaskStats } from '../../lib/stats';

export interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const { total, completed, pending } = useMemo(() => calculateTaskStats(tasks), [tasks]);

  return (
    <dl
      role="region"
      aria-label="Task statistics"
      className="grid grid-cols-3 gap-2 sm:gap-4 m-0 p-0"
    >
      {/* Total Tasks */}
      <div className="flex flex-col justify-between p-2.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors min-w-0">
        <div className="flex items-center justify-between gap-1">
          <dt className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            Total
          </dt>
          <ListTodo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" aria-hidden="true" />
        </div>
        <dd
          className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight text-slate-900 m-0"
          aria-label={`Total tasks: ${total}`}
        >
          {total}
        </dd>
      </div>

      {/* Completed Tasks */}
      <div className="flex flex-col justify-between p-2.5 sm:p-4 rounded-xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-colors min-w-0">
        <div className="flex items-center justify-between gap-1">
          <dt className="text-[11px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">
            Completed
          </dt>
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" aria-hidden="true" />
        </div>
        <dd
          className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight text-emerald-700 m-0"
          aria-label={`Completed tasks: ${completed}`}
        >
          {completed}
        </dd>
      </div>

      {/* Pending Tasks */}
      <div className="flex flex-col justify-between p-2.5 sm:p-4 rounded-xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-300 transition-colors min-w-0">
        <div className="flex items-center justify-between gap-1">
          <dt className="text-[11px] sm:text-xs font-semibold text-amber-700 uppercase tracking-wider truncate">
            Pending
          </dt>
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" aria-hidden="true" />
        </div>
        <dd
          className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight text-amber-700 m-0"
          aria-label={`Pending tasks: ${pending}`}
        >
          {pending}
        </dd>
      </div>
    </dl>
  );
}
