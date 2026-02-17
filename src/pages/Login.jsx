import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import logo from '../components/sai_motors_logo.jpeg'
const Login = () => {
  const { login } = useAuth();
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    email: 'admin@saibikes.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Page reload function
  const handlePageReload = () => {
    toast('Reloading page...', { duration: 1000 });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logo}
            alt="Sai Motors" 
            className="w-48 h-auto mx-auto rounded-lg mb-2" 
          />
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={`w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200/50 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-500' 
                      : 'bg-white/50 border-gray-200/50'
                  }`}
                  placeholder="admin@saibikes.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className={`w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200/50 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-500' 
                      : 'bg-white/50 border-gray-200/50'
                  }`}
                  placeholder="admin123"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-2 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handlePageReload}
                disabled={loading}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  loading
                    ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-700/50 hover:bg-gray-600 border border-gray-600/50 text-gray-300'
                      : 'bg-gray-100/50 hover:bg-gray-200 border border-gray-300/50 text-gray-700'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  loading 
                    ? 'bg-gray-500/80 text-gray-300 cursor-not-allowed' 
                    : theme === 'dark'
                      ? 'bg-white/90 hover:bg-gray-100 text-black border border-gray-200'
                      : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/80 border-t-white rounded-full animate-spin" />
                    Sign In
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-center text-xs mt-6 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          © 2026 SAI MOTORS. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
