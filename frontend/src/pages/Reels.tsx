import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  MoreVertical, 
  Music2, 
  Zap, 
  Bookmark
} from 'lucide-react';

const Reels = () => {
  const [reels] = useState([
    {
      id: 1,
      user: 'adventure_seeker',
      avatar: 'https://i.pravatar.cc/150?u=adventure',
      video_placeholder: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&q=80',
      caption: 'The power of nature is unmatched. #waterfall #nature #adventure',
      music: 'Original Audio - Nature Sounds',
      likes: '45.2K',
      comments: '892',
      score: 98
    },
    {
      id: 2,
      user: 'chef_master',
      avatar: 'https://i.pravatar.cc/150?u=chef',
      video_placeholder: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&q=80',
      caption: 'Secret pasta recipe revealed! 🍝 #cooking #recipe #foodie',
      music: 'Italian Classics - Instrumental',
      likes: '128K',
      comments: '3.4K',
      score: 95
    },
    {
      id: 3,
      user: 'tech_insider',
      avatar: 'https://i.pravatar.cc/150?u=tech',
      video_placeholder: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
      caption: 'Top 5 productivity hacks for developers. #tech #tips #coding',
      music: 'Lo-fi Beats - Focus',
      likes: '89K',
      comments: '1.1K',
      score: 91
    }
  ]);

  return (
    <div className="h-[calc(100vh-120px)] w-full flex items-center justify-center animate-in fade-in duration-700">
      
      {/* Reels Container with Snap Scrolling */}
      <div className="h-full aspect-[9/16] bg-slate-900 rounded-[40px] shadow-2xl overflow-y-scroll snap-y snap-mandatory no-scrollbar relative border-[8px] border-slate-900">
        
        {reels.map((reel) => (
          <div key={reel.id} className="h-full w-full snap-start relative group flex flex-col justify-end bg-gradient-to-br from-slate-800 to-slate-900">
            
            {/* Background Image (Mocking Video) */}
            <img 
              src={reel.video_placeholder} 
              alt="Reel content" 
              className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-700" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />

            {/* AI Score Badge */}
            <div className="absolute top-8 left-8 bg-purple-600/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center space-x-2 border border-purple-400/30 animate-pulse">
              <Zap size={14} fill="white" />
              <span className="text-xs font-black tracking-widest">{reel.score}% Pulse</span>
            </div>

            {/* Bottom Info Section */}
            <div className="relative z-10 p-8 text-white bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src={reel.avatar} alt={reel.user} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm">{reel.user}</h4>
                <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                  Follow
                </button>
              </div>
              
              <p className="text-sm mb-4 line-clamp-2 leading-relaxed font-medium">
                {reel.caption}
              </p>

              <div className="flex items-center space-x-2 text-xs font-bold text-white/80">
                <Music2 size={14} />
                <span className="truncate max-w-[200px]">{reel.music}</span>
              </div>
            </div>

            {/* Right Side Actions Bar */}
            <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center space-y-6">
              <ReelAction icon={Heart} label={reel.likes} color="hover:text-red-500" />
              <ReelAction icon={MessageCircle} label={reel.comments} color="hover:text-blue-400" />
              <ReelAction icon={Send} label="" color="hover:text-green-400" />
              <ReelAction icon={Bookmark} label="" color="hover:text-yellow-400" />
              <ReelAction icon={MoreVertical} label="" color="hover:text-white" />
              
              <div className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden animate-spin-slow mt-4">
                <img src={reel.avatar} className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        ))}

        {/* Floating Scroll Indicator */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col space-y-2">
          {reels.map((_, i) => (
            <div key={i} className={`w-1 h-8 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/20'}`}></div>
          ))}
        </div>

      </div>
    </div>
  );
};

interface ReelActionProps {
  icon: any;
  label: string;
  color: string;
}

const ReelAction = ({ icon: Icon, label, color }: ReelActionProps) => (
  <button className="flex flex-col items-center group">
    <div className={`p-2 text-white transition-all transform group-active:scale-125 ${color}`}>
      <Icon size={32} strokeWidth={1.5} />
    </div>
    {label && <span className="text-[10px] font-bold text-white mt-1">{label}</span>}
  </button>
);

export default Reels;
