import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/tasks/TaskForm';
import { TaskList } from './components/tasks/TaskList';

export default function App() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            FocusList
          </h1>
          <p className="text-slate-600">
            Focus on what matters.
          </p>
        </header>

        <section aria-label="Add task section">
          <TaskForm onAddTask={addTask} />
        </section>

        <section aria-label="Task list section">
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </section>
      </div>
    </main>
  );
}
