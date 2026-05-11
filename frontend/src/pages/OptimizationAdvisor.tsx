import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Hash, 
  Type, 
  Clock, 
  Target, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Users,
  Layers,
  Layout as LayoutIcon,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAI } from '../context/AIContext';
import Skeleton from '../components/Skeleton';

const OptimizationAdvisor = () => {
  const [appliedAll, setAppliedAll] = useState(false);
  const { 
    advisorData: advice, 
    loadingAdvisor: loading, 
    getAdvisorData, 
    getHistoryData,
    advisorForm, 
    setAdvisorForm 
  } = useAI();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // No auto-fetch — user must click "Analyze Draft" to trigger the AI

  const handleAnalyze = async () => {
    setIsRefreshing(true);
    await getAdvisorData(
      advisorForm.category, 
      advisorForm.mediaType, 
      advisorForm.followers, 
      advisorForm.day, 
      advisorForm.hour, 
      true
    ); 
    // Small delay to ensure DB commit is visible
    setTimeout(() => getHistoryData(true), 500);
    setIsRefreshing(false);
    toast.success('AI Analysis Updated!');
    
    // Auto-scroll to results for better visibility
    setTimeout(() => {
      window.scrollTo({
        top: 400,
        behavior: 'smooth'
      });
    }, 100);
  };


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
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">Draft your post details below to get personalized AI optimization.</p>
        </div>
      </div>

      {/* Input Simulator Form */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 mb-10 border border-slate-100 dark:border-zinc-800 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap size={120} className="text-purple-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Content Category</label>
            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={advisorForm.category}
                onChange={(e) => setAdvisorForm({...advisorForm, category: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 dark:text-zinc-200"
                placeholder="e.g. Fitness"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Media Type</label>
            <div className="relative">
              <LayoutIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={advisorForm.mediaType}
                onChange={(e) => setAdvisorForm({...advisorForm, mediaType: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 dark:text-zinc-200 appearance-none"
              >
                <option value="reel">Reel</option>
                <option value="image">Image</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Follower Count</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="number" 
                value={advisorForm.followers}
                onChange={(e) => setAdvisorForm({...advisorForm, followers: parseInt(e.target.value)})}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 dark:text-zinc-200"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Day of Week</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={advisorForm.day}
                onChange={(e) => setAdvisorForm({...advisorForm, day: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 dark:text-zinc-200 appearance-none"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Post Hour (0-23)</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="number" 
                min="0"
                max="23"
                value={advisorForm.hour}
                onChange={(e) => setAdvisorForm({...advisorForm, hour: parseInt(e.target.value)})}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 dark:text-zinc-200"
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={isRefreshing}
            className="w-full md:col-span-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-purple-200 dark:shadow-none flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            {isRefreshing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            <span>{isRefreshing ? 'Analyzing...' : 'Analyze Draft'}</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isRefreshing ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OptimizationSkeleton />
          </motion.div>
        ) : advice && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Strategy Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-700">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Draft Strategy</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Posting Time</span>
                    <span className="font-bold text-slate-700 dark:text-zinc-300">{advisorForm.hour}:00 ({advisorForm.day})</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Hashtag Density</span>
                    <span className="font-bold text-slate-700 dark:text-zinc-300">Standard (10)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">AI Pulse Score</span>
                    <span className="font-bold text-red-500">{advice.pulseScore} / 100</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-2xl border border-dashed border-purple-200 dark:border-purple-800/30">
                <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">AI Optimized Strategy</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-500/70">Optimal Time</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{advice.bestHour} ({advisorForm.day})</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-500/70">Optimal Hashtags</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{advice.bestHashtagsCount} Targeted</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-500/70">Optimized Reach</span>
                    <span className="font-bold text-green-500">{advice.reach} (Est.)</span>
                  </div>
                </div>
              </div>
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
                    Based on our AI analysis for a <span className="text-purple-500 font-bold">{advisorForm.category}</span> {advisorForm.mediaType}, applying the suggested optimizations could increase your reach by up to <span className="font-bold text-purple-600 dark:text-purple-400">{advice.potentialBoost}</span>.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
                    {advice.potentialBoost}
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
                title="Add Relevant Hashtags" 
                impact={advice.hashtagsImpact} 
                color="purple" 
                description={`Your current hashtag strategy could be improved. Adding ${advice.bestHashtagsCount} targeted hashtags could increase reach by up to ${advice.hashtagsImpact}.`}
                tags={advice.suggestedHashtags}
              />
              <SuggestionCard 
                variants={item}
                icon={Type} 
                title="Optimize Caption Tone" 
                impact={advice.captionImpact} 
                color="pink" 
                description="Your caption tone has been analyzed. Following these AI-generated tips could improve engagement by 20%."
                tips={advice.captionTips}
              />
              <SuggestionCard 
                variants={item}
                icon={Clock} 
                title="Shift Posting Time" 
                impact={advice.timeImpact} 
                color="orange" 
                description={`Our AI predicts your audience is most active at ${advice.bestHour} today. Shifting your post could boost reach by ${advice.timeImpact}.`}
                action={`Reschedule to ${advice.bestHour}`}
              />
              <SuggestionCard 
                variants={item}
                icon={Target} 
                title="Audience Targeting" 
                impact="+15%" 
                color="blue" 
                description="Your current targeting settings are good, but focusing on trending tech niches could yield even better results."
                action="Adjust Targeting"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OptimizationSkeleton = () => (
  <div className="pb-20">
    <Skeleton className="h-48 w-full mb-10 rounded-[32px]" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="h-64 w-full rounded-[2rem]" />
      <Skeleton className="h-64 w-full rounded-[2rem]" />
      <Skeleton className="h-64 w-full rounded-[2rem]" />
      <Skeleton className="h-64 w-full rounded-[2rem]" />
    </div>
  </div>
);

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
              <PlusIcon size={12} className="mr-2 text-pink-500" /> {tip}
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

const PlusIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default OptimizationAdvisor;
