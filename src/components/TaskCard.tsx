import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Calendar, Trash2 } from 'lucide-react';
import { useTaskStore, type Task } from '@/store/taskStore';
import { formatDistanceToNow, isPast } from 'date-fns';

const priorityColors: Record<string, string> = {
  high: 'bg-high',
  medium: 'bg-warning',
  low: 'bg-low',
};

const transition = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

export function TaskCard({ task }: { task: Task }) {
  const { toggleComplete, deleteTask, selectTask, selectedTaskId } = useTaskStore();
  const isSelected = selectedTaskId === task.id;
  const isOverdue = task.status === 'pending' && isPast(new Date(task.dueDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={transition}
      onClick={() => selectTask(task.id)}
      className={`group flex items-center gap-3 px-4 py-3 border-b border-border/40 transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-accent/10' : 'hover:bg-muted/30'
      } ${task.status === 'completed' ? 'opacity-50' : ''}`}
    >
      {/* Priority strip */}
      <div className={`w-0.5 h-8 rounded-full shrink-0 ${priorityColors[task.priority]}`} />

      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        {task.status === 'completed' ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </span>
          {task.aiModified && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" title="AI modified" />
          )}
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
        )}
      </div>

      {/* Labels */}
      <div className="hidden sm:flex gap-1 shrink-0">
        {task.labels.slice(0, 2).map((label) => (
          <span key={label} className="text-[11px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
            {label}
          </span>
        ))}
      </div>

      {/* Due date */}
      <div className={`flex items-center gap-1 text-xs font-mono tabular-nums shrink-0 ${isOverdue ? 'text-high' : 'text-muted-foreground'}`}>
        <Calendar className="w-3 h-3" />
        <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
      </div>

      {/* Priority badge */}
      <span className={`text-[11px] font-medium capitalize px-1.5 py-0.5 rounded shrink-0 ${
        task.priority === 'high' ? 'text-high bg-high/10' :
        task.priority === 'medium' ? 'text-warning bg-warning/10' :
        'text-muted-foreground bg-muted'
      }`}>
        {task.priority}
      </span>

      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
