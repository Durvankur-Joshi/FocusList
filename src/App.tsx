import { useState } from 'react';
import type { StatusFilter, PriorityFilter } from './types/task';
import { useTasks } from './hooks/useTasks';
import { filterTasks } from './lib/filters';
import { TaskStats } from './components/dashboard/TaskStats';
import { TaskForm } from './components/tasks/TaskForm';
import { TaskFilters } from './components/tasks/TaskFilters';
import { TaskList } from './components/tasks/TaskList';

export default function App() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  const filteredTasks = filterTasks(tasks, {
    search: searchQuery,
    status: statusFilter,
    priority: priorityFilter,
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            FocusList
          </h1>
          <p className="text-slate-600">
            Focus on what matters.
          </p>
        </header>

        {/* Task Statistics - Always reflects total underlying task collection */}
        <section aria-label="Task statistics section">
          <TaskStats tasks={tasks} />
        </section>

        {/* Add Task Form */}
        <section aria-label="Add task section">
          <TaskForm onAddTask={addTask} />
        </section>

        {/* Filters & Search */}
        <section aria-label="Task filters section">
          <TaskFilters
            search={searchQuery}
            status={statusFilter}
            priority={priorityFilter}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* Task List */}
        <section aria-label="Task list section">
          <TaskList
            tasks={filteredTasks}
            totalTasksCount={tasks.length}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </section>
      </div>
    </main>
  );
}
