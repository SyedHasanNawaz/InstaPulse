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
    <aside className="w-64 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 dark:bg-zinc-900 dark:bg-none border-r border-transparent dark:border-zinc-800 hidden md:flex flex-col shrink-0 h-screen transition-colors duration-300 relative overflow-hidden">
      <div className="p-6 flex items-center space-x-2 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm border border-white/30">
          <Zap className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-white">InstaPulse</h1>
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
                  ? 'bg-white/20 backdrop-blur-md text-white shadow-lg' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              } ${isActive ? 'dark:bg-purple-900/20 dark:text-purple-400' : 'dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'} dark:${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'}`} />
              <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 text-center relative z-10">
        <p className="text-[10px] font-black text-white/40 dark:text-zinc-700 uppercase tracking-widest">Version 2.0.4</p>
      </div>
    </aside>
  );
};

export default Sidebar;
