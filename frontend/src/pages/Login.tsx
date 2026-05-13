import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiService.login({ email, password });
      toast.success('Welcome back, creator! ⚡');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.message || 'Connection failed. Is the server running?';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[400px] bg-white rounded-[32px] p-10 shadow-2xl"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
          <div className="flex items-center space-x-2 mb-8">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-md cursor-pointer"
            >
              <Zap className="text-white w-6 h-6" />
            </motion.div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">InstaMetrics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-700">Welcome back</h2>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100 font-bold"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="you@example.com"
              className={`w-full bg-slate-50 border border-transparent focus:bg-white focus:border-purple-200 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-800 outline-none transition-all ${error ? 'border-red-200 bg-red-50/30' : ''}`}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••"
              className={`w-full bg-slate-50 border border-transparent focus:bg-white focus:border-purple-200 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-800 outline-none transition-all ${error ? 'border-red-200 bg-red-50/30' : ''}`}
            />
          </motion.div>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all active:scale-95 text-sm flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : 'Sign In'}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-semibold">
            Don't have an account? {' '}
            <Link to="/signup" className="text-slate-900 font-bold hover:underline">Create one</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
