import { X, Sparkles, Calendar, Tag } from 'lucide-react';
import { useTaskStore, type Priority } from '@/store/taskStore';
import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const aiSuggestions = [
  'Consider breaking this into subtasks for better tracking.',
  'Based on the deadline, this should be prioritized higher.',
  'Similar tasks were completed faster with pair programming.',
  'This task has dependencies — check the auth module first.',
];

export function TaskInspector() {
  const { tasks, selectedTaskId, setInspectorOpen, inspectorOpen, updateTask } = useTaskStore();
  const task = tasks.find((t) => t.id === selectedTaskId);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  const handleAiSuggest = () => {
    setAiLoading(true);
    setAiTip(null);
    setTimeout(() => {
      setAiTip(aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)]);
      setAiLoading(false);
    }, 1200);
  };

  if (!inspectorOpen || !task) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-80 border-l border-border bg-card h-screen sticky top-0 flex flex-col shrink-0"
      >
        <div className="h-12 flex items-center justify-between px-4 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Task Details</span>
          <button onClick={() => setInspectorOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Title</label>
            <input
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Description</label>
            <textarea
              value={task.description}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              rows={4}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Priority</label>
            <div className="flex gap-1 mt-1">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => updateTask(task.id, { priority: p })}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                    task.priority === p
                      ? p === 'high' ? 'bg-high/20 text-high' : p === 'medium' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {task.dueDate && (
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due Date
              </label>
              <input
                type="date"
                value={task.dueDate.slice(0, 10)}
                onChange={(e) => updateTask(task.id, { dueDate: new Date(e.target.value).toISOString() })}
                className="bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground font-mono mt-1 focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
              <Tag className="w-3 h-3" /> Labels
            </label>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.labels.map((label) => (
                <span key={label} className="text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {label}
                </span>
              ))}
              {task.labels.length === 0 && <span className="text-xs text-muted-foreground">No labels</span>}
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-mono space-y-1 pt-2 border-t border-border">
            <p>Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
          </div>

          <div className="pt-2">
            <Button variant="ai" size="sm" className="w-full gap-1.5 text-xs" onClick={handleAiSuggest}>
              <Sparkles className="w-3.5 h-3.5" />
              {aiLoading ? 'Analyzing...' : 'Get AI Insight'}
            </Button>
            {aiLoading && <div className="mt-2 h-10 rounded-md animate-shimmer" />}
            {aiTip && !aiLoading && (
              <div className="mt-2 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-foreground leading-relaxed">
                <p className="text-[11px] uppercase tracking-wider text-primary font-medium mb-1">AI Suggestion</p>
                {aiTip}
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
