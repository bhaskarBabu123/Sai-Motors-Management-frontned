import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Palette, FileText, Store, 
  Save, Eye, EyeOff, Phone, Mail, MapPin, DollarSign, Percent, AlertCircle, 
  Clock, Download, AlertTriangle, BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme, toggleTheme } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [shopSettings, setShopSettings] = useState({
    shopName: 'SAI BIKES',
    address: '123 Main Street, City, State 12345',
    phone: '+91 9876543210',
    email: 'info@saibikes.com',
    invoicePrefix: 'SB',
    currency: '₹',
    taxRate: 18
  });

  const [systemSettings, setSystemSettings] = useState({
    defaultDashboardFilter: 'thisMonth',
    profitColorRanges: { low: 0, medium: 10000, high: 20000 },
    notifications: {
      lowStock: true,
      slowMoving: true,
      dailyReport: false,
      weeklyReport: true
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'shop', name: 'Shop', icon: Store },
    { id: 'system', name: 'System', icon: SettingsIcon },
    { id: 'notifications', name: 'Alerts', icon: Bell },
    { id: 'appearance', name: 'Theme', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Profile updated successfully');
  };

  const handleShopSettingsUpdate = async (e) => {
    e.preventDefault();
    toast.success('Shop settings updated successfully');
  };

  const handleSystemSettingsUpdate = async (e) => {
    e.preventDefault();
    toast.success('System settings updated successfully');
  };

  const TinyToggle = ({ checked, onChange, label, desc }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
    }`}>
      <div>
        <div className={`font-semibold text-[12px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {label}
        </div>
        <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {desc}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
      </label>
    </div>
  );

  const renderTabContent = () => {
    const inputClass = `w-full px-3 py-1.5 text-[12px] rounded-lg border focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all ${
      theme === 'dark' 
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`;

    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-blue-500" />
              <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Profile Information
              </h3>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <h4 className={`text-[13px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Change Password
                  </h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors border border-blue-600"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        );

      case 'shop':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Shop Information
              </h3>
            </div>
            <form onSubmit={handleShopSettingsUpdate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Store className="w-3 h-3" /> Shop Name
                  </label>
                  <input
                    type="text"
                    value={shopSettings.shopName}
                    onChange={(e) => setShopSettings({...shopSettings, shopName: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={shopSettings.phone}
                    onChange={(e) => setShopSettings({...shopSettings, phone: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={shopSettings.email}
                    onChange={(e) => setShopSettings({...shopSettings, email: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <DollarSign className="w-3 h-3" /> Invoice Prefix
                  </label>
                  <input
                    type="text"
                    value={shopSettings.invoicePrefix}
                    onChange={(e) => setShopSettings({...shopSettings, invoicePrefix: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <MapPin className="w-3 h-3" /> Address
                </label>
                <textarea
                  value={shopSettings.address}
                  onChange={(e) => setShopSettings({...shopSettings, address: e.target.value})}
                  rows="2"
                  className={`${inputClass} resize-vertical min-h-[70px]`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <DollarSign className="w-3 h-3" /> Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={shopSettings.currency}
                    onChange={(e) => setShopSettings({...shopSettings, currency: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Percent className="w-3 h-3" /> Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={shopSettings.taxRate}
                    onChange={(e) => setShopSettings({...shopSettings, taxRate: parseFloat(e.target.value)})}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors border border-blue-600"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon className="w-4 h-4 text-purple-500" />
              <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                System Configuration
              </h3>
            </div>
            <form onSubmit={handleSystemSettingsUpdate} className="space-y-4">
              <div>
                <label className={`flex items-center gap-2 text-[11px] font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <BarChart3 className="w-3 h-3" /> Default Dashboard Filter
                </label>
                <select
                  value={systemSettings.defaultDashboardFilter}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings, 
                    defaultDashboardFilter: e.target.value
                  })}
                  className={inputClass}
                >
                  <option value="today">Today</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisYear">This Year</option>
                </select>
              </div>

              <div>
                <h4 className={`text-[13px] font-semibold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <DollarSign className="w-4 h-4" /> Profit Color Ranges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border`}>
                    <label className={`block text-[10px] font-medium mb-2 text-red-500 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                      Low Profit (Below)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.profitColorRanges.low}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        profitColorRanges: {
                          ...systemSettings.profitColorRanges,
                          low: parseInt(e.target.value) || 0
                        }
                      })}
                      className={`${inputClass} text-center`}
                    />
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border`}>
                    <label className={`block text-[10px] font-medium mb-2 text-amber-500 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                      Medium Profit (Up to)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.profitColorRanges.medium}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        profitColorRanges: {
                          ...systemSettings.profitColorRanges,
                          medium: parseInt(e.target.value) || 0
                        }
                      })}
                      className={`${inputClass} text-center`}
                    />
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border`}>
                    <label className={`block text-[10px] font-medium mb-2 text-emerald-500 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      High Profit (Above)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.profitColorRanges.high}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        profitColorRanges: {
                          ...systemSettings.profitColorRanges,
                          high: parseInt(e.target.value) || 0
                        }
                      })}
                      className={`${inputClass} text-center`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors border border-blue-600"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-orange-500" />
              <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Notification Preferences
              </h3>
            </div>
            <div className="space-y-2">
              <TinyToggle
                checked={systemSettings.notifications.lowStock}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  notifications: {
                    ...systemSettings.notifications,
                    lowStock: e.target.checked
                  }
                })}
                label="Low Stock Alert"
                desc="Get notified when bike inventory is low"
              />
              <TinyToggle
                checked={systemSettings.notifications.slowMoving}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  notifications: {
                    ...systemSettings.notifications,
                    slowMoving: e.target.checked
                  }
                })}
                label="Slow Moving Items"
                desc="Alert for bikes in inventory over 30 days"
              />
              <TinyToggle
                checked={systemSettings.notifications.dailyReport}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  notifications: {
                    ...systemSettings.notifications,
                    dailyReport: e.target.checked
                  }
                })}
                label="Daily Sales Report"
                desc="Receive daily sales summary"
              />
              <TinyToggle
                checked={systemSettings.notifications.weeklyReport}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  notifications: {
                    ...systemSettings.notifications,
                    weeklyReport: e.target.checked
                  }
                })}
                label="Weekly Performance"
                desc="Receive weekly performance report"
              />
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-purple-500" />
              <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Appearance Settings
              </h3>
            </div>
            <TinyToggle
              checked={theme === 'dark'}
              onChange={toggleTheme}
              label="Dark Mode"
              desc="Toggle between light and dark theme"
            />
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-gray-500" />
              <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Security Settings
              </h3>
            </div>
            
            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`font-semibold mb-2 text-[13px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Account Security
              </div>
              <p className={`text-[11px] mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
              </p>
              <button className={`flex items-center gap-2 text-blue-600 hover:text-blue-700 text-[12px] font-semibold px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50/50 transition-all w-full`}>
                <FileText className="w-4 h-4" />
                View Login History
              </button>
            </div>

            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`font-semibold mb-2 text-[13px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Data Backup
              </div>
              <p className={`text-[11px] mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Last backup: Today at 3:00 AM
              </p>
              <button className={`flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-[12px] font-semibold px-4 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-50/50 transition-all w-full`}>
                <Download className="w-4 h-4" />
                Download Backup
              </button>
            </div>

            <div className={`p-4 rounded-lg border-2 ${theme === 'dark' ? 'bg-gray-800 border-red-600/50' : 'bg-gray-50 border-red-200'}`}>
              <div className={`font-semibold mb-2 text-[13px] flex items-center gap-2 text-red-600 ${theme === 'dark' ? 'text-red-400' : ''}`}>
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </div>
              <p className={`text-[11px] mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Permanently delete your account and all associated data.
              </p>
              <button className="flex items-center gap-2 w-full text-red-600 hover:text-red-700 text-[12px] font-semibold px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50/50 transition-all">
                <AlertCircle className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 ${theme === 'dark' ? 'bg-gray-900 min-h-screen' : 'bg-gradient-to-br from-gray-50 to-slate-50/50 min-h-screen'}`}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <SettingsIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h1>
            <p className={`text-[12px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account settings and system preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className={`lg:col-span-1 p-4 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all text-[12px] font-semibold border ${
                    activeTab === tab.id
                      ? theme === 'dark'
                        ? 'bg-blue-600/20 text-blue-200 border-blue-500'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                      : 'text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className={`lg:col-span-3 p-6 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
