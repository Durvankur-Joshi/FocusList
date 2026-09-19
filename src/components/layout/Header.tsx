import { Calendar } from 'lucide-react';

export function Header() {
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          FocusList
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Focus on what matters.
        </p>
      </div>

      <div
        className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600"
        aria-label={`Today is ${currentDate}`}
      >
        <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
        <span>{currentDate}</span>
      </div>
    </header>
  );
}
