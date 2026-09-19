import { useCallback } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput, Priority } from '../types/task';
import { TASK_STORAGE_KEY, DEFAULT_PRIORITY } from '../constants/task';
import { useLocalStorage } from './useLocalStorage';
import { validateTaskTitle, isValidPriority, isValidTask } from '../lib/validation';
import { generateId, createTimestamp } from '../lib/utils';

function isValidTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isValidTask);
}

export interface UseTasksReturn {
  tasks: Task[];
  addTask: (input: CreateTaskInput) => Task | null;
  updateTask: (id: string, updates: UpdateTaskInput) => boolean;
  toggleTask: (id: string) => boolean;
  deleteTask: (id: string) => boolean;
  clearAllTasks: () => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    TASK_STORAGE_KEY,
    [],
    isValidTaskList
  );

  const addTask = useCallback(
    (input: CreateTaskInput): Task | null => {
      if (!input || typeof input !== 'object') {
        return null;
      }

      const titleValidation = validateTaskTitle(input.title);
      if (!titleValidation.isValid || !titleValidation.sanitized) {
        return null;
      }

      const priority: Priority = input.priority !== undefined ? input.priority : DEFAULT_PRIORITY;
      if (!isValidPriority(priority)) {
        return null;
      }

      const now = createTimestamp();
      const newTask: Task = {
        id: generateId(),
        title: titleValidation.sanitized,
        priority,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prevTasks) => [newTask, ...prevTasks]);
      return newTask;
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: UpdateTaskInput): boolean => {
      if (!id || typeof id !== 'string' || !updates || typeof updates !== 'object') {
        return false;
      }

      const target = tasks.find((t) => t.id === id);
      if (!target) {
        return false;
      }

      let hasValidUpdate = false;
      let sanitizedTitle: string | undefined;
      let validatedPriority: Priority | undefined;
      let validatedCompleted: boolean | undefined;

      if (updates.title !== undefined) {
        const titleValidation = validateTaskTitle(updates.title);
        if (!titleValidation.isValid || !titleValidation.sanitized) {
          return false;
        }
        sanitizedTitle = titleValidation.sanitized;
        hasValidUpdate = true;
      }

      if (updates.priority !== undefined) {
        if (!isValidPriority(updates.priority)) {
          return false;
        }
        validatedPriority = updates.priority;
        hasValidUpdate = true;
      }

      if (updates.completed !== undefined) {
        if (typeof updates.completed !== 'boolean') {
          return false;
        }
        validatedCompleted = updates.completed;
        hasValidUpdate = true;
      }

      if (!hasValidUpdate) {
        return false;
      }

      const now = createTimestamp();

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id !== id) {
            return task;
          }
          return {
            ...task,
            ...(sanitizedTitle !== undefined ? { title: sanitizedTitle } : {}),
            ...(validatedPriority !== undefined ? { priority: validatedPriority } : {}),
            ...(validatedCompleted !== undefined ? { completed: validatedCompleted } : {}),
            updatedAt: now,
          };
        })
      );

      return true;
    },
    [tasks, setTasks]
  );

  const toggleTask = useCallback(
    (id: string): boolean => {
      if (!id || typeof id !== 'string') {
        return false;
      }

      const target = tasks.find((t) => t.id === id);
      if (!target) {
        return false;
      }

      const now = createTimestamp();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                updatedAt: now,
              }
            : task
        )
      );

      return true;
    },
    [tasks, setTasks]
  );

  const deleteTask = useCallback(
    (id: string): boolean => {
      if (!id || typeof id !== 'string') {
        return false;
      }

      const target = tasks.find((t) => t.id === id);
      if (!target) {
        return false;
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      return true;
    },
    [tasks, setTasks]
  );

  const clearAllTasks = useCallback((): void => {
    setTasks([]);
  }, [setTasks]);

  return {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearAllTasks,
  };
}
