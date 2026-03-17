import { useMemo, useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/AppSidebar';
import { Topbar } from '@/components/Topbar';

export default function CalendarView() {
  const tasks = useTaskStore((s) => s.tasks);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });
    // Pad start to Monday
    const startDay = start.getDay();
    const padStart = startDay === 0 ? 6 : startDay - 1;
    const padDays: (Date | null)[] = Array(padStart).fill(null);
    return [...padDays, ...allDays];
  }, [currentMonth]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach((t) => {
      if (t.dueDate) {
        const key = format(new Date(t.dueDate), 'yyyy-MM-dd');
        if (!map[key]) map[key] = [];
        map[key].push(t);
      }
    });
    return map;
  }, [tasks]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <div className="flex-1 p-5 overflow-auto">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Today
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px mb-px">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium text-center py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {days.map((day, i) => {
              if (!day) {
                return <div key={`pad-${i}`} className="bg-background min-h-[100px]" />;
              }
              const key = format(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate[key] || [];
              const today = isToday(day);

              return (
                <div
                  key={key}
                  className={`bg-background min-h-[100px] p-1.5 ${
                    !isSameMonth(day, currentMonth) ? 'opacity-30' : ''
                  }`}
                >
                  <div className={`text-xs font-mono tabular-nums mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                    today ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${
                          task.priority === 'high' ? 'bg-high/10 text-high' :
                          task.priority === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        } ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-[10px] text-muted-foreground px-1">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
