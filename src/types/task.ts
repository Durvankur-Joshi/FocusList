export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  priority?: Priority;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: Priority;
  completed?: boolean;
}

export type StatusFilter = 'all' | 'active' | 'completed';

export type PriorityFilter = 'all' | Priority;

export interface TaskFilters {
  search: string;
  status: StatusFilter;
  priority: PriorityFilter;
}

