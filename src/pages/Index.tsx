import { useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Topbar } from '@/components/Topbar';
import { TaskList } from '@/components/TaskList';
import { TaskInspector } from '@/components/TaskInspector';
import { useTaskStore } from '@/store/taskStore';

const Index = () => {
  const fetchTasks = useTaskStore((s) => s.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <TaskList />
      </div>
      <TaskInspector />
    </div>
  );
};

export default Index;
