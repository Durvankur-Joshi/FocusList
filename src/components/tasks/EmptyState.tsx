export function EmptyState() {
  return (
    <div
      role="status"
      className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white/50 text-slate-600"
    >
      <h2 className="text-lg font-semibold text-slate-800">No tasks yet</h2>
      <p className="mt-1 text-sm text-slate-500">
        Add your first task above to start organizing your work.
      </p>
    </div>
  );
}
