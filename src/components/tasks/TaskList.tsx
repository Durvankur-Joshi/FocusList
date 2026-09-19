import type { Task, UpdateTaskInput } from '../../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

export interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTaskInput) => boolean;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul
      className="space-y-2.5 p-0 m-0"
      aria-label="Tasks"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
