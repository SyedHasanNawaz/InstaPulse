import { useState, useRef, useMemo } from 'react';
import { 
  Image as ImageIcon, 
  Smile, 
  MapPin, 
  Users, 
  Hash, 
  Send, 
  Eye, 
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  Sparkles,
  Check,
  Zap,
  Loader2,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Pulse Score Engine
  const pulseScore = useMemo(() => {
    let score = 0;
    
    // 1. Image Presence (30 pts)
    if (selectedImage) score += 30;

    // 2. Caption Length (Max 30 pts)
    const len = caption.length;
    if (len > 0) {
      if (len >= 100 && len <= 250) score += 30;
      else if (len < 100) score += (len / 100) * 20;
      else score += Math.max(0, 30 - ((len - 250) / 20));
    }

    // 3. Hashtags (Max 20 pts)
    const hashtags = (caption.match(/#/g) || []).length;
    if (hashtags >= 5 && hashtags <= 15) score += 20;
    else if (hashtags > 0) score += Math.min(20, hashtags * 2);

    // 4. Emojis & Engagement triggers (Max 20 pts)
    const hasEmoji = /\p{Emoji}/u.test(caption);
    if (hasEmoji) score += 10;
    if (caption.includes('?') || caption.toLowerCase().includes('comment')) score += 10;

    return Math.min(100, Math.round(score));
  }, [caption, selectedImage]);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateCaptions = () => {
    setIsGenerating(true);
    setShowVariations(false);
    
    setTimeout(() => {
      setIsGenerating(false);
      setShowVariations(true);
      toast.success('AI magic complete! ✨');
    }, 1500);
  };

  const applyCaption = (text: string) => {
    setCaption(text);
    setShowVariations(false);
    toast.success('Caption updated! ✍️');
  };

  const variations = [
    { type: 'The Hook', text: "Stop scrolling! 🛑 This is the secret to 10x your growth this week. You won't believe how simple it is. Read on to find out! 👇 #growthmindset #creator" },
    { type: 'The Story', text: "They told me I'd never make it. 🥺 But after 3 years of grinding and staying consistent, we're finally here. Never let anyone dim your spark. ✨ #motivation #journey" },
    { type: 'The Pro', text: "Productivity isn't about doing more, it's about doing what matters. 🧠 Here are 3 tips to streamline your workflow and save 5 hours a week. Check the link in bio! 🔗" },
  ];

  return (
    <div className="pb-20 transition-colors duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Create Post</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">Design and optimize your next hit content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Editor Side */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          {/* Upload Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-96 rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center group cursor-pointer overflow-hidden ${
              dragActive 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' 
                : 'border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200 dark:hover:border-purple-900/40'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={onFileSelect}
            />

            <AnimatePresence mode="wait">
              {selectedImage ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="bg-white/90 dark:bg-zinc-900/90 p-3 rounded-full text-red-500 shadow-xl hover:scale-110 transition-transform"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-500">
                    <Camera size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drop your masterpiece here</h4>
                  <p className="text-sm text-slate-400 dark:text-zinc-500 max-w-xs">Drag and drop images, or click to browse from your device.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Caption Area */}
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Caption</span>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={generateCaptions}
                  disabled={isGenerating}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all border border-purple-100 dark:border-purple-800 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>{isGenerating ? 'Waving Wand...' : 'AI Magic Wand'}</span>
                </motion.button>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">{caption.length}/2200</span>
              </div>
            </div>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something engaging..."
              className="w-full h-40 bg-slate-50 dark:bg-zinc-800/50 border-transparent focus:bg-white dark:focus:bg-zinc-800 rounded-2xl p-4 text-sm outline-none transition-all dark:text-zinc-200"
            />
            
            {/* AI Variations Overlay */}
            <AnimatePresence>
              {showVariations && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-6 flex flex-col z-20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                      <Zap size={14} className="mr-2 text-orange-500" /> AI Suggestions
                    </h4>
                    <button onClick={() => setShowVariations(false)} className="text-slate-400 dark:text-zinc-500 hover:text-red-500 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    {variations.map((v, i) => (
                      <motion.div
                        key={v.type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => applyCaption(v.text)}
                        className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-500/50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">{v.type}</span>
                          <Check size={12} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                          {v.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <IconButton icon={Smile} />
                <IconButton icon={MapPin} />
                <IconButton icon={Users} />
                <IconButton icon={Hash} />
              </div>
              <div className="flex items-center space-x-4">
                {/* MOVED PULSE METER HERE */}
                <div className="flex items-center space-x-2">
                  <PulseMeter score={pulseScore} size={40} stroke={4} />
                  <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Pulse Score</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2"
                >
                  <span>Full Audit</span>
                  <Eye size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="sticky top-8 w-full max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Instagram Preview</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-500">AI Analysis Active</span>
              </div>
            </div>

            {/* Mock Phone / Post */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border-[8px] border-slate-900 dark:border-zinc-800 shadow-2xl overflow-hidden aspect-[9/16] max-h-[700px] flex flex-col relative">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-900 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-tight">your_brand</span>
                </div>
                <button className="text-slate-400 dark:text-zinc-500">
                  <Activity size={16} />
                </button>
              </div>

              {/* Post Image Placeholder / Real Preview */}
              <div className="flex-1 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedImage ? (
                    <motion.img 
                      key="post-img"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={selectedImage} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <motion.div 
                      key="post-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center text-slate-300 dark:text-zinc-700"
                    >
                      <ImageIcon size={48} />
                      <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Image Selected</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Post Actions */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Heart size={22} className="text-slate-900 dark:text-zinc-200" />
                    <MessageCircle size={22} className="text-slate-900 dark:text-zinc-200" />
                    <Share2 size={22} className="text-slate-900 dark:text-zinc-200" />
                  </div>
                  <Bookmark size={22} className="text-slate-900 dark:text-zinc-200" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-zinc-200">0 likes</p>
                  <p className="text-xs text-slate-800 dark:text-zinc-300">
                    <span className="font-bold mr-2 text-slate-900 dark:text-zinc-100">your_brand</span>
                    {caption || 'Your engaging caption will appear here...'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase mt-2">Just now</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (!selectedImage) {
                  toast.error('Please upload an image first! 📸');
                } else {
                  toast.success(`Analysis complete! Pulse Score: ${pulseScore}/100 📈`);
                }
              }}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center space-x-2"
            >
              <Send size={18} />
              <span>Final Pulse Check</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PulseMeter = ({ score, size = 80, stroke = 8 }: { score: number, size?: number, stroke?: number }) => {
  const radius = (size / 2) - (stroke / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = useMemo(() => {
    if (score < 40) return '#ef4444'; // Red
    if (score < 70) return '#f59e0b'; // Orange/Yellow
    if (score < 90) return '#a855f7'; // Purple
    return '#10b981'; // Green
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-slate-100 dark:text-zinc-800"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span 
          key={score}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${size < 50 ? 'text-[10px]' : 'text-lg'} font-black dark:text-white`}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
};

const IconButton = ({ icon: Icon }: { icon: any }) => (
  <button className="p-2 text-slate-400 dark:text-zinc-500 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all">
    <Icon size={18} />
  </button>
);

export default CreatePost;
