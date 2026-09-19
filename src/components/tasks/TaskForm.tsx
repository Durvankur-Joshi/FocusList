import { useState, useRef, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { CreateTaskInput, Priority } from '../../types/task';
import {
  TASK_PRIORITIES,
  PRIORITY_LABELS,
  DEFAULT_PRIORITY,
  TASK_LIMITS,
} from '../../constants/task';
import { validateTaskTitle, isValidPriority } from '../../lib/validation';

export interface TaskFormProps {
  onAddTask: (input: CreateTaskInput) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleValidation = validateTaskTitle(title);
    if (!titleValidation.isValid || !titleValidation.sanitized) {
      setErrorMessage(titleValidation.error || 'Please enter a valid task title.');
      titleInputRef.current?.focus();
      return;
    }

    if (!isValidPriority(priority)) {
      setErrorMessage('Please select a valid priority.');
      return;
    }

    setErrorMessage(null);
    onAddTask({
      title: titleValidation.sanitized,
      priority,
    });

    setTitle('');
    setPriority(DEFAULT_PRIORITY);
    titleInputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-slate-200/90 space-y-3 transition-shadow hover:shadow-sm"
      aria-label="Create new task"
      noValidate
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="flex-1 space-y-1">
          <label
            htmlFor="task-title"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Task Title
          </label>
          <input
            id="task-title"
            ref={titleInputRef}
            type="text"
            value={title}
            maxLength={TASK_LIMITS.MAX_TITLE_LENGTH}
            placeholder="What needs to be done?"
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            aria-invalid={errorMessage ? 'true' : 'false'}
            aria-describedby={errorMessage ? 'task-title-error' : undefined}
            className="w-full h-11 sm:h-10 px-3.5 border rounded-lg text-slate-900 border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
          />
        </div>

        <div className="flex items-end gap-2 shrink-0">
          <div className="space-y-1">
            <label
              htmlFor="task-priority"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap"
            >
              Priority:
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => {
                const value = e.target.value;
                if (isValidPriority(value)) {
                  setPriority(value);
                }
              }}
              className="h-11 sm:h-10 px-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all min-w-[90px]"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="h-11 sm:h-10 px-4 sm:px-5 flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <p
          id="task-title-error"
          role="alert"
          className="text-xs text-rose-600 font-medium pt-0.5 flex items-center gap-1"
        >
          <span>{errorMessage}</span>
        </p>
      )}
    </form>
  );
}
