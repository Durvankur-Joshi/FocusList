import { ListTodo, CheckCircle2, Clock } from 'lucide-react';
import type { Task } from '../../types/task';

export interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;

  return (
    <div
      role="region"
      aria-label="Task statistics"
      className="grid grid-cols-3 gap-3 sm:gap-4"
    >
      {/* Total Tasks */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between gap-1">
          <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            Total
          </dt>
          <ListTodo className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        </div>
        <dd
          className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
          aria-label={`Total tasks: ${total}`}
        >
          {total}
        </dd>
      </div>

      {/* Completed Tasks */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-colors">
        <div className="flex items-center justify-between gap-1">
          <dt className="text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">
            Completed
          </dt>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
        </div>
        <dd
          className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700"
          aria-label={`Completed tasks: ${completed}`}
        >
          {completed}
        </dd>
      </div>

      {/* Pending Tasks */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between gap-1">
          <dt className="text-xs font-semibold text-amber-700 uppercase tracking-wider truncate">
            Pending
          </dt>
          <Clock className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
        </div>
        <dd
          className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-amber-700"
          aria-label={`Pending tasks: ${pending}`}
        >
          {pending}
        </dd>
      </div>
    </div>
  );
}
