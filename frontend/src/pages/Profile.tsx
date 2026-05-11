import { 
  Settings, 
  Grid, 
  Bookmark, 
  Tag, 
  MapPin, 
  Link as LinkIcon,
  Calendar,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getMe();
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch profile user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const posts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80' },
    { id: 2, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80' },
    { id: 3, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
    { id: 4, image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80' },
    { id: 5, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80' },
    { id: 6, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80' },
  ];

  return (
    <div className="pb-20 transition-colors duration-300">
      {/* Header / Profile Info */}
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-12 mb-10 border border-slate-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1 shrink-0">
            <div className="w-full h-full rounded-full border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-900 overflow-hidden">
              <img src={userData?.profile_image || `https://i.pravatar.cc/150?u=${userData?.id || 'default'}`} alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{userData?.username || 'user_profile'}</h3>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <button 
                  onClick={() => navigate('/settings')}
                  className="px-6 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:hover:bg-zinc-700 transition-all"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-8 mb-6">
              <Stat value="142" label="Posts" />
              <Stat value="8.5k" label="Followers" />
              <Stat value="423" label="Following" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-900 dark:text-zinc-200">{userData?.username}</p>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-lg whitespace-pre-line">
                {userData?.bio || "🚀 Creator & Social Media Strategist\n📈 Helping brands optimize their Pulse scores.\n📍 Digital Nomad based in London."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
              <IconDetail icon={MapPin} text="London, UK" />
              <IconDetail icon={LinkIcon} text="instapulse.ai" color="text-blue-500" />
              <IconDetail icon={Calendar} text="Joined Oct 2023" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex items-center justify-center space-x-12 border-b border-slate-100 dark:border-zinc-800 mb-8">
        <Tab icon={Grid} label="POSTS" active />
        <Tab icon={ImageIcon} label="REELS" />
        <Tab icon={Bookmark} label="SAVED" />
        <Tab icon={Tag} label="TAGGED" />
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="aspect-square rounded-lg md:rounded-2xl overflow-hidden group relative cursor-pointer"
          >
            <img src={post.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white">
              <div className="flex items-center space-x-1">
                <Users size={20} fill="white" />
                <span className="font-bold">12</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Stat = ({ value, label }: { value: string, label: string }) => (
  <div className="text-center md:text-left">
    <span className="block text-lg font-black text-slate-900 dark:text-white">{value}</span>
    <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{label}</span>
  </div>
);

const IconDetail = ({ icon: Icon, text, color = "text-slate-400 dark:text-zinc-500" }: any) => (
  <div className="flex items-center space-x-1.5">
    <Icon size={14} className={color} />
    <span className={`text-xs font-medium ${color === "text-blue-500" ? color : 'text-slate-500 dark:text-zinc-400'}`}>{text}</span>
  </div>
);

const Tab = ({ icon: Icon, label, active = false }: any) => (
  <button className={`flex items-center space-x-2 py-4 border-t-2 transition-all ${active ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-zinc-500'}`}>
    <Icon size={14} />
    <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
  </button>
);

export default Profile;
