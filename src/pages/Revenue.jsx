import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar, 
  IndianRupee, 
  Tag, 
  TrendingUp, 
  Edit2, 
  Trash2,
  X,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Revenue = () => {
  const { theme } = useApp();
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState(null);

  const [revenueForm, setRevenueForm] = useState({
    title: '',
    source: 'Other',
    amount: '',
    revenueDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    description: '',
    customerName: '',
    customerContact: ''
  });

  const sources = [
    'Bike Sales', 
    'Service', 
    'Parts', 
    'Accessories', 
    'Insurance Commission', 
    'Finance Commission', 
    'Other'
  ];
  
  const paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque'];

  useEffect(() => {
    fetchRevenues();
  }, [searchTerm, filterSource]);

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterSource) params.append('source', filterSource);

      const response = await fetch(`https://sai-motors-management-backend.onrender.com/api/revenue?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRevenues(data.revenues || []);
      }
    } catch (error) {
      console.error('Fetch revenues error:', error);
      toast.error('Failed to fetch revenues');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingRevenue ? `https://sai-motors-management-backend.onrender.com/api/revenue/${editingRevenue._id}` : 'https://sai-motors-management-backend.onrender.com/api/revenue';
      const method = editingRevenue ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(revenueForm)
      });

      if (response.ok) {
        toast.success(`Revenue ${editingRevenue ? 'updated' : 'added'} successfully`);
        setShowModal(false);
        resetForm();
        fetchRevenues();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save revenue');
      }
    } catch (error) {
      console.error('Save revenue error:', error);
      toast.error('Failed to save revenue');
    }
  };

  const handleEdit = (revenue) => {
    setEditingRevenue(revenue);
    setRevenueForm({
      title: revenue.title,
      source: revenue.source,
      amount: revenue.amount.toString(),
      revenueDate: revenue.revenueDate.split('T')[0],
      paymentMethod: revenue.paymentMethod,
      description: revenue.description || '',
      customerName: revenue.customerName || '',
      customerContact: revenue.customerContact || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (revenueId, revenueTitle) => {
    if (window.confirm(`Are you sure you want to delete "${revenueTitle}"?`)) {
      try {
        const response = await fetch(`https://sai-motors-management-backend.onrender.com/api/revenue/${revenueId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Revenue deleted successfully');
          fetchRevenues();
        } else {
          toast.error('Failed to delete revenue');
        }
      } catch (error) {
        console.error('Delete revenue error:', error);
        toast.error('Failed to delete revenue');
      }
    }
  };

  const resetForm = () => {
    setRevenueForm({
      title: '',
      source: 'Other',
      amount: '',
      revenueDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      description: '',
      customerName: '',
      customerContact: ''
    });
    setEditingRevenue(null);
  };

  const getSourceColor = (source) => {
    const colors = {
      'Bike Sales': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Service': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Parts': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Accessories': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Insurance Commission': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Finance Commission': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'Other': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[source] || colors['Other'];
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-xl shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className={`text-gray-400 hover:text-gray-600 ${
                  theme === 'dark' ? 'hover:text-gray-300' : ''
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Revenue Management
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Track and manage business revenue, categorize income sources, and monitor earnings.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Revenue</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Search Revenue
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, customer..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Filter by Source
            </label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSource('');
              }}
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {revenues.map((revenue, index) => (
          <motion.div
            key={revenue._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {revenue.title}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    getSourceColor(revenue.source)
                  }`}>
                    {revenue.source}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Amount:
                </span>
                <span className="text-lg font-bold text-green-600">
                  ₹{revenue.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Date:
                </span>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(revenue.revenueDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Payment:
                </span>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {revenue.paymentMethod}
                </span>
              </div>

              {revenue.customerName && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Customer:
                  </span>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {revenue.customerName}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Status:
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  revenue.status === 'confirmed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : revenue.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {revenue.status.charAt(0).toUpperCase() + revenue.status.slice(1)}
                </span>
              </div>
            </div>

            {revenue.description && (
              <div className="mb-4">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {revenue.description}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Added by {revenue.addedBy?.name}
              </span>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(revenue)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(revenue._id, revenue.title)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {revenues.length === 0 && !loading && (
        <div className="text-center py-12">
          <TrendingUp className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
            No revenue entries found
          </h3>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Start tracking your business revenue by adding your first revenue entry.
          </p>
        </div>
      )}

      {/* Add/Edit Revenue Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingRevenue ? 'Edit Revenue' : 'Add New Revenue'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Revenue Title *
              </label>
              <input
                type="text"
                value={revenueForm.title}
                onChange={(e) => setRevenueForm({...revenueForm, title: e.target.value})}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Revenue Source *
              </label>
              <select
                value={revenueForm.source}
                onChange={(e) => setRevenueForm({...revenueForm, source: e.target.value})}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Amount (₹) *
              </label>
              <input
                type="number"
                value={revenueForm.amount}
                onChange={(e) => setRevenueForm({...revenueForm, amount: e.target.value})}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Revenue Date *
              </label>
              <input
                type="date"
                value={revenueForm.revenueDate}
                onChange={(e) => setRevenueForm({...revenueForm, revenueDate: e.target.value})}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Payment Method *
              </label>
              <select
                value={revenueForm.paymentMethod}
                onChange={(e) => setRevenueForm({...revenueForm, paymentMethod: e.target.value})}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Customer Name
              </label>
              <input
                type="text"
                value={revenueForm.customerName}
                onChange={(e) => setRevenueForm({...revenueForm, customerName: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Customer Contact
              </label>
              <input
                type="text"
                value={revenueForm.customerContact}
                onChange={(e) => setRevenueForm({...revenueForm, customerContact: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={revenueForm.description}
              onChange={(e) => setRevenueForm({...revenueForm, description: e.target.value})}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingRevenue ? 'Update Revenue' : 'Add Revenue'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Revenue;