import { AppSidebar } from '@/components/AppSidebar';
import { Topbar } from '@/components/Topbar';
import { TaskList } from '@/components/TaskList';
import { TaskInspector } from '@/components/TaskInspector';

const Index = () => {
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
