import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  aiModified?: boolean;
}

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  filterPriority: Priority | 'all';
  filterStatus: TaskStatus | 'all';
  selectedTaskId: string | null;
  inspectorOpen: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setFilterPriority: (p: Priority | 'all') => void;
  setFilterStatus: (s: TaskStatus | 'all') => void;
  selectTask: (id: string | null) => void;
  setInspectorOpen: (open: boolean) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const sampleTasks: Task[] = [
  {
    id: generateId(), title: 'Refactor authentication module',
    description: 'Migrate from session-based auth to JWT tokens. Update middleware and test coverage.',
    dueDate: new Date(Date.now() + 86400000).toISOString(), priority: 'high', status: 'pending',
    labels: ['backend', 'security'], createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), title: 'Design system color audit',
    description: 'Verify all components use semantic tokens. Fix any hardcoded color values.',
    dueDate: new Date(Date.now() + 172800000).toISOString(), priority: 'medium', status: 'pending',
    labels: ['design', 'frontend'], createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), title: 'Write API documentation',
    description: 'Document all REST endpoints with request/response examples using OpenAPI spec.',
    dueDate: new Date(Date.now() + 259200000).toISOString(), priority: 'low', status: 'pending',
    labels: ['docs'], createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), title: 'Fix responsive layout on mobile',
    description: 'The sidebar overlaps content on screens < 768px. Add proper breakpoints.',
    dueDate: new Date(Date.now() + 43200000).toISOString(), priority: 'high', status: 'pending',
    labels: ['frontend', 'bug'], createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment to staging.',
    dueDate: new Date(Date.now() + 432000000).toISOString(), priority: 'medium', status: 'completed',
    labels: ['devops'], createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: sampleTasks,
      searchQuery: '',
      filterPriority: 'all',
      filterStatus: 'all',
      selectedTaskId: null,
      inspectorOpen: false,

      addTask: (task) =>
        set((state) => ({
          tasks: [{ ...task, id: generateId(), createdAt: new Date().toISOString() }, ...state.tasks],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        })),

      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
          ),
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilterPriority: (filterPriority) => set({ filterPriority }),
      setFilterStatus: (filterStatus) => set({ filterStatus }),
      selectTask: (selectedTaskId) => set({ selectedTaskId, inspectorOpen: selectedTaskId !== null }),
      setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),

      reorderTasks: (fromIndex, toIndex) =>
        set((state) => {
          const tasks = [...state.tasks];
          const [moved] = tasks.splice(fromIndex, 1);
          tasks.splice(toIndex, 0, moved);
          return { tasks };
        }),
    }),
    { name: 'task-store' }
  )
);

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
  const overdue = tasks.filter((t) => t.status === 'pending' && new Date(t.dueDate) < new Date()).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, high, overdue, percentage };
};
