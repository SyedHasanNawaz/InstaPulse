import { useEffect, useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Trash2, 
  ChevronRight,
  Globe,
  Mail,
  Smartphone,
  Key,
  ShieldCheck,
  Eye,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getMe();
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Could not load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = () => {
    toast.success('Settings saved successfully! ✨');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-bold">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-5xl mx-auto transition-colors duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">Manage your account preferences and security settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Settings Navigation */}
        <aside className="w-full lg:w-72 space-y-2 shrink-0 lg:sticky lg:top-8">
          <SettingsNavLink 
            active={activeSection === 'account'} 
            onClick={() => setActiveSection('account')} 
            icon={User} 
            label="Account" 
          />
          <SettingsNavLink 
            active={activeSection === 'privacy'} 
            onClick={() => setActiveSection('privacy')} 
            icon={Shield} 
            label="Privacy & Safety" 
          />
          <SettingsNavLink 
            active={activeSection === 'security'} 
            onClick={() => setActiveSection('security')} 
            icon={Lock} 
            label="Password & Security" 
          />
          <SettingsNavLink 
            active={activeSection === 'notifications'} 
            onClick={() => setActiveSection('notifications')} 
            icon={Bell} 
            label="Notifications" 
          />
          
          <div className="pt-8 px-4">
            <p className="text-[10px] font-black text-slate-300 dark:text-zinc-700 uppercase tracking-widest">Support</p>
          </div>
          <SettingsNavLink 
            active={activeSection === 'help'} 
            onClick={() => setActiveSection('help')} 
            icon={AlertCircle} 
            label="Help Center" 
          />
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1 w-full min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'account' && <AccountSettings user={userData} onSave={handleSave} />}
              {activeSection === 'privacy' && <PrivacySettings onSave={handleSave} />}
              {activeSection === 'security' && <SecuritySettings onSave={handleSave} />}
              {activeSection === 'notifications' && <NotificationSettings onSave={handleSave} />}
              {activeSection === 'help' && (
                <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-12 border border-slate-100 dark:border-zinc-800 text-center">
                  <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Globe size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Help Center</h3>
                  <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-sm mx-auto mb-8">Need assistance? Our support team is available 24/7 to help you grow your brand.</p>
                  <button className="bg-slate-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-xl font-bold text-sm">Visit Documentation</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

/* --- SECTION COMPONENTS --- */

/* --- SECTION COMPONENTS --- */

const AccountSettings = ({ user, onSave }: any) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    website: 'https://instapulse.ai'
  });
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const needsLogout = formData.email !== user.email;
      await apiService.updateMe({
        username: formData.username,
        email: formData.email,
        bio: formData.bio
      });
      
      onSave(); // Show success toast
      
      if (needsLogout) {
        toast.success('Email changed! Please login with your new email.', { duration: 5000 });
        setTimeout(() => {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 border-b border-slate-50 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Public Profile</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">This information will be displayed publicly on your profile.</p>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-slate-200 dark:border-zinc-700 shrink-0 overflow-hidden">
              {user?.profile_image ? (
                <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <img src={`https://i.pravatar.cc/150?u=${user?.id || 'default'}`} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Photo</h4>
              <div className="flex space-x-3">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                  Upload New
                </button>
                <button className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-95">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsInput 
              label="Username" 
              placeholder="your_account" 
              icon={User} 
              defaultValue={formData.username}
              onChange={(e: any) => setFormData({ ...formData, username: e.target.value })}
            />
            <SettingsInput 
              label="Email Address" 
              placeholder="hello@instapulse.ai" 
              icon={Mail} 
              defaultValue={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="md:col-span-2">
              <SettingsInput label="Website" placeholder="https://instapulse.ai" icon={Globe} />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Bio</label>
              <textarea 
                placeholder="Tell us about yourself..." 
                className="w-full h-32 bg-slate-50 dark:bg-zinc-800/50 border-transparent focus:bg-white dark:focus:bg-zinc-800 rounded-2xl p-4 text-sm outline-none transition-all resize-none dark:text-zinc-100"
                value={formData.bio}
                onChange={(e: any) => setFormData({ ...formData, bio: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-red-50/50 dark:bg-red-950/10 rounded-[32px] p-8 border border-red-100 dark:border-red-900/30 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 text-red-600 flex items-center justify-center shadow-sm border border-red-50 dark:border-red-900/20">
            <Trash2 size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-900 dark:text-red-400">Delete Account</h3>
            <p className="text-[11px] text-red-600/70 dark:text-red-400/50">Permanently remove all your data.</p>
          </div>
        </div>
        <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95">
          Delete forever
        </button>
      </section>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleUpdate} 
          disabled={updating}
          className="bg-slate-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-zinc-100 hover:-translate-y-1 transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center space-x-2"
        >
          {updating && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{updating ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
};

const PrivacySettings = ({ onSave }: any) => (
  <div className="space-y-8">
    <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Privacy & Visibility</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Control how others interact with your content.</p>
      </div>
      <div className="p-8 divide-y divide-slate-50 dark:divide-zinc-800">
        <ToggleRow title="Private Account" description="Only people you approve can see your photos and videos." enabled={false} icon={Eye} />
        <ToggleRow title="Activity Status" description="Allow accounts you follow to see when you were last active." enabled={true} icon={Smartphone} />
        <ToggleRow title="Allow Tagging" description="Allow other users to tag you in their posts." enabled={true} icon={User} />
        <ToggleRow title="Data Sharing" description="Help us improve by sharing anonymized usage data." enabled={true} icon={Globe} />
      </div>
    </section>
    <div className="flex justify-end pt-4">
      <button onClick={onSave} className="bg-slate-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-zinc-100 hover:-translate-y-1 transition-all active:scale-95 shadow-xl">
        Update Privacy
      </button>
    </div>
  </div>
);

const SecuritySettings = ({ onSave }: any) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [updating, setUpdating] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwords.new || passwords.new.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setUpdating(true);
    try {
      await apiService.updateMe({
        password: passwords.new
      });
      
      toast.success('Password changed! Redirecting to login...', { duration: 5000 });
      
      setTimeout(() => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Strengthen your account security with a unique password.</p>
        </div>
        <div className="p-8 space-y-6">
          <SettingsInput 
            label="New Password" 
            placeholder="••••••••" 
            icon={Key} 
            type="password" 
            onChange={(e: any) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <SettingsInput 
            label="Confirm New Password" 
            placeholder="••••••••" 
            icon={ShieldCheck} 
            type="password" 
            onChange={(e: any) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
        </div>
      </section>
      <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Add an extra layer of security to your account login.</p>
        </div>
        <div className="p-8">
          <ToggleRow title="SMS Authentication" description="Receive a 6-digit code via SMS to verify login." enabled={false} icon={Smartphone} />
          <ToggleRow title="Authenticator App" description="Use an app like Google Authenticator for login codes." enabled={true} icon={ShieldCheck} />
        </div>
      </section>
      <div className="flex justify-end pt-4">
        <button 
          onClick={handlePasswordChange}
          disabled={updating}
          className="bg-slate-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-zinc-100 hover:-translate-y-1 transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center space-x-2"
        >
          {updating && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{updating ? 'Updating...' : 'Save Security Settings'}</span>
        </button>
      </div>
    </div>
  );
};

const NotificationSettings = ({ onSave }: any) => (
  <div className="space-y-8">
    <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Push Notifications</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Get real-time updates on your phone.</p>
      </div>
      <div className="p-8 space-y-2">
        <ToggleRow title="New Followers" description="When someone follows your account." enabled={true} icon={User} />
        <ToggleRow title="Post Likes" description="When someone likes one of your posts." enabled={true} icon={Heart} />
        <ToggleRow title="Comments" description="When someone comments on your posts." enabled={true} icon={MessageCircle} />
      </div>
    </section>
    <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Notifications</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Weekly reports and account security alerts.</p>
      </div>
      <div className="p-8 space-y-2">
        <ToggleRow title="Weekly Report" description="A summary of your growth and engagement stats." enabled={true} icon={Globe} />
        <ToggleRow title="Product Updates" description="New features and updates from InstaPulse." enabled={false} icon={Zap} />
      </div>
    </section>
    <div className="flex justify-end pt-4">
      <button onClick={onSave} className="bg-slate-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-zinc-100 hover:-translate-y-1 transition-all active:scale-95 shadow-xl">
        Save Notifications
      </button>
    </div>
  </div>
);

/* --- UI COMPONENTS --- */

const SettingsNavLink = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group ${
      active ? 'bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-500 hover:bg-white/50 dark:hover:bg-zinc-900/50'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={18} className={active ? 'text-purple-600 dark:text-purple-400' : 'group-hover:text-slate-700 dark:group-hover:text-zinc-300'} />
      <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
    <ChevronRight size={14} className={active ? 'text-purple-300 dark:text-purple-600' : 'text-slate-200 dark:text-zinc-800'} />
  </button>
);

const SettingsInput = ({ label, placeholder, icon: Icon, type = "text", defaultValue, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-zinc-600 group-focus-within:text-purple-500 transition-colors" size={18} />
      <input 
        type={type} 
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-transparent focus:border-purple-200 dark:focus:border-purple-900/30 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-900 dark:text-zinc-100 outline-none transition-all"
      />
    </div>
  </div>
);

const ToggleRow = ({ title, description, enabled, icon: Icon }: any) => {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="py-6 flex items-center justify-between">
      <div className="flex items-start space-x-4 max-w-md">
        <div className="mt-1 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500">
          <Icon size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-11 h-6 rounded-full relative transition-all shrink-0 ${isOn ? 'bg-purple-600' : 'bg-slate-200 dark:bg-zinc-700'}`}
      >
        <motion.div 
          animate={{ x: isOn ? 22 : 4 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
};

const Heart = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const MessageCircle = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>;
const Zap = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;

export default Settings;
