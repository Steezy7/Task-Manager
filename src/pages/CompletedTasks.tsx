import { AppSidebar } from '@/components/AppSidebar';
import { Topbar } from '@/components/Topbar';
import { useTaskStore } from '@/store/taskStore';
import { TaskCard } from '@/components/TaskCard';
import { TaskInspector } from '@/components/TaskInspector';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function CompletedTasks() {
  const tasks = useTaskStore((s) => s.tasks);
  const completed = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <div className="px-5 py-3 border-b border-border/40 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-sm font-semibold text-foreground">Completed Tasks</span>
          <span className="ml-auto text-xs text-muted-foreground font-mono tabular-nums">
            {completed.length} task{completed.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {completed.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
          {completed.length === 0 && (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No completed tasks yet
            </div>
          )}
        </div>
      </div>
      <TaskInspector />
    </div>
  );
}
