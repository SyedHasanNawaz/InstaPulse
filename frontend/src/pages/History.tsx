import { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar,
  MoreVertical,
  Download,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAI } from '../context/AIContext';
import { apiService } from '../services/api';
import Skeleton from '../components/Skeleton';

const History = () => {
  const { historyData, loadingHistory: loading, getHistoryData } = useAI();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getHistoryData();
  }, []);

  const historyItems = historyData || [];

  const filteredItems = Array.isArray(historyItems) ? historyItems.filter(item => 
    (item?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item?.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const avgScore = filteredItems.length > 0 
    ? Math.round(filteredItems.reduce((acc, curr) => acc + (curr?.pulse_score || 0), 0) / filteredItems.length)
    : 0;

  if (loading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="pb-20 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
            History & Reports <HistoryIcon className="ml-3 text-purple-500" size={24} />
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">Review your past performance and growth trends.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => getHistoryData(true)}
            className="p-2.5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl text-slate-500 hover:text-purple-500 transition-all"
            title="Refresh Analysis"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Analyses" value={historyItems.length.toString()} change="+100%" icon={TrendingUp} color="purple" />
        <StatCard title="Avg. Score" value={`${avgScore}/100`} change="+5.2%" icon={ArrowUpRight} color="pink" />
        <StatCard title="Success Rate" value="Viral" change="+2.1%" icon={TrendingUp} color="orange" />
      </div>

      {/* Reports Table Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Analyses</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 w-4 h-4" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports..." 
                className="bg-slate-50 dark:bg-zinc-800/50 border-transparent focus:bg-white dark:focus:bg-zinc-800 rounded-lg py-2 pl-10 pr-4 text-xs outline-none transition-all dark:text-zinc-300"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredItems.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-800/30">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Report Name</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Predicted Boost</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">AI Score</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                {filteredItems.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900 dark:text-zinc-200 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{item?.title || 'Analysis'}</div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Reach: {item?.reach || '0'}</div>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                        {item?.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700 dark:text-zinc-300 text-sm">{item?.engagement_rate || '0%'}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                            style={{ width: `${item?.pulse_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-zinc-200">{item?.pulse_score || 0}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        item?.status === 'Viral' 
                          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
                          : item?.status === 'Optimal'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                      }`}>
                        {item?.status || 'Processing'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center">
                <div className="text-slate-400 dark:text-zinc-600 mb-4 flex justify-center">
                    <HistoryIcon size={48} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">No analysis history yet</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-500">Go to Optimization Advisor to start your first analysis!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const HistorySkeleton = () => (
  <div className="pb-20">
    <Skeleton className="h-10 w-64 mb-10" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <Skeleton className="h-32 w-full rounded-[2rem]" />
      <Skeleton className="h-32 w-full rounded-[2rem]" />
      <Skeleton className="h-32 w-full rounded-[2rem]" />
    </div>
    <Skeleton className="h-96 w-full rounded-[32px]" />
  </div>
);

const StatCard = ({ title, value, change, icon: Icon, color }: any) => {
  const colorMap: any = {
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
    pink: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{title}</span>
        <div className={`p-2 rounded-xl ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
        <div className="text-[11px] font-bold text-green-500 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-lg">
          {change}
        </div>
      </div>
    </div>
  );
};

export default History;
