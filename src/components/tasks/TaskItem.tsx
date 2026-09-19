import { useState, type FormEvent } from 'react';
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

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
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
      <li className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm list-none">
        <form
          onSubmit={handleSaveEdit}
          className="space-y-3"
          aria-label={`Edit task: ${task.title}`}
          noValidate
        >
          <div className="space-y-1">
            <label
              htmlFor={`edit-title-${task.id}`}
              className="block text-xs font-semibold text-slate-700"
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
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {editError && (
              <p
                id={`edit-title-error-${task.id}`}
                role="alert"
                className="text-xs text-rose-600 font-medium"
              >
                {editError}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor={`edit-priority-${task.id}`}
                className="text-xs font-medium text-slate-600"
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
                className="px-2 py-1 border border-slate-300 rounded-md text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                aria-label={`Save changes for "${task.title}"`}
                className="px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
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
      className={`p-4 rounded-xl border transition-all list-none ${
        task.completed
          ? 'bg-slate-50/80 border-slate-200'
          : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
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
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-sm font-medium break-words ${
                  task.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-900'
                }`}
              >
                {task.title}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  PRIORITY_BADGE_STYLES[task.priority]
                }`}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
              {task.completed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleStartEdit}
            aria-label={`Edit task: ${task.title}`}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.title}`}
            className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
