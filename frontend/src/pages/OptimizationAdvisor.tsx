import { useState } from 'react';
import { 
  Sparkles, 
  Hash, 
  Type, 
  Clock, 
  Target, 
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OptimizationAdvisor = () => {
  const [appliedAll, setAppliedAll] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-20 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
            Optimization Advisor <Sparkles className="ml-3 text-purple-500" size={24} />
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">AI-powered suggestions to maximize your post engagement.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setAppliedAll(true);
            toast.success('All optimizations applied! 🚀');
          }}
          className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center space-x-2 ${
            appliedAll 
              ? 'bg-green-500 text-white shadow-green-100 dark:shadow-none' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-100 dark:shadow-none hover:shadow-xl'
          }`}
        >
          {appliedAll ? <><CheckCircle2 size={18} /> <span>Applied All</span></> : <><Zap size={18} /> <span>Apply All Suggestions</span></>}
        </motion.button>
      </div>

      {/* Main Prediction Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-12 mb-10 border border-slate-100 dark:border-zinc-800 shadow-sm"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Potential Engagement Boost</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
              Based on our AI analysis of your draft, applying the suggested optimizations could increase your reach by up to <span className="font-bold text-purple-600 dark:text-purple-400">130%</span>.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
              +130%
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Total Improvement</span>
          </div>
        </div>
      </motion.div>

      {/* Suggestions Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <SuggestionCard 
          variants={item}
          icon={Hash} 
          title="Add More Relevant Hashtags" 
          impact="+35%" 
          color="purple" 
          description="Your post currently has 5 hashtags. Adding 5-7 more targeted hashtags could increase reach by up to 35%."
          tags={['#contentcreator', '#socialmediatips', '#instagramgrowth', '#digitalmarketing', '#contentmarketing']}
        />
        <SuggestionCard 
          variants={item}
          icon={Type} 
          title="Optimize Caption Length" 
          impact="+28%" 
          color="pink" 
          description="Your caption is only 45 characters. Captions between 125-150 characters tend to perform 28% better."
          tips={['Add a compelling hook in first line', 'Include a call-to-action', 'Ask a question to encourage comments']}
        />
        <SuggestionCard 
          variants={item}
          icon={Clock} 
          title="Shift Posting Time" 
          impact="+42%" 
          color="orange" 
          description="You've scheduled this for 2:00 PM. Our AI predicts your audience is most active at 6:30 PM today."
          action="Reschedule to 6:30 PM"
        />
        <SuggestionCard 
          variants={item}
          icon={Target} 
          title="Improve Visual Contrast" 
          impact="+25%" 
          color="blue" 
          description="The image contrast is slightly low. Brightening the midtones could increase stop-rate by 25%."
          action="Open Editor"
        />
      </motion.div>
    </div>
  );
};

const SuggestionCard = ({ icon: Icon, title, impact, color, description, tags, tips, action, variants }: any) => {
  const colorMap: any = {
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
    pink: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  };

  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-md">High Impact</span>
          <span className="text-sm font-black text-green-500">{impact}</span>
        </div>
      </div>

      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-6 flex-1">{description}</p>

      {tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag: string) => (
            <span key={tag} className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}

      {tips && (
        <div className="space-y-2 mb-6">
          {tips.map((tip: string) => (
            <div key={tip} className="flex items-center text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
              <Plus size={12} className="mr-2 text-pink-500" /> {tip}
            </div>
          ))}
        </div>
      )}

      <button className="w-full py-3 rounded-xl border border-slate-100 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center group">
        {action || 'Apply Suggestion'} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

const Plus = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default OptimizationAdvisor;
