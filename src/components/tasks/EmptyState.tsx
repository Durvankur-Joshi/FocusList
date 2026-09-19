import { ClipboardList } from 'lucide-react';

export function EmptyState() {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white/70 text-slate-600 shadow-xs"
    >
      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <ClipboardList className="w-5 h-5" aria-hidden="true" />
      </div>
      <h2 className="text-base font-semibold text-slate-800">No tasks yet</h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
        Add your first task above to start organizing your work.
      </p>
    </div>
  );
}
