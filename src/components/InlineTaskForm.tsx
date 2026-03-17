import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore, type Priority } from '@/store/taskStore';

export function InlineTaskForm({ onClose }: { onClose: () => void }) {
  const addTask = useTaskStore((s) => s.addTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    await addTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      priority,
      status: 'pending',
      labels: [],
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-card border border-border rounded-lg shadow-lg p-4 animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">New Task</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <input
          autoFocus
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground mb-2 focus:outline-none focus:ring-1 focus:ring-ring"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground mb-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />

        <div className="flex items-center gap-3 mb-3">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex gap-1">
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  priority === p
                    ? p === 'high' ? 'bg-high/20 text-high' : p === 'medium' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting} className="text-xs">
            {submitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}
