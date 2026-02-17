import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Filter, Edit2, Trash2, Upload, Download, Eye, AlertTriangle, 
  ArrowUp, ArrowDown, User, Hash, Tag, Calendar, IndianRupee, Palette, Gauge, 
  Droplets, Activity, FileText, Zap, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { theme, bikes, addBike, updateBike, deleteBike, fetchBikes } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [bikesPerPage] = useState(20);

  const [formData, setFormData] = useState({
    bikeNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    buyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    color: '',
    mileage: '',
    engineCC: '',
    fuelType: 'Petrol',
    conditionRating: 8,
    notes: ''
  });

  useEffect(() => {
    loadBikes();
  }, [searchTerm, filterBrand, filterStatus, sortField, sortOrder, currentPage]);

  const brands = ['Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'KTM', 'Royal Enfield', 'Suzuki', 'Kawasaki'];
  const fuelTypes = ['Petrol', 'Electric', 'Diesel'];

  const loadBikes = async () => {
    const params = {
      page: currentPage,
      limit: bikesPerPage,
      sortBy: sortField,
      sortOrder: sortOrder
    };

    if (searchTerm) params.search = searchTerm;
    if (filterBrand) params.brand = filterBrand;
    if (filterStatus) params.status = filterStatus;

    await fetchBikes(params);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = showEditModal 
      ? await updateBike(selectedBike._id, formData)
      : await addBike(formData);
    
    if (result.success) {
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      loadBikes();
    }
  };

  const resetForm = () => {
    setFormData({
      bikeNumber: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      buyPrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      color: '',
      mileage: '',
      engineCC: '',
      fuelType: 'Petrol',
      conditionRating: 8,
      notes: ''
    });
    setSelectedBike(null);
  };

  const handleEdit = (bike) => {
    setSelectedBike(bike);
    setFormData({
      bikeNumber: bike.bikeNumber,
      brand: bike.brand,
      model: bike.model,
      year: bike.year,
      buyPrice: bike.buyPrice,
      purchaseDate: bike.purchaseDate?.split('T')[0] || '',
      color: bike.color || '',
      mileage: bike.mileage || '',
      engineCC: bike.engineCC || '',
      fuelType: bike.fuelType,
      conditionRating: bike.conditionRating,
      notes: bike.notes || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (bikeId, bikeName) => {
    if (window.confirm(`Delete ${bikeName}?`)) {
      const result = await deleteBike(bikeId);
      if (result.success) {
        loadBikes();
      }
    }
  };

  const getRowColorClass = (bike) => {
    if (bike.status === 'sold' && bike.profit !== undefined && bike.profit !== null) {
      if (bike.profit < 0) return 'bg-red-500/5 border-l-4 border-red-500';
      if (bike.profit >= 0 && bike.profit <= 10000) return 'bg-amber-500/5 border-l-4 border-amber-500';
      if (bike.profit > 10000) return 'bg-emerald-500/5 border-l-4 border-emerald-500';
    }
    return '';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 opacity-40" />;
    return sortOrder === 'asc' ? 
      <ArrowUp className="w-3 h-3" /> : 
      <ArrowDown className="w-3 h-3" />;
  };

  const inputClass = `w-full px-2.5 py-1.5 text-[11px] rounded border focus:ring-1 focus:ring-blue-400 transition-all ${
    theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const labelClass = `block text-[10px] font-semibold uppercase tracking-wider mb-1 ${
    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  }`;

  const BikeFormModal = ({ isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-lg border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" />
                <h2 className={`text-[13px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-gray-200/50 ${theme === 'dark' ? 'hover:bg-gray-700/50' : ''}`}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Hash className="w-3 h-3" /> Bike Number *
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.bikeNumber}
                    onChange={(e) => setFormData({...formData, bikeNumber: e.target.value.toUpperCase()})}
                    required
                    className={inputClass}
                    placeholder="AB01CD1234"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3" /> Brand *
                    </div>
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                    className={inputClass}
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3" /> Model *
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" /> Year *
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    required
                    min="1990"
                    max={new Date().getFullYear()}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <IndianRupee className="w-3 h-3" /> Buy Price *
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({...formData, buyPrice: parseFloat(e.target.value)})}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" /> Purchase Date *
                    </div>
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Palette className="w-3 h-3" /> Color
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Droplets className="w-3 h-3" /> Fuel Type
                    </div>
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                    className={inputClass}
                  >
                    {fuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Gauge className="w-3 h-3" /> Mileage
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: parseFloat(e.target.value)})}
                    className={inputClass}
                    placeholder="km/l"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="w-3 h-3" /> Engine CC
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.engineCC}
                    onChange={(e) => setFormData({...formData, engineCC: parseInt(e.target.value)})}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3" /> Condition (1-10)
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.conditionRating}
                    onChange={(e) => setFormData({...formData, conditionRating: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <div className="flex items-center gap-1 mb-1">
                    <FileText className="w-3 h-3" /> Notes
                  </div>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="2"
                  className={`${inputClass} resize-vertical`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-3 py-1.5 text-[11px] font-semibold rounded border transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-blue-600 text-white rounded border border-blue-600 hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showEditModal ? 'Update' : 'Add'} Bike</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className={`sm:p-6 space-y-4 ${theme === 'dark' ? 'bg-gray-900 min-h-screen' : 'bg-gradient-to-br from-gray-50 to-slate-50 min-h-screen'}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Inventory Management
            </h1>
          </div>
          <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage bikes, track sales & monitor inventory
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold bg-blue-600 text-white rounded-lg border border-blue-600 hover:bg-blue-700 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bike</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className={labelClass}>Search</label>
            <div className="relative">
              <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 ${theme === 'dark' ? 'text-gray-500' : ''}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bikes..."
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Brand</label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className={inputClass}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={inputClass}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterBrand('');
                setFilterStatus('');
                setCurrentPage(1);
              }}
              className={`w-full px-3 py-1.5 text-[11px] font-semibold rounded border transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
              }`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} sticky top-0`}>
              <tr>
                {[
                  { field: 'bikeNumber', label: 'Bike No', icon: Hash },
                  { field: 'brand', label: 'Brand/Model', icon: Tag },
                  { field: 'year', label: 'Year', icon: Calendar },
                  { field: 'buyPrice', label: 'Buy Price', icon: IndianRupee },
                  { field: 'sellPrice', label: 'Sell Price', icon: IndianRupee },
                  { field: 'profit', label: 'Profit', icon: Activity },
                  { field: 'status', label: 'Status', icon: Gauge },
                  { label: 'Actions' }
                ].map(({ field, label, icon: Icon }) => (
                  <th key={field || 'actions'} className="px-3 py-2 text-left">
                    {field ? (
                      <button
                        onClick={() => handleSort(field)}
                        className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-left w-full hover:text-blue-500 transition-colors ${
                          theme === 'dark' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
                        <span>{label}</span>
                        <SortIcon field={field} />
                      </button>
                    ) : (
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Actions
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bikes.map((bike, index) => (
                <motion.tr
                  key={bike._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`${getRowColorClass(bike)} hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all`}
                >
                  <td className="px-3 py-2.5">
                    <div className={`font-semibold text-[11px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {bike.bikeNumber}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {bike.brand}
                    </div>
                    <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {bike.model}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {bike.year}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[11px] font-semibold ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>
                      ₹{bike.buyPrice?.toLocaleString() || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {bike.sellPrice ? (
                      <span className={`text-[11px] font-semibold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        ₹{bike.sellPrice.toLocaleString()}
                      </span>
                    ) : (
                      <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {bike.profit !== null && bike.profit !== undefined ? (
                      <span className={`text-[11px] font-semibold ${
                        bike.profit >= 0 
                          ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                          : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        ₹{bike.profit.toLocaleString()}
                      </span>
                    ) : (
                      <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                      bike.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : bike.status === 'sold'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      {bike.status?.charAt(0).toUpperCase() + bike.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(bike)}
                        className={`p-1.5 rounded hover:bg-blue-500/10 transition-all ${
                          theme === 'dark' 
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20' 
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        } ${bike.status === 'sold' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={bike.status === 'sold'}
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bike._id, `${bike.brand} ${bike.model}`)}
                        className={`p-1.5 rounded hover:bg-red-500/10 transition-all ${
                          theme === 'dark' 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        } ${bike.status === 'sold' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={bike.status === 'sold'}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {bikes.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className={`mx-auto w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-[12px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              No bikes found
            </h3>
            <p className={`mt-1 text-[11px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Adjust filters or add new bikes to get started
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <BikeFormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Bike"
      />

      <BikeFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Bike"
      />
    </div>
  );
};

export default Inventory;
