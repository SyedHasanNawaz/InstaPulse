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
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI Analysis Updated', message: 'New optimization advice ready for your latest post.', time: '2m ago', type: 'ai' },
    { id: 2, title: 'Viral Potential High', message: 'Your "Summer Vibe" draft is predicted to reach 2x engagement.', time: '1h ago', type: 'prediction' },
    { id: 3, title: 'Sync Successful', message: 'Historical reports have been synchronized with the database.', time: '3h ago', type: 'system' }
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getMe();
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user in layout:', error);
      }
    };
    fetchUser();
  }, [location.pathname]); // Refresh on navigation to catch profile updates
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // Smart Dismiss: Dismiss all toasts when clicking anywhere on the page
  const handleGlobalClick = () => {
    if (toasts.length > 0) {
      toast.dismiss();
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const clearNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <div 
      onClick={handleGlobalClick}
      className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 relative"
    >
      {/* Animated Background Orbs */}
      <div className="fixed top-[-5%] left-[-5%] w-[35%] h-[35%] bg-purple-500/25 dark:bg-purple-600/30 rounded-full blur-[100px] animate-orb pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-orange-500/25 dark:bg-orange-600/30 rounded-full blur-[100px] animate-orb-delayed pointer-events-none z-0" />
      <div className="fixed top-[20%] right-[10%] w-[25%] h-[25%] bg-pink-500/20 dark:bg-pink-600/20 rounded-full blur-[100px] animate-orb-slow pointer-events-none z-0" />

      {/* Light Mode Accent Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 pointer-events-none dark:hidden" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Accent Glow Line */}
        <div className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 w-full shrink-0" />
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800 px-8 flex items-center justify-end shrink-0 z-10 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {/* Notification Bell */}
            <div className="relative" ref={bellRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
              >
                <Bell className="w-5 h-5 group-hover:animate-swing" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-50 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Notifications</h3>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearNotifications}
                          className="text-[10px] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 uppercase tracking-wider"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <p className="text-xs text-slate-400 font-medium">No new notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className="p-4 border-b border-slate-50 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{notif.title}</h4>
                              <span className="text-[10px] text-slate-400">{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-900 overflow-hidden">
                    <img 
                      src={userData?.profile_image || `https://i.pravatar.cc/150?u=${userData?.id || 'default'}`} 
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
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-zinc-800 mb-2 truncate">
                      <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{userData?.username || 'User'}</p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium truncate">{userData?.email || 'user@instapulse.ai'}</p>
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
