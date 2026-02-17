import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Package, ShoppingCart, Users, 
  FileText, BarChart3, Search, Settings, LogOut,
  Sun, Moon, Bell, User, Plus,  CreditCard,
  Building,
  TrendingDown,
  TrendingUp,
  RefreshCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLocation, Link } from 'react-router-dom';
import logo from './sai_motors_logo.jpeg'
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

   const handlePageReload = () => {
      toast('Reloading page...', { duration: 1000 });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };
  const navigation = [
    { name: 'DASHBOARD', href: '/', icon: Home },
    { name: 'INVENTORY', href: '/inventory', icon: Package },
    { name: 'SELL BIKE', href: '/sell', icon: ShoppingCart },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Finance', href: '/finance', icon: Building },
    { name: 'Expenses', href: '/expenses', icon: TrendingDown },
    { name: 'Revenue', href: '/revenue', icon: TrendingUp },
    { name: 'CUSTOMERS', href: '/customers', icon: Users },
    { name: 'REPORTS', href: '/reports', icon: FileText },
    { name: 'ANALYTICS', href: '/analytics', icon: BarChart3 },
    { name: 'AVAILABILITY', href: '/availability', icon: Search },
    { name: 'SETTINGS', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden font-sans antialiased text-black">
      
      {/* SIDEBAR - Obsidian Black */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex-shrink-0 flex items-center px-8 border-b border-white/10">
          <div className="tracking-[0.3em] font-light text-xs">
           <div className="bg-whitw">
            <img src={logo} alt="sai motors logo katapur" className='bg-white rounded-md' width={120}  />
           </div>
          </div>
        </div>

        {/* Nav - Tiny Font Style */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 mb-4 text-[10px] text-gray-500 tracking-[0.2em] font-bold">MENU</div>
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-sm transition-all duration-150 ${
                  active 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 mr-3 ${active ? 'text-black' : 'text-gray-500'}`} />
                <span className="text-[11px] font-bold tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-3 truncate">
              <p className="text-[11px] font-bold tracking-tight">{user?.name || 'ADMIN'}</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Authorized</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 border border-white/20 text-[10px] font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            <LogOut className="w-3 h-3" />
            <span>LOGOUT</span>
          </button>
        </div>
      </motion.aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F9FAFB]">
        
        {/* Header - Sharp White */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center">
            <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </button>
            <div className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">
              Section / <span className="text-black font-bold">
                {navigation.find(item => item.href === location.pathname)?.name || 'DASHBOARD'}
              </span>
            </div>
          </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handlePageReload}
                          className={` py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                             theme === 'dark'
                                ? 'bg-white hover:bg-gray-600 border border-gray-600/50 text-black'
                                : 'bg-black hover:bg-gray-200 border border-gray-300/50 text-white'
                          }`}
                        >
                          <RefreshCcw className="w-3.5 h-3.5" />
                        </motion.button>
        </header>

        {/* SCROLLABLE AREA */}
        <main className="flex-1 overflow-y-auto p-5">
          <div className="max-w-6xl mx-auto">
            {/* Context Header for children */}
            

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;