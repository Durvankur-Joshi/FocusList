import { useTasks } from './hooks/useTasks';
import { useTaskFilters } from './hooks/useTaskFilters';
import { Header } from './components/layout/Header';
import { TaskStats } from './components/dashboard/TaskStats';
import { TaskForm } from './components/tasks/TaskForm';
import { TaskFilters } from './components/tasks/TaskFilters';
import { TaskList } from './components/tasks/TaskList';

export default function App() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks();
  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    hasActiveFilters,
    filteredTasks,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    resetFilters,
  } = useTaskFilters(tasks);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-7">
        {/* Header */}
        <Header />

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
            onResetFilters={resetFilters}
          />
        </section>

        {/* Task List */}
        <section aria-label="Task list section">
          <TaskList
            tasks={filteredTasks}
            totalTasksCount={tasks.length}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </section>
      </main>
    </div>
  );
}
