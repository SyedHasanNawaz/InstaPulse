import { useState, useRef, useMemo, useEffect } from 'react';
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
import { apiService } from '../services/api';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);
  const [isAIPrediction, setIsAIPrediction] = useState(false);
  const [dynamicScore, setDynamicScore] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pulse Score Logic
  const displayScore = useMemo(() => {
    if (isAIPrediction) {
      // Return accurate score after AI Magic Wand
      let score = 0;
      if (previewUrl) score += 30;
      const len = caption.length;
      if (len >= 50 && len <= 300) score += 30;
      const hashtags = (caption.match(/#/g) || []).length;
      if (hashtags >= 5 && hashtags <= 15) score += 20;
      if (caption.includes('?') || caption.toLowerCase().includes('comment')) score += 20;
      return Math.min(100, Math.round(score));
    }
    // Return the "thinking" dynamic score while typing
    return dynamicScore;
  }, [caption, previewUrl, isAIPrediction, dynamicScore]);

  // Update dynamic score randomly as user types
  useEffect(() => {
    if (!isAIPrediction && caption.length > 0) {
      // Simulate "thinking" by picking a random number centered around 
      // some basic heuristics but with high variance
      const randomBase = Math.floor(Math.random() * 40) + 20; // Random 20-60
      setDynamicScore(randomBase);
    } else if (caption.length === 0) {
      setDynamicScore(0);
    }
  }, [caption]);

  const handleFile = (file: File) => {
    if (file) {
      setSelectedFile(file);
      // Clean up old object URL if exists
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!selectedFile) {
      toast.error('Please select an image or video first! 📸');
      return;
    }

    setIsPublishing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('caption', caption);
    formData.append('media_type', selectedFile.type.startsWith('video/') ? 'VIDEO' : 'IMAGE');
    
    // Extract hashtags from caption if any
    const hashtags = (caption.match(/#[a-z0-9_]+/gi) || []).join(', ');
    if (hashtags) formData.append('hashtags', hashtags);

    try {
      await apiService.createPost(formData);
      toast.success('Successfully published! 🚀');
      setCaption('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish post');
    } finally {
      setIsPublishing(false);
    }
  };

  const generateCaptions = async () => {
    if (!caption && !previewUrl) {
        toast.error("Type something first!");
        return;
    }
    setIsGenerating(true);
    setShowVariations(false);
    
    try {
      const data = await apiService.refineCaption(caption || "A new post about life and tech");
      const formattedVariations = [
        { type: 'The Hook', text: data.Hook },
        { type: 'The Story', text: data.Story },
        { type: 'The Pro', text: data.Pro },
      ];
      setVariations(formattedVariations);
      setShowVariations(true);
      setIsAIPrediction(true); // LOCK to accurate score now
      toast.success('AI magic complete! ✨');
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("AI is busy right now. Try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCaption = (text: string) => {
    setCaption(text);
    setShowVariations(false);
    setIsAIPrediction(true); // Ensure it stays accurate
    toast.success('Caption updated! ✍️');
  };

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
            className={`relative h-96 rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center group cursor-pointer overflow-hidden border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200 dark:hover:border-purple-900/40`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
            />
            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 w-full h-full">
                  {selectedFile?.type.startsWith('video/') ? (
                    <video src={previewUrl} className="w-full h-full object-cover" autoPlay muted loop />
                  ) : (
                    <img src={previewUrl} alt="Selected" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => { 
                      e.stopPropagation(); 
                      setSelectedFile(null); 
                      setPreviewUrl(null); 
                    }} className="bg-white/90 dark:bg-zinc-900/90 p-3 rounded-full text-red-500"><X size={24} /></button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:text-purple-500">
                    <Camera size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drop your masterpiece here</h4>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Caption Area */}
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Caption</span>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={generateCaptions}
                  disabled={isGenerating}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-purple-100 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>{isGenerating ? 'Waving Wand...' : 'AI Magic Wand'}</span>
                </motion.button>
              </div>
            </div>
            <textarea 
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                setIsAIPrediction(false); // Reset to "thinking" mode when user types
              }}
              placeholder="Write something engaging..."
              className="w-full h-40 bg-slate-50 dark:bg-zinc-800/50 border-transparent focus:bg-white rounded-2xl p-4 text-sm outline-none transition-all dark:text-zinc-200"
            />
            
            <AnimatePresence>
              {showVariations && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-6 flex flex-col z-20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center"><Zap size={14} className="mr-2 text-orange-500" /> AI Suggestions</h4>
                    <button onClick={() => setShowVariations(false)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {variations.map((v, i) => (
                      <div key={i} onClick={() => applyCaption(v.text)} className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-purple-300 cursor-pointer transition-all">
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block mb-1">{v.type}</span>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">{v.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Smile size={18} className="text-slate-400" />
                <MapPin size={18} className="text-slate-400" />
                <Users size={18} className="text-slate-400" />
                <Hash size={18} className="text-slate-400" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <PulseMeter score={displayScore} size={40} stroke={4} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pulse Score</span>
                </div>
                {/* REMOVED FULL AUDIT BUTTON */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Side */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
          <div className="sticky top-8 w-full max-w-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border-[8px] border-slate-900 dark:border-zinc-800 shadow-2xl overflow-hidden aspect-[9/16] max-h-[700px] flex flex-col relative">
              <div className="p-4 flex items-center justify-between border-b dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="" /></div>
                  <span className="text-xs font-bold dark:text-white">your_brand</span>
                </div>
                <Activity size={16} className="text-slate-400" />
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                {previewUrl ? (
                  selectedFile?.type.startsWith('video/') ? (
                    <video src={previewUrl} className="w-full h-full object-cover" autoPlay muted loop />
                  ) : (
                    <img src={previewUrl} className="w-full h-full object-cover" />
                  )
                ) : <ImageIcon size={48} className="text-slate-300" />}
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4"><Heart size={22} /><MessageCircle size={22} /><Share2 size={22} /></div>
                  <Bookmark size={22} />
                </div>
                <p className="text-xs font-bold dark:text-white">0 likes</p>
                <p className="text-xs dark:text-zinc-300"><span className="font-bold mr-2">your_brand</span>{caption || 'Caption preview...'}</p>
              </div>
            </div>
            
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isPublishing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              <span>{isPublishing ? 'Publishing...' : 'Publish Post'}</span>
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
  const color = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : '#10b981';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-100 dark:text-zinc-800" />
        <motion.circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={stroke} fill="transparent" strokeDasharray={circumference} animate={{ strokeDashoffset: offset }} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-black dark:text-white">{score}</span>
    </div>
  );
};

export default CreatePost;
