import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Loader2, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password Strength Logic
  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    return s;
  }, [password]);

  const strengthInfo = [
    { label: 'Very Weak', color: 'bg-red-500', text: 'text-red-500' },
    { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500' },
    { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' },
    { label: 'Strong', color: 'bg-green-500', text: 'text-green-500' },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await apiService.signup(fullName, email, password);
      toast.success('Account created! Welcome to InstaMetrics 🚀');
      navigate('/login');
    } catch (err: any) {
      const msg = err.message || 'Signup failed';
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
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
      
      {/* Animated Signup Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px] bg-white rounded-[32px] p-10 shadow-2xl"
      >
        
        {/* Logo Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <motion.div 
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-md cursor-pointer"
            >
              <Zap className="text-white w-6 h-6" />
            </motion.div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">InstaMetrics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-700">Create account</h2>
        </motion.div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100 font-bold"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-purple-200 rounded-xl py-3 px-4 text-sm outline-none transition-all"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-purple-200 rounded-xl py-3 px-4 text-sm outline-none transition-all"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-purple-200 rounded-xl py-3 px-4 text-sm outline-none transition-all"
            />
            
            {/* Password Strength Meter */}
            <div className="pt-2 px-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-slate-400">Security</span>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${strengthInfo[strength].text}`}>
                  {strengthInfo[strength].label}
                </span>
              </div>
              <div className="flex space-x-1 h-1">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      i < strength ? strengthInfo[strength].color : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[9px] text-slate-400 mt-2 flex items-center">
                {strength === 4 ? (
                  <><ShieldCheck size={10} className="mr-1 text-green-500" /> Password is secure</>
                ) : (
                  <><ShieldAlert size={10} className="mr-1" /> Use 8+ chars with mix of letters & numbers</>
                )}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1 pt-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-slate-50 border border-transparent focus:bg-white focus:border-purple-200 rounded-xl py-3 px-4 text-sm outline-none transition-all ${
                confirmPassword && password !== confirmPassword ? 'border-red-200 bg-red-50' : ''
              }`}
            />
            {confirmPassword && password === confirmPassword && password !== '' && (
              <p className="text-[9px] text-green-500 font-bold mt-1 flex items-center ml-1">
                <Check size={10} className="mr-1" /> Passwords match
              </p>
            )}
          </motion.div>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all active:scale-95 text-sm flex items-center justify-center disabled:opacity-70 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : 'Get Started'}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-semibold">
            Already have an account? {' '}
            <Link to="/login" className="text-slate-900 font-bold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Signup;
