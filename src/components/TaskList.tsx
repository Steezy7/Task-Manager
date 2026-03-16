import { AnimatePresence } from 'framer-motion';
import { useTaskStore, useFilteredTasks, type Priority, type TaskStatus } from '@/store/taskStore';
import { TaskCard } from './TaskCard';

const statusOptions: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

const priorityOptions: { label: string; value: Priority | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export function TaskList() {
  const { filterStatus, filterPriority, setFilterStatus, setFilterPriority } = useTaskStore();
  const tasks = useFilteredTasks();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Filter bar */}
      <div className="flex items-center gap-4 px-5 py-2.5 border-b border-border/40">
        <div className="flex items-center gap-1">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mr-1">Status</span>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filterStatus === opt.value ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mr-1">Priority</span>
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterPriority(opt.value)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filterPriority === opt.value ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-muted-foreground font-mono tabular-nums">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
}
