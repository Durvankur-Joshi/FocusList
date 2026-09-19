import { useState, useRef, type FormEvent } from 'react';
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
      className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4"
      aria-label="Create new task"
      noValidate
    >
      <div className="space-y-1">
        <label
          htmlFor="task-title"
          className="block text-sm font-semibold text-slate-700"
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
          aria-invalid={errorMessage !== null}
          aria-describedby={errorMessage ? 'task-title-error' : undefined}
          className="w-full px-3 py-2 border rounded-lg text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
        />
        {errorMessage && (
          <p
            id="task-title-error"
            role="alert"
            className="text-xs text-rose-600 font-medium mt-1"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <label
            htmlFor="task-priority"
            className="text-sm font-medium text-slate-600 whitespace-nowrap"
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
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
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
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
