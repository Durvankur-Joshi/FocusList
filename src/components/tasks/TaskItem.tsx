import { useState, memo, type FormEvent } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';
import type { Task, Priority, UpdateTaskInput } from '../../types/task';
import {
  TASK_PRIORITIES,
  PRIORITY_LABELS,
  TASK_LIMITS,
} from '../../constants/task';
import { validateTaskTitle, isValidPriority } from '../../lib/validation';

export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTaskInput) => boolean;
  onDelete: (id: string) => void;
}

const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-blue-50 text-blue-700 border-blue-200',
};

const PRIORITY_GLYPHS: Record<Priority, string> = {
  high: '▲',
  medium: '■',
  low: '▼',
};

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editError, setEditError] = useState<string | null>(null);

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditError(null);
    setIsEditing(false);
  };

  const handleSaveEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleValidation = validateTaskTitle(editTitle);
    if (!titleValidation.isValid || !titleValidation.sanitized) {
      setEditError(titleValidation.error || 'Please enter a valid title.');
      return;
    }

    if (!isValidPriority(editPriority)) {
      setEditError('Please select a valid priority.');
      return;
    }

    const success = onUpdate(task.id, {
      title: titleValidation.sanitized,
      priority: editPriority,
    });

    if (success) {
      setIsEditing(false);
      setEditError(null);
    } else {
      setEditError('Failed to update task. Please try again.');
    }
  };

  if (isEditing) {
    return (
      <li className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-300 shadow-sm list-none transition-all">
        <form
          onSubmit={handleSaveEdit}
          className="space-y-3"
          aria-label={`Edit task: ${task.title}`}
          noValidate
        >
          <div className="space-y-1">
            <label
              htmlFor={`edit-title-${task.id}`}
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              Edit Title
            </label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              value={editTitle}
              maxLength={TASK_LIMITS.MAX_TITLE_LENGTH}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) {
                  setEditError(null);
                }
              }}
              aria-label="Edit task title"
              aria-invalid={editError !== null}
              aria-describedby={editError ? `edit-title-error-${task.id}` : undefined}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            {editError && (
              <p
                id={`edit-title-error-${task.id}`}
                role="alert"
                className="text-xs text-rose-600 font-medium pt-0.5"
              >
                {editError}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor={`edit-priority-${task.id}`}
                className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
              >
                Priority:
              </label>
              <select
                id={`edit-priority-${task.id}`}
                value={editPriority}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isValidPriority(val)) {
                    setEditPriority(val);
                  }
                }}
                className="h-8.5 px-2.5 py-1 border border-slate-300 rounded-md text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                aria-label={`Cancel editing "${task.title}"`}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                aria-label={`Save changes for "${task.title}"`}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`p-3.5 sm:p-4 rounded-xl border transition-all list-none ${
        task.completed
          ? 'bg-slate-50/80 border-slate-200 opacity-90'
          : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            id={`task-toggle-${task.id}`}
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={`Mark "${task.title}" as ${
              task.completed ? 'incomplete' : 'complete'
            }`}
            className="mt-0.5 h-4.5 w-4.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer transition-transform active:scale-95 shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-sm font-medium leading-snug break-words [overflow-wrap:anywhere] transition-colors ${
                  task.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-900'
                }`}
              >
                {task.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  PRIORITY_BADGE_STYLES[task.priority]
                }`}
              >
                <span className="text-[9px] leading-none opacity-75" aria-hidden="true">
                  {PRIORITY_GLYPHS[task.priority]}
                </span>
                <span>{PRIORITY_LABELS[task.priority]}</span>
              </span>

              {task.completed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                  <span>Completed</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <button
            type="button"
            onClick={handleStartEdit}
            aria-label={`Edit task: ${task.title}`}
            className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 sm:px-2.5 sm:py-1 gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <Pencil className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-slate-500" aria-hidden="true" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.title}`}
            className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 sm:px-2.5 sm:py-1 gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100 rounded-md border border-rose-200/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-rose-500" aria-hidden="true" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </li>
  );
});
