import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Calendar, Filter, TrendingUp, Users, 
  Package, IndianRupee, BarChart3, PieChart, X, CheckCircle, Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Reports = () => {
  const { theme } = useApp();
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [reportType, setReportType] = useState('sales');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Detailed sales transactions with profit analysis',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Current stock status and bike details',
      icon: Package,
      color: 'green'
    },
    {
      id: 'customers',
      name: 'Customer Report',
      description: 'Customer information and purchase history',
      icon: Users,
      color: 'purple'
    },
    {
      id: 'profit-analysis',
      name: 'Profit Analysis',
      description: 'Comprehensive profit and loss analysis',
      icon: IndianRupee,
      color: 'yellow'
    }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'excel', label: 'Excel Spreadsheet', icon: BarChart3 },
    { value: 'csv', label: 'CSV File', icon: PieChart }
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        format,
        ...(dateRange.from && { dateFrom: dateRange.from }),
        ...(dateRange.to && { dateTo: dateRange.to })
      });

      const response = await fetch(`/api/reports/${reportType}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || '';
      
      // Fix PDF/Excel download
      const extension = format === 'excel' ? 'xlsx' : format;
      const fileName = `${reportType.replace(/-/g, ' ')}-${new Date().toISOString().slice(0,10)}.${extension}`;
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${fileName} downloaded successfully! ✅`);
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500/80 to-blue-600/80',
      green: 'from-emerald-500/80 to-emerald-600/80',
      purple: 'from-purple-500/80 to-purple-600/80',
      yellow: 'from-amber-500/80 to-amber-600/80'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-neutral-900'} min-h-screen text-xs`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-200/50 dark:border-neutral-800/50 px-3 py-3 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={12} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-[10px] opacity-60 font-mono uppercase tracking-wider">Generate comprehensive business reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Report Configuration - Your Original Layout */}
          <div className={`lg:col-span-2 bg-white/70 dark:bg-neutral-800/70 backdrop-blur rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-4 lg:p-6 order-2 lg:order-1`}>
            <h3 className={`text-[13px] font-bold mb-4 flex items-center gap-2 opacity-80 uppercase tracking-wider font-mono`}>
              <Filter size={12} />
              Report Configuration
            </h3>

            {/* Report Type Selection - Your Original Code */}
            <div className="mb-4">
              <label className={`block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-2`}>
                Select Report Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setReportType(type.id)}
                      className={`p-3 lg:p-4 rounded-xl border cursor-pointer transition-all group hover:shadow-md ${
                        reportType === type.id
                          ? 'border-blue-400/80 bg-gradient-to-r from-blue-50/70 to-blue-100/70 dark:from-blue-900/30 dark:to-blue-800/30 shadow-lg'
                          : theme === 'dark'
                          ? 'border-neutral-700/50 hover:border-neutral-600/70 bg-neutral-800/60 hover:bg-neutral-700/70'
                          : 'border-neutral-200/50 hover:border-neutral-300/70 bg-white/70 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 lg:p-2.5 rounded-xl bg-gradient-to-r ${getColorClasses(type.color)} flex-shrink-0 group-hover:scale-105 transition-all shadow-sm`}>
                          <Icon size={10} className="text-white font-bold" />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className={`font-semibold text-[11px] lg:text-[12px] leading-tight ${reportType === type.id ? 'text-blue-900 dark:text-blue-300' : theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'}`}>
                            {type.name}
                          </h4>
                          <p className={`text-[9px] mt-1 leading-tight opacity-75 ${reportType === type.id ? 'font-medium' : ''}`}>
                            {type.description}
                          </p>
                          {reportType === type.id && (
                            <div className="mt-2 pt-2 border-t border-blue-200/50">
                              <CheckCircle size={12} className="text-blue-500 ml-auto" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Date Range - Your Original Code */}
            <div className="mb-4">
              <label className={`block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-2`}>
                Date Range (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[9px] font-medium mb-1 opacity-75 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    From Date
                  </label>
                  <div className="relative">
                    <Calendar size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-1 focus:ring-blue-400/30 transition-all text-[11px] font-medium ${
                        theme === 'dark' 
                          ? 'bg-neutral-800/70 border-neutral-700/50 focus:border-blue-400 text-neutral-100' 
                          : 'bg-white/80 border-neutral-200/50 focus:border-blue-400/70'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-[9px] font-medium mb-1 opacity-75 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    To Date
                  </label>
                  <div className="relative">
                    <Calendar size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-1 focus:ring-emerald-400/30 transition-all text-[11px] font-medium ${
                        theme === 'dark' 
                          ? 'bg-neutral-800/70 border-neutral-700/50 focus:border-emerald-400 text-neutral-100' 
                          : 'bg-white/80 border-neutral-200/50 focus:border-emerald-400/70'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Format Selection - Your Original Code */}
            <div className="mb-6">
              <label className={`block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-2`}>
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formats.map((fmt) => {
                  const Icon = fmt.icon;
                  return (
                    <motion.div
                      key={fmt.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormat(fmt.value)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 text-center group hover:shadow-md ${
                        format === fmt.value
                          ? 'border-blue-400/80 bg-gradient-to-r from-blue-50/70 to-blue-100/70 dark:from-blue-900/30 shadow-lg'
                          : theme === 'dark'
                          ? 'border-neutral-700/50 hover:border-neutral-600 bg-neutral-800/60 hover:bg-neutral-700/70'
                          : 'border-neutral-200/50 hover:border-neutral-300 bg-white/70 hover:bg-white/90'
                      }`}
                    >
                      <Icon size={12} className={`transition-all ${format === fmt.value ? 'text-blue-600 scale-110' : theme === 'dark' ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-700'}`} />
                      <p className={`text-[10px] font-semibold leading-tight ${
                        format === fmt.value 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : theme === 'dark' ? 'text-neutral-200 group-hover:text-neutral-100' : 'text-neutral-900 group-hover:text-neutral-800'
                      }`}>
                        {fmt.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Generate Button - Your Original Code */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold text-[12px] border border-emerald-400/50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate & Download Report</span>
                </>
              )}
            </motion.button>

            {/* Preview Info */}
            <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-neutral-700/50 text-center text-[10px] opacity-60 space-y-1">
              <div>📋 Selected: {reportTypes.find(t => t.id === reportType)?.name}</div>
              <div>📄 Format: <span className="font-mono uppercase font-semibold">{format}</span></div>
              {dateRange.from && dateRange.to && (
                <div>📅 {dateRange.from} → {dateRange.to}</div>
              )}
            </div>
          </div>

          {/* Quick Stats - Your Original Layout */}
          <div className="space-y-4 order-1 lg:order-2">
            {/* Quick Stats Card */}
            <div className={`p-4 lg:p-6 rounded-2xl border bg-white/70 dark:bg-neutral-800/70 backdrop-blur ${
              theme === 'dark' ? 'border-neutral-700/50' : 'border-neutral-200/50'
            }`}>
              <h3 className={`text-[13px] font-bold mb-4 flex items-center gap-2 opacity-80 uppercase tracking-wider font-mono`}>
                Quick Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-neutral-200/30 dark:border-neutral-700/50 last:border-b-0">
                  <span className="text-[10px] opacity-70 font-mono uppercase tracking-wider">Total Sales</span>
                  <span className="font-bold text-[14px] text-emerald-600">18</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-200/30 dark:border-neutral-700/50 last:border-b-0">
                  <span className="text-[10px] opacity-70 font-mono uppercase tracking-wider">Revenue</span>
                  <span className="font-bold text-[14px] text-emerald-600">₹67,000</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-200/30 dark:border-neutral-700/50 last:border-b-0">
                  <span className="text-[10px] opacity-70 font-mono uppercase tracking-wider">Profit</span>
                  <span className="font-bold text-[14px] text-green-600">₹20,000</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-200/30 dark:border-neutral-700/50 last:border-b-0">
                  <span className="text-[10px] opacity-70 font-mono uppercase tracking-wider">Available Bikes</span>
                  <span className="font-bold text-[14px]">30</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[10px] opacity-70 font-mono uppercase tracking-wider">Total Customers</span>
                  <span className="font-bold text-[14px]">45</span>
                </div>
              </div>
            </div>

            {/* Report Features - Your Original Layout */}
            <div className={`p-4 lg:p-6 rounded-2xl border bg-white/70 dark:bg-neutral-800/70 backdrop-blur ${
              theme === 'dark' ? 'border-neutral-700/50' : 'border-neutral-200/50'
            }`}>
              <h3 className={`text-[13px] font-bold mb-4 flex items-center gap-2 opacity-80 uppercase tracking-wider font-mono`}>
                Report Features
              </h3>
              
              <div className="space-y-2">
                {[
                  'Detailed transaction records with profit calculations',
                  'Customer purchase history and analytics',
                  'Inventory status with aging analysis',
                  'Comprehensive profit and loss breakdown'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] opacity-80 leading-tight">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports - Your Original Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 lg:p-6 rounded-2xl border bg-white/70 dark:bg-neutral-800/70 backdrop-blur overflow-hidden ${
            theme === 'dark' ? 'border-neutral-700/50' : 'border-neutral-200/50'
          }`}
        >
          <h3 className={`text-[13px] font-bold mb-4 flex items-center gap-2 opacity-80 uppercase tracking-wider font-mono`}>
            Recent Reports
          </h3>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[
              { name: 'Sales Report - February 2026', date: '2026-02-14', type: 'PDF', size: '2.3 MB' },
              { name: 'Inventory Report - February 2026', date: '2026-02-13', type: 'Excel', size: '1.8 MB' },
              { name: 'Customer Report - February 2026', date: '2026-02-10', type: 'PDF', size: '1.2 MB' },
              { name: 'Profit Analysis - Q1 2026', date: '2026-02-08', type: 'Excel', size: '3.1 MB' }
            ].map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl transition-all group cursor-pointer hover:shadow-md ${
                  theme === 'dark' 
                    ? 'bg-neutral-800/70 hover:bg-neutral-700/80' 
                    : 'bg-neutral-50/70 hover:bg-white/90'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText size={12} className={`flex-shrink-0 opacity-60 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-[11px] truncate leading-tight ${theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'}`}>
                      {report.name}
                    </p>
                    <p className={`text-[9px] opacity-60 font-mono leading-tight`}>
                      {report.date} • {report.type} • {report.size}
                    </p>
                  </div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }} 
                  className={`p-2 rounded-xl transition-all ml-2 ${
                    theme === 'dark' 
                      ? 'text-blue-400 hover:bg-blue-900/30' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Download size={10} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
