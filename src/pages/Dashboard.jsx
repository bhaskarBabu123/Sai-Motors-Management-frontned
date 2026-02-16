import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area,
  ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import {
  Activity, BarChart2, PieChart as PieIcon, Users2, Bike, Zap, Star, Gauge, DollarSign, 
  TrendingUp, AlertTriangle, Target, Calendar, Percent, Clock, Package, ShoppingCart, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { theme, dashboardData, dashboardFilter, setDashboardFilter, loading } = useApp();

  const filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'Week' },
    { value: 'thisMonth', label: 'Month' },
    { value: 'lastMonth', label: 'Last Mo' },
    { value: 'thisYear', label: 'Year' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Transform backend data
  const chartData = dashboardData.monthlyData?.map(item => ({
    month: `${item._id?.month || ''}/${item._id?.year?.toString().slice(-2) || ''}`,
    revenue: item.revenue || 0,
    profit: item.profit || 0,
    sales: item.sales || 0
  })) || [];

  const brandData = dashboardData.brandStats?.slice(0, 5).map((item, i) => ({
    name: item._id || 'N/A',
    value: item.sales || item.revenue || 0,
    fill: COLORS[i % COLORS.length]
  })) || [];

  const topProfitData = dashboardData.topProfitBikes?.map((bike, i) => ({
    name: `${bike.brand?.slice(0,8)} ${bike.model?.slice(0,10)}`,
    profit: bike.profit || 0,
    rank: i + 1
  })) || [];

  const inventoryData = [
    { name: 'Available', value: dashboardData.availableBikes || 0, fill: '#10B981' },
    { name: 'Sold', value: dashboardData.soldBikes || 0, fill: '#3B82F6' },
    { name: 'Reserved', value: dashboardData.reservedBikes || 0, fill: '#F59E0B' }
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen p-3 sm:p-4 space-y-3`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="w-3 h-3 text-gray-500" />
          <select 
            value={dashboardFilter}
            onChange={(e) => setDashboardFilter(e.target.value)}
            className={`text-xs p-1.5 border rounded px-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <div className={`p-2.5 border rounded-lg flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <Bike className="w-5 h-5 text-blue-500 mb-1" />
          <div className="text-xs font-bold">{dashboardData.totalBikes?.toLocaleString() || 0}</div>
          <div className="text-xs opacity-75">Total</div>
        </div>
        
        <div className={`p-2.5 border rounded-lg flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <Gauge className="w-5 h-5 text-emerald-500 mb-1" />
          <div className="text-xs font-bold text-emerald-500">{dashboardData.availableBikes || 0}</div>
          <div className="text-xs opacity-75">Available</div>
        </div>
        
        <div className={`p-2.5 border rounded-lg flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <DollarSign className="w-5 h-5 text-emerald-500 mb-1" />
          <div className="text-xs font-bold text-emerald-500">₹{(dashboardData.totalRevenue || 0)?.toLocaleString()}</div>
          <div className="text-xs opacity-75">Revenue</div>
        </div>
        
        <div className={`p-2.5 border rounded-lg flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <TrendingUp className="w-5 h-5 mb-1" />
          <div className="text-xs font-bold text-emerald-500">₹{(dashboardData.totalProfit || 0)?.toLocaleString()}</div>
          <div className="text-xs opacity-75">Profit</div>
        </div>
        
        <div className={`p-2.5 border rounded-lg flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <AlertTriangle className="w-5 h-5 text-orange-500 mb-1" />
          <div className="text-xs font-bold text-orange-500">{dashboardData.lossBikes || 0}</div>
          <div className="text-xs opacity-75">Loss</div>
        </div>
        
        <div className={`p-2.5 border rounded-lg flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <Users2 className="w-5 h-5 text-indigo-500 mb-1" />
          <div className="text-xs font-bold">{dashboardData.totalCustomers || 0}</div>
          <div className="text-xs opacity-75">Customers</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        
        {/* Revenue Line Chart */}
        <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue Trend</span>
          </div>
          <div style={{height: '220px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke={theme === 'dark' ? '#374151' : '#F3F4F6'}/>
                <XAxis dataKey="month" fontSize={10} stroke="#6B7280" tickLine={false}/>
                <YAxis fontSize={10} stroke="#6B7280" tickLine={false}/>
                <Tooltip contentStyle={{fontSize: '11px', borderRadius: '6px'}}/>
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} dot={false}/>
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2.5} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Pie Chart */}
        <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <PieIcon className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Brand Share</span>
          </div>
          <div style={{height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ResponsiveContainer width="95%" height="95%">
              <PieChart>
                <Pie data={brandData} cx="50%" cy="50%" innerRadius={25} outerRadius={65} paddingAngle={2} dataKey="value">
                  {brandData.map((entry, index) => <Cell key={index} fill={entry.fill}/>)}
                </Pie>
                <Tooltip contentStyle={{fontSize: '11px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Bar Chart */}
        <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Sales Count</span>
          </div>
          <div style={{height: '220px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{right: 20}}>
                <CartesianGrid strokeDasharray="2 2" vertical={false}/>
                <XAxis type="number" fontSize={10} stroke="#6B7280" tickLine={false}/>
                <YAxis dataKey="month" type="category" fontSize={10} stroke="#6B7280" width={60}/>
                <Tooltip contentStyle={{fontSize: '11px'}}/>
                <Bar dataKey="sales" fill="#8B5CF6" radius={[2,2,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Donut */}
        <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory</span>
          </div>
          <div style={{height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ResponsiveContainer width="95%" height="95%">
              <PieChart>
                <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={75} paddingAngle={2} dataKey="value">
                  {inventoryData.map((entry, index) => <Cell key={index} fill={entry.fill}/>)}
                </Pie>
                <Tooltip contentStyle={{fontSize: '11px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Profits Horizontal Bar */}
        <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Top Profits</span>
          </div>
          <div style={{height: '220px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProfitData.slice(0,6)} layout="horizontal" margin={{top: 10, right: 20}}>
                <CartesianGrid strokeDasharray="2 2" horizontal={false}/>
                <XAxis dataKey="profit" fontSize={10} stroke="#6B7280" tickLine={false}/>
                <YAxis dataKey="name" fontSize={10} stroke="#6B7280" width={100}/>
                <Tooltip contentStyle={{fontSize: '11px'}}/>
                <Bar dataKey="profit" fill="#F59E0B" radius={[3,0,0,3]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart - Performance Metrics */}
        <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Metrics</span>
          </div>
          <div style={{height: '220px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[{revenue: dashboardData.totalRevenue/10000, profit: dashboardData.totalProfit/5000, bikes: dashboardData.totalBikes/10, customers: dashboardData.totalCustomers/50}]}>
                <PolarGrid strokeDasharray="2 2"/>
                <PolarAngleAxis dataKey="subject" fontSize={10}/>
                <Radar name="Performance" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3}/>
                <Radar name="Profit" dataKey="profit" stroke="#10B981" fill="#10B981" fillOpacity={0.3}/>
                <Tooltip contentStyle={{fontSize: '11px'}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className={`p-3 border rounded-lg flex items-center gap-2 text-xs ${theme === 'dark' ? 'bg-emerald-900/30 border-emerald-500/50 hover:bg-emerald-900/50' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`}>
          <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <div>
            <div className="font-bold opacity-90">Margin</div>
            <div className="font-mono">{dashboardData.profitMargin?.toFixed(1) || 0}%</div>
          </div>
        </div>
        
        <div className={`p-3 border rounded-lg flex items-center gap-2 text-xs ${theme === 'dark' ? 'bg-blue-900/30 border-blue-500/50 hover:bg-blue-900/50' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`}>
          <DollarSign className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div>
            <div className="font-bold opacity-90">Avg Sale</div>
            <div className="font-mono">₹{(dashboardData.avgSaleValue || 0)?.toLocaleString()}</div>
          </div>
        </div>
        
        <div className={`p-3 border rounded-lg flex items-center gap-2 text-xs ${theme === 'dark' ? 'bg-orange-900/30 border-orange-500/50 hover:bg-orange-900/50' : 'bg-orange-50 border-orange-200 hover:bg-orange-100'}`}>
          <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <div>
            <div className="font-bold opacity-90">Slow Stock</div>
            <div className="font-mono">{dashboardData.slowMovingBikes?.length || 0}</div>
          </div>
        </div>
        
        <div className={`p-3 border rounded-lg flex items-center gap-2 text-xs ${theme === 'dark' ? 'bg-indigo-900/30 border-indigo-500/50 hover:bg-indigo-900/50' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'}`}>
          <Users2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <div>
            <div className="font-bold opacity-90">New Customers</div>
            <div className="font-mono">{dashboardData.newCustomers || 0}</div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className={`p-4 rounded-lg border text-xs flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"/>
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
