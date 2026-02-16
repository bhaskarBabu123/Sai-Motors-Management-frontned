import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Users, Search, Plus, Edit2, Trash2, Eye, Phone, Mail, MapPin, 
  Calendar, DollarSign, ShoppingBag, Filter, ChevronDown, Download,
  Star, Award, Zap, BarChart3, X, Copy, Printer, MoreHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Customers = () => {
  const { theme, customers, addCustomer, updateCustomer, deleteCustomer, fetchCustomers } = useApp();
  
  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('totalSpent');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [customersPerPage] = useState(12);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', dateOfBirth: '',
    occupation: '', notes: '', customerType: 'Regular', loyaltyPoints: 0
  });

  const [customerModalTab, setCustomerModalTab] = useState('details'); // details, edit, activity

  const customerTypes = ['Regular', 'Premium', 'VIP', 'Gold'];

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filtered & Sorted Customers
  const filteredCustomers = useMemo(() => {
    let result = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm) ||
                           (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || customer.customerType === filterType;
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      let aVal = a[sortField] || 0;
      let bVal = b[sortField] || 0;
      
      if (sortField === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [customers, searchTerm, filterType, sortField, sortOrder]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = currentPage * customersPerPage;
    return filteredCustomers.slice(startIndex, startIndex + customersPerPage);
  }, [filteredCustomers, currentPage, customersPerPage]);

  // Handlers
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const result = selectedCustomer
        ? await updateCustomer(selectedCustomer._id, formData)
        : await addCustomer(formData);
      
      if (result.success) {
        toast.success(selectedCustomer ? 'Customer updated!' : 'Customer added!');
        setShowAddModal(false);
        setShowCustomerModal(false);
        resetForm();
        fetchCustomers();
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  }, [selectedCustomer, formData, addCustomer, updateCustomer, fetchCustomers]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '', phone: '', email: '', address: '', dateOfBirth: '',
      occupation: '', notes: '', customerType: 'Regular', loyaltyPoints: 0
    });
    setSelectedCustomer(null);
    setCustomerModalTab('details');
  }, []);

  const handleCustomerAction = useCallback((customer, action) => {
    setSelectedCustomer(customer);
    if (action === 'edit') {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address,
        dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : '',
        occupation: customer.occupation || '',
        notes: customer.notes || '',
        customerType: customer.customerType || 'Regular',
        loyaltyPoints: customer.loyaltyPoints || 0
      });
      setCustomerModalTab('edit');
    } else {
      setCustomerModalTab('details');
    }
    setShowCustomerModal(true);
  }, []);

  const handleDelete = async (customerId, customerName) => {
    if (window.confirm(`Delete ${customerName}?`)) {
      try {
        await deleteCustomer(customerId);
        toast.success('Customer deleted!');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getCustomerTypeConfig = (type) => {
    const configs = {
      'VIP': { bg: 'bg-gradient-to-r from-purple-400/80 to-pink-400/80', text: 'text-purple-900 font-bold', icon: Star },
      'Gold': { bg: 'bg-gradient-to-r from-yellow-400/80 to-orange-400/80', text: 'text-yellow-900 font-bold', icon: Award },
      'Premium': { bg: 'bg-gradient-to-r from-blue-400/80 to-indigo-400/80', text: 'text-blue-900 font-bold', icon: Zap },
      'Regular': { bg: 'bg-neutral-100/50 dark:bg-neutral-800/50', text: 'text-neutral-800 dark:text-neutral-200', icon: Users }
    };
    return configs[type] || configs.Regular;
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN');

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const canPrevPage = currentPage > 0;
  const canNextPage = currentPage < totalPages - 1;

  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-neutral-900'} min-h-screen text-xs`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users size={12} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Customer Directory</h1>
                <p className="text-[10px] opacity-60 font-mono uppercase tracking-wider">CRM Management</p>
              </div>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1 text-xs border border-emerald-400/50 transition-all"
            >
              <Plus size={12} />
              <span>Add Customer</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Search & Filters */}
        <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-3 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-end">
            <div className="relative">
              <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, phone, email..."
                className="w-full pl-7 pr-2 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 bg-white/50 dark:bg-neutral-900/50 transition-all text-[11px] font-medium"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 bg-white/50 dark:bg-neutral-900/50 text-[11px]"
              >
                <option value="all">All Types</option>
                {customerTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 bg-white/50 dark:bg-neutral-900/50 text-[11px]"
              >
                <option value="totalSpent">Total Spent</option>
                <option value="name">Name</option>
                <option value="totalBikesBought">Bikes</option>
                <option value="loyaltyPoints">Points</option>
              </select>
            </div>
            
            <div className="flex gap-1 lg:justify-end">
              <button className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white/50 dark:bg-neutral-900/50 transition-all">
                <Download size={10} />
              </button>
              <button 
                onClick={() => {
                  setSearchTerm(''); setFilterType('all'); setSortField('totalSpent'); setSortOrder('desc');
                }}
                className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white/50 dark:bg-neutral-900/50 text-[11px] font-medium transition-all flex items-center gap-1"
              >
                <Filter size={10} />
                Reset
              </button>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-between text-[10px] opacity-60 font-mono uppercase tracking-wider">
            <span>{filteredCustomers.length} of {customers.length} customers</span>
            <span>Page {currentPage + 1}/{totalPages}</span>
          </div>
        </div>

        {/* MOBILE: Cards */}
        <div className="lg:hidden grid grid-cols-1 gap-3 mb-6">
          {paginatedCustomers.map((customer, index) => {
            const typeConfig = getCustomerTypeConfig(customer.customerType);
            return (
              <motion.div
                key={customer._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group cursor-pointer"
                onClick={() => handleCustomerAction(customer, 'view')}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] ${typeConfig.bg} ${typeConfig.text}`}>
                      <typeConfig.icon size={10} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[12px] leading-tight">{customer.name}</h3>
                      <div className={`text-[9px] px-1.5 py-0.5 rounded-full mt-[2px] inline-block ${typeConfig.bg} ${typeConfig.text}`}>
                        {customer.customerType}
                      </div>
                    </div>
                  </div>
                  <MoreHorizontal size={12} className="opacity-50 group-hover:opacity-80 transition-all" />
                </div>

                <div className="space-y-1 mb-3 text-[10px] opacity-80">
                  <div className="flex items-center gap-1">
                    <Phone size={9} />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-1 truncate">
                      <Mail size={9} />
                      <span>{customer.email}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 border rounded-xl">
                    <div className="text-emerald-600 font-bold text-[12px]">
                      ₹{formatCurrency(customer.totalSpent)}
                    </div>
                    <div className="text-[9px] opacity-60 uppercase tracking-wider font-mono">Spent</div>
                  </div>
                  <div className="text-center p-2 border rounded-xl">
                    <div className="text-blue-600 font-bold text-[12px]">
                      {customer.totalBikesBought}
                    </div>
                    <div className="text-[9px] opacity-60 uppercase tracking-wider font-mono">Bikes</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50 text-[10px]">
                  <div className="flex items-center gap-1 opacity-60">
                    <Star size={9} className="fill-yellow-400 text-yellow-500" />
                    <span>{customer.loyaltyPoints} pts</span>
                  </div>
                  <div className="flex gap-1">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => {e.stopPropagation(); handleCustomerAction(customer, 'view')}} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View">
                      <Eye size={10} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => {e.stopPropagation(); handleCustomerAction(customer, 'edit')}} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Edit">
                      <Edit2 size={10} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => {e.stopPropagation(); handleDelete(customer._id, customer.name)}} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <Trash2 size={10} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* DESKTOP: Data Table */}
        <div className="hidden lg:block">
          <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead className="bg-neutral-50/50 dark:bg-neutral-800/50">
                  <tr>
                    {[
                      { label: 'Customer', width: 'w-56' },
                      { label: 'Contact', width: 'w-72' },
                      { label: 'Stats', width: 'w-40' },
                      { label: 'Type', width: 'w-24' },
                      { label: 'Last Buy', width: 'w-32' },
                      { label: 'Points', width: 'w-20' },
                      { label: '', width: 'w-28' }
                    ].map((header, i) => (
                      <th key={i} className={`${header.width} px-3 py-2.5 text-left font-semibold uppercase tracking-wider text-[10px] opacity-60 border-b border-neutral-200/50 dark:border-neutral-700/50`}>
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100/50 dark:divide-neutral-800/50">
                  {paginatedCustomers.map((customer) => {
                    const typeConfig = getCustomerTypeConfig(customer.customerType);
                    return (
                      <tr 
                        key={customer._id} 
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                        onClick={() => handleCustomerAction(customer, 'view')}
                      >
                        <td className="px-3 py-2.5">
                          <div className="font-semibold text-[12px] leading-tight">{customer.name}</div>
                          <div className="text-[10px] opacity-50 font-mono uppercase tracking-wider">{customer.occupation || 'N/A'}</div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1 mb-1 text-[10px]">
                            <Phone size={9} className="flex-shrink-0" />
                            <span className="font-mono truncate">{customer.phone}</span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1 text-[10px]">
                              <Mail size={9} className="flex-shrink-0" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="font-mono font-bold text-emerald-600 text-[11px]">
                            ₹{formatCurrency(customer.totalSpent)}
                          </div>
                          <div className="text-[10px] opacity-50">{customer.totalBikesBought} bikes</div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-[2px] ${typeConfig.bg} ${typeConfig.text}`}>
                            <typeConfig.icon size={9} />
                            {customer.customerType}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[10px] opacity-60">
                          {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : '-'}
                        </td>
                        <td className="px-3 py-2.5 text-[11px]">
                          <div className="flex items-center gap-[2px]">
                            <Star size={9} className="fill-yellow-400 text-yellow-500" />
                            <span className="font-mono font-semibold">{customer.loyaltyPoints}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex gap-1">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => {e.stopPropagation(); handleCustomerAction(customer, 'view')}} className="p-1.5 hover:bg-blue-50 rounded-lg group hover:text-blue-600 transition-all" title="View">
                              <Eye size={10} />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => {e.stopPropagation(); handleCustomerAction(customer, 'edit')}} className="p-1.5 hover:bg-emerald-50 rounded-lg group hover:text-emerald-600 transition-all" title="Edit">
                              <Edit2 size={10} />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => {e.stopPropagation(); handleDelete(customer._id, customer.name)}} className="p-1.5 hover:bg-red-50 rounded-lg group hover:text-red-600 transition-all" title="Delete">
                              <Trash2 size={10} />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-200/50 dark:border-neutral-700/50">
                <div className="flex items-center justify-between px-3 py-2.5 text-[11px]">
                  <div className="opacity-60 text-[10px]">
                    Showing {currentPage * customersPerPage + 1}-{Math.min((currentPage + 1) * customersPerPage, filteredCustomers.length)} of {filteredCustomers.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={!canPrevPage}
                      className="p-1.5 text-[10px] rounded-lg border border-neutral-300 dark:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all px-2 py-1"
                    >
                      Prev
                    </motion.button>
                    <span className="px-2 font-mono font-semibold text-[11px]">{currentPage + 1}/{totalPages}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={!canNextPage}
                      className="p-1.5 text-[10px] rounded-lg border border-neutral-300 dark:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all px-2 py-1"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 border-2 border-dashed border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl bg-white/50 dark:bg-neutral-800/50"
          >
            <Users size={32} className="mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-bold mb-1 opacity-75 text-[14px]">No customers</h3>
            <p className="text-[11px] opacity-60 mb-6">Add your first customer to get started</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2.5 rounded-xl text-[12px] font-semibold border border-emerald-400/50 transition-all flex items-center gap-1 mx-auto"
            >
              <Plus size={12} />
              Add First Customer
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* SINGLE CUSTOMER POPUP MODAL - ALL FEATURES */}
      <CustomerPopupModal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          resetForm();
        }}
        customer={selectedCustomer}
        formData={formData}
        setFormData={setFormData}
        customerTypes={customerTypes}
        customerModalTab={customerModalTab}
        setCustomerModalTab={setCustomerModalTab}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        copyToClipboard={copyToClipboard}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        theme={theme}
      />

      {/* ADD NEW CUSTOMER MODAL */}
      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        customerTypes={customerTypes}
        onSubmit={handleSubmit}
        theme={theme}
      />
    </div>
  );
};

// MAIN CUSTOMER POPUP MODAL - ALL IN ONE
const CustomerPopupModal = ({ 
  isOpen, 
  onClose, 
  customer, 
  formData, 
  setFormData, 
  customerTypes, 
  customerModalTab, 
  setCustomerModalTab,
  onSubmit,
  onDelete,
  copyToClipboard,
  formatCurrency,
  formatDate,
  theme 
}) => {
  if (!customer) return null;

  const typeConfig = getCustomerTypeConfig(customer.customerType);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-4xl max-h-[95vh] overflow-hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50"
            onClick={e => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-700/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${typeConfig.bg} ${typeConfig.text}`}>
                    <typeConfig.icon size={16} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold leading-tight">{customer.name}</h2>
                    <div className={`text-sm px-3 py-1 rounded-full inline-flex items-center gap-1 ${typeConfig.bg} ${typeConfig.text} font-semibold`}>
                      <typeConfig.icon size={12} />
                      {customer.customerType}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => copyToClipboard(customer.phone)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all"
                    title="Copy Phone"
                  >
                    <Copy size={14} />
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all"
                    title="Print"
                  >
                    <Printer size={14} />
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    onClick={onClose} 
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* TABS */}
              <div className="flex border-b border-neutral-200/50 dark:border-neutral-700/50 mt-4">
                {[
                  { id: 'details', label: 'Details', icon: User },
                  { id: 'edit', label: 'Edit', icon: Edit2 },
                  { id: 'activity', label: 'Activity', icon: BarChart3 }
                ].map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCustomerModalTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 text-[12px] font-semibold transition-all border-b-2 ${
                      customerModalTab === id
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                        : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-200px)] p-6 space-y-6 text-[11px]">
              {/* DETAILS TAB */}
              {customerModalTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CONTACT INFO */}
                  <div>
                    <h3 className="text-[13px] font-semibold mb-4 flex items-center gap-2 opacity-80">
                      <Phone size={14} />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-neutral-50/50 dark:bg-neutral-800/50 rounded-2xl border-l-4 border-blue-300/50 dark:border-blue-600/50">
                        <Phone size={16} className="text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="font-mono font-semibold text-[12px]">{customer.phone}</p>
                          <p className="text-[10px] opacity-60 uppercase tracking-wider font-mono">Primary Phone</p>
                        </div>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-3 p-4 bg-neutral-50/50 dark:bg-neutral-800/50 rounded-2xl border-l-4 border-emerald-300/50 dark:border-emerald-600/50">
                          <Mail size={16} className="text-emerald-500 flex-shrink-0" />
                          <div>
                            <p className="font-mono text-[12px]">{customer.email}</p>
                            <p className="text-[10px] opacity-60 uppercase tracking-wider font-mono">Email</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STATS */}
                  <div>
                    <h3 className="text-[13px] font-semibold mb-4 flex items-center gap-2 opacity-80">
                      <DollarSign size={14} />
                      Purchase Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl border border-emerald-200/50">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                          ₹{formatCurrency(customer.totalSpent)}
                        </div>
                        <div className="text-[10px] opacity-60 uppercase tracking-wider font-mono">Total Spent</div>
                      </div>
                      <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl border border-blue-200/50">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {customer.totalBikesBought}
                        </div>
                        <div className="text-[10px] opacity-60 uppercase tracking-wider font-mono">Bikes Bought</div>
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS & OTHER INFO */}
                  <div className="lg:col-span-2">
                    <h3 className="text-[13px] font-semibold mb-4 flex items-center gap-2 opacity-80">
                      <MapPin size={14} />
                      Address & Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200/50">
                        <div className="font-semibold text-[12px] mb-1 flex items-center gap-2">
                          <MapPin size={14} className="text-indigo-500" />
                          Address
                        </div>
                        <p className="text-[11px] leading-relaxed">{customer.address}</p>
                      </div>
                      {customer.occupation && (
                        <div className="p-4 bg-orange-50/50 dark:bg-orange-900/20 rounded-2xl border border-orange-200/50">
                          <div className="font-semibold text-[12px] mb-1 flex items-center gap-2">
                            <Users size={14} className="text-orange-500" />
                            Occupation
                          </div>
                          <p className="font-semibold text-[11px]">{customer.occupation}</p>
                        </div>
                      )}
                      {customer.notes && (
                        <div className="lg:col-span-2 p-4 bg-rose-50/50 dark:bg-rose-900/20 rounded-2xl border border-rose-200/50">
                          <div className="font-semibold text-[12px] mb-2 flex items-center gap-2">
                            <BarChart3 size={14} className="text-rose-500" />
                            Notes
                          </div>
                          <p className="text-[11px] leading-relaxed whitespace-pre-wrap">{customer.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTIVITY SUMMARY */}
                  <div className="lg:col-span-2">
                    <h3 className="text-[13px] font-semibold mb-4 flex items-center gap-2 opacity-80">
                      <Star size={14} />
                      Loyalty & Timeline
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-yellow-500 mb-[2px]">
                          {customer.loyaltyPoints}
                        </div>
                        <div className="text-[10px] opacity-60 uppercase tracking-wider font-mono flex items-center justify-center gap-1">
                          <Star size={10} className="fill-yellow-400 text-yellow-500" />
                          Points
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600 mb-[2px]">
                          {formatDate(customer.createdAt)}
                        </div>
                        <div className="text-[10px] opacity-60 uppercase tracking-wider font-mono">Member Since</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emerald-600 mb-[2px]">
                          {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : '-'}
                        </div>
                        <div className="text-[10px] opacity-60 uppercase tracking-wider font-mono">Last Purchase</div>
                      </div>
                      <div>
                        <div className="text-[10px] opacity-60 uppercase tracking-wider font-mono">Total Orders</div>
                        <div className="text-lg font-bold text-purple-600">12</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT TAB */}
              {customerModalTab === 'edit' && (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Phone *</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Customer Type</label>
                      <select
                        value={formData.customerType}
                        onChange={(e) => setFormData({...formData, customerType: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]"
                      >
                        {customerTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Occupation</label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Address *</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-green-400 focus:ring-1 focus:ring-green-400/20 transition-all font-medium text-[11px] resize-vertical bg-white/50 dark:bg-neutral-900/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Notes</label>
                    <textarea
                      rows="3"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 transition-all font-medium text-[11px] resize-vertical bg-white/50 dark:bg-neutral-900/50"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setCustomerModalTab('details')}
                      className="flex-1 px-6 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-200 font-semibold text-[12px] transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => onDelete(customer._id, customer.name)}
                      className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold text-[12px] border border-red-400/50 transition-all flex items-center gap-2 justify-center"
                    >
                      <Trash2 size={14} />
                      Delete Customer
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold text-[12px] border border-blue-400/50 transition-all"
                    >
                      Update Customer
                    </motion.button>
                  </div>
                </form>
              )}

              {/* ACTIVITY TAB */}
              {customerModalTab === 'activity' && (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200/50 text-center">
                    <BarChart3 size={32} className="mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-bold mb-2">Activity Feed Coming Soon</h3>
                    <p className="text-[11px] opacity-60">Purchase history, order timeline, and engagement metrics will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ADD NEW CUSTOMER MODAL
const AddCustomerModal = ({ isOpen, onClose, formData, setFormData, customerTypes, onSubmit, theme }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur rounded-t-2xl border-b border-neutral-200/50 dark:border-neutral-700/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add New Customer</h2>
                <p className="text-[11px] opacity-60 font-mono uppercase tracking-wider mt-1">Create customer profile</p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all">
                <X size={16} />
              </motion.button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            {/* Same form fields as edit modal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Name *</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-70 font-mono mb-1">Phone *</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all bg-white/50 dark:bg-neutral-900/50 font-medium text-[11px]" />
              </div>
              {/* ... rest of form fields same as edit ... */}
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
              <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={onClose} className="flex-1 px-6 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-200 font-semibold text-[12px] transition-all">
                Cancel
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} type="submit" className="flex-1 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold text-[12px] border border-emerald-400/50 transition-all">
                Add Customer
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const getCustomerTypeConfig = (type) => {
  const configs = {
    'VIP': { bg: 'bg-gradient-to-r from-purple-400/80 to-pink-400/80', text: 'text-purple-900 font-bold', icon: Star },
    'Gold': { bg: 'bg-gradient-to-r from-yellow-400/80 to-orange-400/80', text: 'text-yellow-900 font-bold', icon: Award },
    'Premium': { bg: 'bg-gradient-to-r from-blue-400/80 to-indigo-400/80', text: 'text-blue-900 font-bold', icon: Zap },
    'Regular': { bg: 'bg-neutral-100/50 dark:bg-neutral-800/50', text: 'text-neutral-800 dark:text-neutral-200', icon: Users }
  };
  return configs[type] || configs.Regular;
};

export default Customers;
