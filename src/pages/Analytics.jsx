import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Calendar, Target, Clock, Award, AlertTriangle, 
  Users, IndianRupee, Activity, BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Analytics = () => {
  const { theme, dashboardData, loading, fetchDashboardData } = useApp();
  const [timeRange, setTimeRange] = useState('6months');

  const timeRanges = [
    { value: '1month', label: '1M' },
    { value: '3months', label: '3M' },
    { value: '6months', label: '6M' },
    { value: '1year', label: '1Y' }
  ];

  // Transform real dashboard data
  const salesTrendData = (dashboardData.monthlyData || []).slice(0, 6).map((item, i) => ({
    month: `M${i + 1}`,
    sales: item.sales || 0,
    revenue: Math.round(item.revenue || 0),
    profit: Math.round(item.profit || 0)
  }));

  const brandPerformanceData = (dashboardData.brandStats || []).slice(0, 5).map((item, i) => ({
    brand: item._id?.substring(0, 12) || `Brand ${i + 1}`,
    sales: item.sales || 0,
    revenue: Math.round(item.revenue || 0)
  }));

  const inventoryData = [
    { name: 'Available', value: dashboardData.availableBikes || 0, fill: '#10B981' },
    { name: 'Sold', value: dashboardData.soldBikes || 0, fill: '#3B82F6' },
    { name: 'Reserved', value: dashboardData.reservedBikes || 0, fill: '#F59E0B' },
    { name: 'Slow', value: dashboardData.slowMovingBikes?.length || 0, fill: '#EF4444' }
  ];

  const kpiMetrics = [
    {
      value: `${(dashboardData.profitMargin || 0).toFixed(1)}%`,
      label: 'Profit Margin',
      icon: TrendingUp,
      color: '#3B82F6'
    },
    {
      value: dashboardData.avgSaleValue ? `₹${Math.round(dashboardData.avgSaleValue)}` : '₹0',
      label: 'Avg Sale',
      icon: IndianRupee,
      color: '#F59E0B'
    },
    {
      value: dashboardData.totalRevenue?.toLocaleString() || '0',
      label: 'Revenue',
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      value: (dashboardData.newCustomers || 0).toString(),
      label: 'New Customers',
      icon: Users,
      color: '#8B5CF6'
    }
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-neutral-900'} min-h-screen  text-xs sm:text-sm space-y-3 sm:space-y-4`}>
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-200/50 dark:border-neutral-800/50 px-3 py-2 sm:px-4 sm:py-3 mb-3 sm:mb-4 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center border">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h1 className="text-[13px] sm:text-base lg:text-lg font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-200 bg-clip-text">
                Analytics Dashboard
              </h1>
              <p className="text-[10px] sm:text-xs opacity-70 font-mono uppercase tracking-wider">
                Real-time business insights from MongoDB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-neutral-200/50 dark:border-neutral-700">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-[11px] sm:text-sm font-semibold border-none outline-none px-2 py-1 cursor-pointer font-mono uppercase tracking-wider"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {kpiMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`p-2.5 sm:p-4 rounded-lg border hover:border-blue-400/50 transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-neutral-800/70 border-neutral-700/50 hover:bg-neutral-700/70'
                  : 'bg-white/70 border-neutral-200/50 hover:bg-white/90'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="p-1 sm:p-1.5 rounded-lg border flex-shrink-0" 
                     style={{ backgroundColor: `${metric.color}20`, borderColor: `${metric.color}30` }}>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: metric.color }} />
                </div>
              </div>
              <div>
                <h3 className="text-[14px] sm:text-lg lg:text-xl font-bold leading-tight mb-0.5 sm:mb-1 text-neutral-900 dark:text-white">
                  {metric.value}
                </h3>
                <p className="text-[9px] sm:text-xs opacity-70 uppercase tracking-wider font-mono">
                  {metric.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-6">
        
        {/* Sales & Revenue Trend */}
        <div className={`p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-neutral-800/70 border-neutral-700/50' 
            : 'bg-white/70 border-neutral-200/50'
        }`}>
          <h3 className="text-[11px] sm:text-xs lg:text-sm font-bold mb-2 sm:mb-3 flex items-center gap-1.5 opacity-80 uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
            Sales & Revenue Trend
          </h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} vertical={false} />
                <XAxis dataKey="month" fontSize={10} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Performance */}
        <div className={`p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-neutral-800/70 border-neutral-700/50' 
            : 'bg-white/70 border-neutral-200/50'
        }`}>
          <h3 className="text-[11px] sm:text-xs lg:text-sm font-bold mb-2 sm:mb-3 flex items-center gap-1.5 opacity-80 uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            Brand Performance
          </h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="2 2" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} vertical={false} />
                <XAxis type="number" fontSize={10} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} tickLine={false} axisLine={false} />
                <YAxis dataKey="brand" type="category" fontSize={10} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                <Bar dataKey="sales" fill="#3B82F6" radius={[2, 0, 0, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        
        {/* Fast Selling */}
        <div className={`p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-neutral-800/70 border-neutral-700/50' 
            : 'bg-gradient-to-br from-emerald-50/70 to-green-50/70 border-emerald-200/50'
        }`}>
          <h3 className="text-[11px] sm:text-xs lg:text-sm font-bold mb-3 sm:mb-4 flex items-center gap-1.5 opacity-90 uppercase tracking-wider font-mono text-emerald-900 dark:text-emerald-200">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
            Fast Selling Bikes
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {brandPerformanceData.slice(0, 4).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:border-emerald-300/50 transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[9px] sm:text-xs font-bold flex items-center justify-center ${
                    i === 0 ? 'bg-yellow-400 text-white' : 
                    i === 1 ? 'bg-gray-400 text-white' : 
                    i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-semibold truncate leading-tight">{item.brand}</p>
                    <p className="text-[9px] opacity-70 font-mono">{item.sales} sales</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-[11px] sm:text-sm font-bold text-emerald-600">
                    ₹{Math.round(item.revenue || 0)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inventory Pie */}
        <div className={`p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl border flex items-center justify-center ${
          theme === 'dark' 
            ? 'bg-neutral-800/70 border-neutral-700/50' 
            : 'bg-gradient-to-br from-orange-50/70 to-red-50/70 border-orange-200/50'
        }`}>
          <div className="w-full h-40 sm:h-48 flex items-center justify-center">
            <ResponsiveContainer width="95%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData.filter(d => d.value > 0)}
                  cx="50%" 
                  cy="50%" 
                  innerRadius={25}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="p-4 sm:p-6 bg-white/90 dark:bg-neutral-900/90 border rounded-xl text-center max-w-sm mx-4 text-xs sm:text-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 border">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2 text-neutral-900 dark:text-white">
              Loading Analytics
            </h3>
            <p className="opacity-75 font-mono text-neutral-600 dark:text-neutral-400">
              Fetching real-time data from backend...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
