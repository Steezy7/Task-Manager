import { Search, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore, useTaskStats } from '@/store/taskStore';
import { useState } from 'react';
import { InlineTaskForm } from './InlineTaskForm';

export function Topbar() {
  const { searchQuery, setSearchQuery } = useTaskStore();
  const stats = useTaskStats();
  const [showForm, setShowForm] = useState(false);

  return (
    <header className="h-12 border-b border-border bg-background flex items-center px-5 gap-4 shrink-0">
      {/* Title area */}
      <div className="flex items-center gap-3 mr-auto">
        <h1 className="text-sm font-semibold text-foreground tracking-tight">Dashboard</h1>
        {stats.high > 0 && (
          <span className="text-xs font-medium text-high bg-high/10 px-2 py-0.5 rounded-md">
            {stats.high} high priority
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-8 bg-secondary border border-border rounded-md pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Actions */}
      <Button variant="ai" size="sm" className="gap-1.5 text-xs">
        <Sparkles className="w-3.5 h-3.5" />
        AI Suggest
      </Button>
      <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowForm(!showForm)}>
        <Plus className="w-3.5 h-3.5" />
        Add Task
      </Button>

      {showForm && <InlineTaskForm onClose={() => setShowForm(false)} />}
    </header>
  );
}
