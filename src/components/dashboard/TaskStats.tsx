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
      className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
    >
      <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
        <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Total Tasks
        </dt>
        <dd className="mt-1 text-2xl font-bold text-slate-900" aria-label={`Total tasks: ${total}`}>
          {total}
        </dd>
      </div>

      <div className="text-center p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
        <dt className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
          Completed
        </dt>
        <dd className="mt-1 text-2xl font-bold text-emerald-700" aria-label={`Completed tasks: ${completed}`}>
          {completed}
        </dd>
      </div>

      <div className="text-center p-2 rounded-lg bg-amber-50/50 border border-amber-100">
        <dt className="text-xs font-medium text-amber-700 uppercase tracking-wider">
          Pending
        </dt>
        <dd className="mt-1 text-2xl font-bold text-amber-700" aria-label={`Pending tasks: ${pending}`}>
          {pending}
        </dd>
      </div>
    </div>
  );
}
