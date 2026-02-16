import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, CheckCircle, XCircle, Clock, Package, 
  Calendar, MapPin, Phone, User, Eye, Zap, AlertCircle,
  Loader2, Bike, Hash
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Availability = () => {
  const { theme, bikes = [], fetchBikes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const brands = ['Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'KTM', 'Royal Enfield', 'Suzuki', 'Kawasaki'];

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  // 🚀 Optimized search with useMemo
  const searchResults = useMemo(() => {
    if (!searchTerm && !filterBrand && !filterStatus) return [];
    
    return bikes.filter(bike => {
      const matchesSearch = !searchTerm || 
        bike.bikeNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.model?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = !filterBrand || bike.brand === filterBrand;
      const matchesStatus = !filterStatus || bike.status === filterStatus;
      
      return matchesSearch && matchesBrand && matchesStatus;
    });
  }, [searchTerm, filterBrand, filterStatus, bikes]);

  const getStatusConfig = (status) => {
    const configs = {
      available: { icon: CheckCircle, color: 'emerald', bg: 'bg-emerald-100/70 dark:bg-emerald-900/30' },
      sold: { icon: XCircle, color: 'red', bg: 'bg-red-100/70 dark:bg-red-900/30' },
      reserved: { icon: Clock, color: 'yellow', bg: 'bg-yellow-100/70 dark:bg-yellow-900/30' },
      maintenance: { icon: AlertCircle, color: 'orange', bg: 'bg-orange-100/70 dark:bg-orange-900/30' }
    };
    return configs[status] || { icon: Package, color: 'gray', bg: 'bg-neutral-100/70 dark:bg-neutral-800/50' };
  };

  const getDaysInInventory = (purchaseDate) => {
    if (!purchaseDate) return 0;
    const today = new Date();
    const purchase = new Date(purchaseDate);
    return Math.ceil(Math.abs(today - purchase) / (1000 * 60 * 60 * 24));
  };

  const stats = useMemo(() => ({
    available: bikes.filter(b => b.status === 'available').length,
    sold: bikes.filter(b => b.status === 'sold').length,
    reserved: bikes.filter(b => b.status === 'reserved').length,
    total: bikes.length
  }), [bikes]);

  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-neutral-900'} min-h-screen p-3 text-[10px] space-y-3`}>
      
      {/* 📱 Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-200/50 dark:border-neutral-800/50 px-3 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Bike size={11} className="text-white" />
            </div>
            <div>
              <h1 className="text-[15px] lg:text-base font-bold tracking-tight">Bike Availability</h1>
              <p className="text-[9px] opacity-60 font-mono uppercase tracking-wider">Real-time inventory search & status</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="font-mono opacity-70">Total: {stats.total}</span>
            <div className="w-px h-3 bg-neutral-400 mx-1.5"></div>
            <Zap size={10} className="opacity-60" />
          </div>
        </div>
      </div>

      {/* 📊 Quick Stats - Compact */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
        {[
          { value: stats.available, label: 'Available', icon: CheckCircle, color: 'emerald' },
          { value: stats.sold, label: 'Sold', icon: XCircle, color: 'red' },
          { value: stats.reserved, label: 'Reserved', icon: Clock, color: 'yellow' },
          { value: stats.total, label: 'Total', icon: Package, color: 'blue' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-2.5 rounded-xl border group hover:shadow-md transition-all flex flex-col items-center text-center ${
                theme === 'dark'
                  ? `bg-neutral-800/70 border-neutral-700/50 hover:bg-neutral-700/70 text-${stat.color}-400`
                  : `bg-white/70 border-neutral-200/50 hover:bg-white/90 text-${stat.color}-700`
              }`}
            >
              <Icon size={10} className="mb-1" />
              <div className="text-[13px] font-bold">{stat.value}</div>
              <div className="text-[8px] opacity-70 font-mono uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* 🔍 Pro Search Bar */}
      <div className={`p-4 lg:p-5 rounded-2xl border bg-white/70 dark:bg-neutral-800/70 backdrop-blur shadow-sm ${
        theme === 'dark' ? 'border-neutral-700/50' : 'border-neutral-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search bike number, brand, model..."
              className={`w-full pl-10 pr-4 py-3 lg:py-2.5 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/50 transition-all bg-white/50 dark:bg-neutral-800/50 backdrop-blur text-[11px] font-medium placeholder:opacity-50`}
            />
          </div>

          <div className="flex flex-wrap gap-2 lg:gap-3">
            <div className="flex-1 min-w-[120px]">
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full px-3 py-2.5 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:ring-2 focus:ring-purple-400/30 bg-white/50 dark:bg-neutral-800/50 text-[10px] font-mono uppercase tracking-wider"
              >
                <option value="">All Brands</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[100px]">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:ring-2 focus:ring-emerald-400/30 bg-white/50 dark:bg-neutral-800/50 text-[10px] font-mono uppercase tracking-wider"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setFilterBrand('');
                setFilterStatus('');
              }}
              className="p-2.5 lg:p-3 bg-neutral-100/70 hover:bg-neutral-200/70 dark:bg-neutral-800/70 dark:hover:bg-neutral-700/70 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <Filter size={10} />
            </motion.button>
          </div>
        </div>

        {/* 🎯 Search Stats */}
        <AnimatePresence>
          {(searchTerm || filterBrand || filterStatus) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-4 text-[10px] opacity-80 mb-4 pl-1"
            >
              <Hash size={10} />
              <span className="font-mono uppercase tracking-wider">Found {searchResults.length} bikes</span>
              {searchTerm && <span>• Bike# / {searchTerm}</span>}
              {filterBrand && <span>• {filterBrand}</span>}
              {filterStatus && <span>• {filterStatus}</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 📋 Results - Pro Cards */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-[11px] opacity-60 font-mono uppercase tracking-wider">Searching inventory...</p>
          </motion.div>
        ) : searchResults.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-2.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {searchResults.map((bike, index) => {
                const statusConfig = getStatusConfig(bike.status);
                const Icon = statusConfig.icon;
                const days = getDaysInInventory(bike.purchaseDate);
                
                return (
                  <motion.div
                    key={bike._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`p-3 lg:p-3.5 rounded-xl border group hover:shadow-lg hover:shadow-${statusConfig.color}-500/10 transition-all overflow-hidden h-full flex flex-col ${
                      theme === 'dark'
                        ? `bg-neutral-800/70 border-neutral-700/50 hover:bg-neutral-700/70`
                        : `bg-white/70 border-neutral-200/50 hover:bg-white/90`
                    } ${statusConfig.bg}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="space-y-1">
                        <h4 className="text-[12px] font-bold tracking-tight truncate pr-2">{bike.bikeNumber}</h4>
                        <div className="flex items-center gap-1.5 text-[9px] opacity-80 font-mono uppercase tracking-wider">
                          <span>{bike.brand}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="truncate max-w-[100px]">{bike.model}</span>
                        </div>
                      </div>
                      <Icon size={11} className={`flex-shrink-0 ml-1 opacity-90`} />
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-1.5 mb-auto text-[9px]">
                      <div className="flex items-center justify-between py-1">
                        <span className="opacity-70 font-mono uppercase tracking-wider">Year</span>
                        <span className="font-semibold">{bike.year}</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-1">
                        <span className="opacity-70 font-mono uppercase tracking-wider">Color</span>
                        <span className="font-semibold capitalize">{bike.color || 'N/A'}</span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="opacity-70 font-mono uppercase tracking-wider">Price</span>
                        <span className="text-[11px] font-bold text-emerald-600">₹{bike.buyPrice?.toLocaleString()}</span>
                      </div>

                      {bike.status === 'available' && (
                        <div className={`flex items-center justify-between py-1 px-1 rounded-lg ${
                          days > 30 ? 'bg-red-500/10' : 'bg-emerald-500/10'
                        }`}>
                          <span className="opacity-70 font-mono uppercase tracking-wider">Days in stock</span>
                          <span className={`font-bold text-[11px] ${days > 30 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {days}d
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Footer */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-200/30 dark:border-neutral-700/50">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                          theme === 'dark'
                            ? `bg-neutral-700 text-${statusConfig.color}-300 border-${statusConfig.color}-500/50`
                            : `bg-white/50 text-${statusConfig.color}-700 border-${statusConfig.color}-200`
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-${statusConfig.color}-500`}></div>
                        {bike.status}
                      </motion.span>

                      {bike.status === 'sold' && bike.profit !== undefined && (
                        <span className={`text-[10px] font-bold ${
                          bike.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {bike.profit >= 0 ? '+' : ''}₹{(bike.profit || 0)?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-12 lg:p-16 rounded-2xl border text-center ${
              theme === 'dark'
                ? 'bg-neutral-800/50 border-neutral-700/50'
                : 'bg-white/50 border-neutral-200/50'
            }`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            >
              <Search size={20} className="text-white" />
            </motion.div>
            <h3 className="text-[14px] font-bold mb-1.5">Start your search</h3>
            <p className="text-[10px] opacity-60 font-mono uppercase tracking-wider max-w-sm mx-auto">
              Enter bike number, brand, or model to check availability instantly
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Availability;
