import { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  PlusCircle,
  Zap,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [brokenPosts, setBrokenPosts] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getFullUrl = (path: string) => {
    if (!path) return '';
    const baseUrl = path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
    // Add cache-buster to force browser to check server (crucial for detecting deleted files)
    return `${baseUrl}?t=${Date.now()}`;
  };

  const handleMediaError = (id: number) => {
    setBrokenPosts(prev => new Set(prev).add(id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-bold">Fetching your pulse...</p>
      </div>
    );
  }

  const filteredPosts = posts.filter(p => 
    p.media_url && 
    p.media_url !== 'null' && 
    p.media_url !== 'undefined' && 
    p.media_url.trim() !== '' &&
    !brokenPosts.has(p.id)
  );

  return (
    <div className="max-w-2xl mx-auto pb-20 transition-colors duration-300">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Feed Simulation</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">See how your content stands out in the crowd.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setLoading(true);
              setBrokenPosts(new Set()); // Reset broken posts on refresh
              const fetchPosts = async () => {
                try {
                  const data = await apiService.getPosts();
                  setPosts(data);
                } catch (error) {
                  console.error('Failed to fetch posts:', error);
                } finally {
                  setLoading(false);
                }
              };
              fetchPosts();
            }}
            className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-500 hover:text-purple-500 transition-all flex items-center justify-center shadow-lg hover:shadow-purple-500/20"
            title="Refresh Feed"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => navigate('/create-post')}
            className="w-12 h-12 rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            <PlusCircle size={24} />
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-zinc-900 rounded-[32px] border border-dashed border-slate-200 dark:border-zinc-800">
            <p className="text-slate-400 font-bold">No posts yet. Create your first masterpiece!</p>
          </div>
        ) : filteredPosts.map((post, idx) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden glass-card-hover"
          >
            {/* Post Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-900 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${post.user_id}`} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">user_{post.user_id}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">InstaPulse AI Analyzed</p>
                </div>
              </div>
              <button className="text-slate-400 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-200">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Media */}
            <div className="aspect-square bg-slate-100 dark:bg-zinc-800 relative overflow-hidden">
              {post.media_type === 'VIDEO' ? (
                <video 
                  src={getFullUrl(post.media_url)} 
                  className="w-full h-full object-cover" 
                  controls 
                  onError={() => handleMediaError(post.id)}
                />
              ) : (
                <img 
                  src={getFullUrl(post.media_url)} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  onError={() => handleMediaError(post.id)}
                />
              )}
              
              {/* AI Badge Overlay */}
              <div className="absolute top-6 right-6">
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center space-x-2 border border-white/20 dark:border-zinc-800/50">
                  <Zap className="text-purple-500" size={14} fill="currentColor" />
                  <span className="text-[11px] font-black text-slate-900 dark:text-white">Pulse Score</span>
                </div>
              </div>
            </div>

            {/* Post Footer */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <Heart size={24} className="text-slate-900 dark:text-zinc-200 hover:text-red-500 transition-colors cursor-pointer" />
                  <MessageCircle size={24} className="text-slate-900 dark:text-zinc-200 hover:text-purple-500 transition-colors cursor-pointer" />
                  <Share2 size={24} className="text-slate-900 dark:text-zinc-200 hover:text-blue-500 transition-colors cursor-pointer" />
                </div>
                <Bookmark size={24} className="text-slate-900 dark:text-zinc-200 hover:text-orange-500 transition-colors cursor-pointer" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-black text-slate-900 dark:text-zinc-100">AI Engagement High</p>
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <span className="font-bold mr-2 text-slate-900 dark:text-zinc-100">user_{post.user_id}</span>
                  {post.caption}
                </p>
                {post.hashtags && (
                  <p className="text-xs text-purple-500 font-bold">{post.hashtags}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Feed;

