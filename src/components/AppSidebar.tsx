import { LayoutDashboard, Calendar, CheckCircle2, Settings, User } from 'lucide-react';
import { useTaskStats } from '@/store/taskStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Calendar, label: 'Calendar' },
  { icon: CheckCircle2, label: 'Completed' },
  { icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const stats = useTaskStats();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-12 flex items-center px-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">T</span>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">TaskFlow</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
              item.active
                ? 'bg-sidebar-accent text-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
            {item.label === 'Completed' && (
              <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                {stats.completed}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Stats */}
      <div className="px-4 py-3 border-t border-sidebar-border space-y-3">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span className="font-mono tabular-nums">{stats.percentage}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-sidebar-accent rounded-md px-2.5 py-2">
            <span className="text-muted-foreground">Pending</span>
            <p className="text-foreground font-semibold font-mono tabular-nums">{stats.pending}</p>
          </div>
          <div className="bg-sidebar-accent rounded-md px-2.5 py-2">
            <span className="text-muted-foreground">High</span>
            <p className="text-high font-semibold font-mono tabular-nums">{stats.high}</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-sidebar-border flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="text-xs">
          <p className="text-foreground font-medium">User</p>
          <p className="text-muted-foreground">user@taskflow.dev</p>
        </div>
      </div>
    </aside>
  );
}
