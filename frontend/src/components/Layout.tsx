import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Moon, Sun, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import toast, { useToasterStore } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toasts } = useToasterStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Smart Dismiss: Dismiss all toasts when clicking anywhere on the page
  const handleGlobalClick = () => {
    if (toasts.length > 0) {
      toast.dismiss();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div 
      onClick={handleGlobalClick}
      className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-300"
    >
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-8 flex items-center justify-between shrink-0 z-10 transition-colors duration-300">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search.." 
              className="w-full bg-gray-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-purple-300 rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all dark:text-zinc-200"
            />
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                toast('No new notifications', { icon: '🔔', duration: 5000 });
              }}
              className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
            >
              <Bell className="w-5 h-5 group-hover:animate-swing" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>

            {/* User Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-900 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden z-50 p-2"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-zinc-800 mb-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">Syed Hasan</p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">syed@instapulse.ai</p>
                    </div>
                    
                    <MenuLink icon={User} label="My Profile" onClick={() => navigate('/profile')} />
                    <MenuLink icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
                    
                    <div className="h-px bg-slate-50 dark:bg-zinc-800 my-2" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Animated Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-6xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const MenuLink = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
  >
    <Icon className="w-4 h-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
    <span>{label}</span>
  </button>
);

export default Layout;
