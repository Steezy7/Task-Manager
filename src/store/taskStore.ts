import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  labels: string[];
  createdAt: string;
  sortOrder: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  searchQuery: string;
  filterPriority: Priority | 'all';
  filterStatus: TaskStatus | 'all';
  selectedTaskId: string | null;
  inspectorOpen: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'sortOrder'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setFilterPriority: (p: Priority | 'all') => void;
  setFilterStatus: (s: TaskStatus | 'all') => void;
  selectTask: (id: string | null) => void;
  setInspectorOpen: (open: boolean) => void;
}

function mapRow(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    dueDate: row.due_date || new Date().toISOString(),
    priority: row.priority as Priority,
    status: row.status as TaskStatus,
    labels: row.labels || [],
    createdAt: row.created_at,
    sortOrder: row.sort_order || 0,
  };
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  loading: true,
  searchQuery: '',
  filterPriority: 'all',
  filterStatus: 'all',
  selectedTaskId: null,
  inspectorOpen: false,

  fetchTasks: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      set({ tasks: data.map(mapRow), loading: false });
    } else {
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: task.title,
      description: task.description,
      due_date: task.dueDate,
      priority: task.priority,
      status: task.status,
      labels: task.labels,
    }).select().single();
    if (!error && data) {
      set((s) => ({ tasks: [mapRow(data), ...s.tasks] }));
    }
  },

  updateTask: async (id, updates) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.labels !== undefined) dbUpdates.labels = updates.labels;

    const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id);
    if (!error) {
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    }
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      set((s) => ({
        tasks: s.tasks.filter((t) => t.id !== id),
        selectedTaskId: s.selectedTaskId === id ? null : s.selectedTaskId,
      }));
    }
  },

  toggleComplete: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    if (!error) {
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: newStatus as TaskStatus } : t)),
      }));
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterPriority: (filterPriority) => set({ filterPriority }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  selectTask: (selectedTaskId) => set({ selectedTaskId, inspectorOpen: selectedTaskId !== null }),
  setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),
}));

// Selectors
export const useFilteredTasks = () => {
  const { tasks, searchQuery, filterPriority, filterStatus } = useTaskStore();
  return tasks.filter((t) => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });
};

export const useTaskStats = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const high = tasks.filter((t) => t.priority === 'high' && t.status === 'pending').length;
  const overdue = tasks.filter((t) => t.status === 'pending' && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, high, overdue, percentage };
};
