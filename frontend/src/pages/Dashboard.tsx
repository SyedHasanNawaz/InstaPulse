import { useEffect } from 'react';
import { 
  TrendingUp, 
  FileText, 
  Zap, 
  Clock, 
  ArrowUp, 
  Plus, 
  ChevronRight,
  type LucideIcon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAI } from '../context/AIContext';
import Skeleton from '../components/Skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Dashboard = () => {
  const { theme } = useTheme();
  const { dashboardData: data, loadingDashboard: loading, getDashboardData } = useAI();
  const isDark = theme === 'dark';

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Engagement Rate',
      data: data.weeklyTrend,
      borderColor: isDark ? '#c084fc' : '#a855f7',
      backgroundColor: isDark ? 'rgba(192, 132, 252, 0.1)' : 'rgba(168, 85, 247, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 3
    }]
  };

  const timesData = {
    labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    datasets: [{
      data: data.hourlyEngagement,
      backgroundColor: isDark ? '#f472b6' : '#ec4899',
      borderRadius: 8,
      barThickness: 32
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#f8fafc' : '#0f172a',
        borderColor: isDark ? '#27272a' : '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(1)}%`
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: isDark ? '#27272a' : '#f1f5f9' }, 
        ticks: { 
          color: '#71717a', 
          font: { size: 10 },
          callback: (value: any) => `${value}%`
        } 
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#71717a', font: { size: 10 } } 
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-12 transition-colors duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">Welcome back! Here's your content performance overview.</p>
      </div>

      {/* KPI Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={item}>
          <MetricCard title="Avg. Engagement" value={data.avgEngagement} trend="+12%" icon={TrendingUp} iconColor="text-purple-600 dark:text-purple-400" bgColor="bg-purple-50 dark:bg-purple-900/20" />
        </motion.div>
        <motion.div variants={item}>
          <MetricCard title="Posts Analyzed" value={data.postsAnalyzed.toString()} trend="+8 new" icon={FileText} iconColor="text-pink-600 dark:text-pink-400" bgColor="bg-pink-50 dark:bg-pink-900/20" />
        </motion.div>
        <motion.div variants={item}>
          <MetricCard title="Optimization Score" value={data.optimizationScore} subtext="Excellent performance" icon={Zap} iconColor="text-orange-600 dark:text-orange-400" bgColor="bg-orange-50 dark:bg-orange-900/20" />
        </motion.div>
        <motion.div variants={item}>
          <MetricCard title="Best Time Today" value={data.bestTimeToday} subtext="Peak engagement time" icon={Clock} iconColor="text-blue-600 dark:text-blue-400" bgColor="bg-blue-50 dark:bg-blue-900/20" />
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm glass-card-hover"
        >
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Weekly Engagement Trend</h3>
            <p className="text-[11px] text-slate-400 mt-1">Your engagement rate over the past week</p>
          </div>
          <div className="h-64">
            <Line data={engagementData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm glass-card-hover"
        >
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Best Posting Times</h3>
            <p className="text-[11px] text-slate-400 mt-1">Optimal times based on your audience</p>
          </div>
          <div className="h-64">
            <Bar data={timesData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm glass-card-hover">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Recent Posts</h3>
          <div className="space-y-4">
            {data.recentPosts.map((post: any, idx: number) => (
              <PostItem 
                key={idx}
                title={post.title} 
                engagement={post.engagement} 
                change={post.change} 
                image={post.image} 
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm glass-card-hover">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Quick Tips</h3>
          <div className="space-y-4">
            <TipItem icon={Clock} color="text-blue-500 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" text={`Post between ${data.bestTimeToday} for max engagement`} />
            <TipItem icon={Plus} color="text-purple-500 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" text="Use 8-12 hashtags per post" />
            <TipItem icon={Zap} color="text-pink-500 dark:text-pink-400" bg="bg-pink-50 dark:bg-pink-900/20" text="Add question in caption" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="pb-12">
    <div className="mb-8">
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-4 w-80" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="lg:col-span-2 h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  subtext?: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

const MetricCard = ({ title, value, trend, subtext, icon: Icon, iconColor, bgColor }: MetricCardProps) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm transition-all cursor-default group glass-card-hover"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
      <div className={`w-8 h-8 rounded-lg ${bgColor} ${iconColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon size={16} />
      </div>
    </div>
    <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
    {trend ? (
      <div className="text-[11px] text-green-500 font-bold flex items-center">
        <ArrowUp size={12} className="mr-1" /> {trend} from last week
      </div>
    ) : (
      <div className="text-[11px] text-slate-500 font-medium dark:text-zinc-400">{subtext}</div>
    )}
  </motion.div>
);

interface PostItemProps {
  title: string;
  engagement: string;
  change: string;
  image: string;
  isNegative?: boolean;
}

const PostItem = ({ title, engagement, change, image, isNegative = false }: PostItemProps) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-zinc-700"
  >
    <div className="flex items-center space-x-4">
      <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover" />
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Predicted engagement: {engagement}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <span className={`text-[11px] font-bold ${isNegative ? 'text-red-400' : 'text-green-500'}`}>{change}</span>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400" />
    </div>
  </motion.div>
);

interface TipItemProps {
  icon: LucideIcon;
  color: string;
  bg: string;
  text: string;
}

const TipItem = ({ icon: Icon, color, bg, text }: TipItemProps) => (
  <div className={`${bg}/50 p-4 rounded-xl flex items-start space-x-3`}>
    <div className={`w-6 h-6 rounded bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 shadow-sm ${color}`}>
      <Icon size={12} />
    </div>
    <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">{text}</p>
  </div>
);

export default Dashboard;
