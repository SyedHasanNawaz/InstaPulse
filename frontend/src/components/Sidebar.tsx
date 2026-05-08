import { 
  LayoutDashboard, 
  PlusSquare, 
  Lightbulb, 
  History, 
  MonitorPlay, 
  Compass, 
  Video, 
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Create Post', icon: PlusSquare, path: '/create-post' },
    { name: 'Optimization Advisor', icon: Lightbulb, path: '/optimization-advisor' },
    { name: 'History & Reports', icon: History, path: '/history' },
    { name: 'Feed Simulation', icon: MonitorPlay, path: '/feed' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Reels', icon: Video, path: '/reels' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 hidden md:flex flex-col shrink-0 h-screen transition-colors duration-300">
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-sm">
          <Zap className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight dark:text-white">InstaPulse</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'group-hover:text-purple-600 dark:group-hover:text-purple-400'}`} />
              <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 text-center">
        <p className="text-[10px] font-black text-slate-300 dark:text-zinc-700 uppercase tracking-widest">Version 2.0.4</p>
      </div>
    </aside>
  );
};

export default Sidebar;
