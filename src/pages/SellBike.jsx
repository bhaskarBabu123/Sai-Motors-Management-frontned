import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Phone, MapPin, CreditCard, FileText, CheckCircle, AlertCircle, MessageCircle, Download, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const SellBike = () => {
  const { theme, bikes, customers, sellBike, fetchBikes, fetchCustomers } = useApp();
  const [selectedBike, setSelectedBike] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerAddress: '',
    sellingPrice: '',
    discount: '',
    paymentMode: 'Cash',
    notes: ''
  });

  useEffect(() => {
    fetchBikes({ status: 'available' });
    fetchCustomers();
  }, []);

  const paymentModes = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque'];

  const availableBikes = bikes.filter(bike => 
    bike.status === 'available' &&
    (bike.bikeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     bike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
     bike.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBikeSelect = (bike) => {
    setSelectedBike(bike);
    const suggestedPrice = Math.round(bike.buyPrice * 1.15);
    setFormData(prev => ({
      ...prev,
      sellingPrice: suggestedPrice.toString()
    }));
  };

  const calculateProfit = () => {
    if (!selectedBike || !formData.sellingPrice) return 0;
    return (parseFloat(formData.sellingPrice) || 0) - (parseFloat(formData.discount) || 0) - (selectedBike.buyPrice || 0);
  };

  const calculateProfitPercent = () => {
    if (!selectedBike || !selectedBike.buyPrice) return 0;
    const profit = calculateProfit();
    return ((profit / selectedBike.buyPrice) * 100).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBike) {
      toast.error('Please select a bike to sell');
      return;
    }

    setShowConfirm(true);
  };

  // Confirmation popup handler
  const confirmSale = async () => {
    const saleData = {
      bikeId: selectedBike._id,
      ...formData,
      sellingPrice: parseFloat(formData.sellingPrice),
      discount: parseFloat(formData.discount) || 0
    };

    const result = await sellBike(saleData);
    
    if (result.success) {
      setLastSale({
        id: result.data._id,
        saleNumber: result.data.saleNumber,
        invoiceNumber: result.data.invoiceNumber,
        invoicePath: result.data.invoicePath,
        bike: selectedBike,
        ...saleData,
        profit: calculateProfit(),
        profitPercent: calculateProfitPercent()
      });
      setShowConfirm(false);
      setShowSuccess(true);
      
      // Reset form
      setSelectedBike(null);
      setFormData({
        buyerName: '',
        buyerPhone: '',
        buyerAddress: '',
        sellingPrice: '',
        discount: '',
        paymentMode: 'Cash',
        notes: ''
      });
      setSearchTerm('');
      fetchBikes({ status: 'available' });
    }
  };

  // WhatsApp sharing
  const sendWhatsAppBill = async () => {
    if (!lastSale) return;
    
    setSendingWhatsApp(true);
    try {
      const baseUrl = window.location.origin;
      const invoiceUrl = `${baseUrl}/api/sales/invoice/${lastSale.id}`;
      
      const whatsappMessage = `🎉 *Sai Motors - Sale Invoice*

📋 *Invoice:* ${lastSale.invoiceNumber}
🆔 *Sale ID:* ${lastSale.saleNumber}

🚗 *Bike Details:*
• Brand/Model: ${lastSale.bike.brand} ${lastSale.bike.model}
• Reg No: ${lastSale.bike.bikeNumber}
• Year: ${lastSale.bike.year}
• Color: ${lastSale.bike.color}

👤 *Customer:*
• Name: ${lastSale.buyerName}
• Phone: ${lastSale.buyerPhone}
• Address: ${lastSale.buyerAddress}

💰 *Payment Details:*
• Selling Price: ₹${parseFloat(lastSale.sellingPrice).toLocaleString()}
• Discount: ₹${parseFloat(lastSale.discount).toLocaleString()}
• *Final Amount: ₹${parseFloat(lastSale.finalAmount).toLocaleString()}*
• Payment: ${lastSale.paymentMode}

✅ *Status: PAID*

📄 *Download Invoice:* ${invoiceUrl}

Thank you for choosing Sai Motors! 🏍️✨`;

      const whatsappUrl = `https://wa.me/${lastSale.buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('WhatsApp message ready!');
    } catch (error) {
      toast.error('Failed to prepare WhatsApp message');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  // Confirmation Modal
  const ConfirmModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`w-full max-w-sm mx-4 p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' : 'bg-white/95 border-gray-200 backdrop-blur-xl'
        }`}
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Confirm Sale
          </h3>
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Are you sure you want to complete this sale?
          </p>
          
          <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Final Amount</p>
              <p className="text-sm font-semibold text-emerald-600">
                ₹{((parseFloat(formData.sellingPrice) || 0) - (parseFloat(formData.discount) || 0)).toLocaleString()}
              </p>
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Profit</p>
              <p className={`text-sm font-semibold ${
                calculateProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {calculateProfit() >= 0 ? '+' : ''}₹{Math.abs(calculateProfit()).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              className={`flex-1 py-2.5 px-4 border rounded-xl text-xs font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={confirmSale}
              className="flex-1 py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-medium hover:bg-emerald-700 transition-colors"
            >
              Confirm Sale
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Success Modal
  const SuccessModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-md mx-4 p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' : 'bg-white/95 border-gray-200 backdrop-blur-xl'
        }`}
      >
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Sale Completed!
          </h3>
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Invoice {lastSale?.invoiceNumber} generated successfully
          </p>

          <div className={`space-y-3 mb-6 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bike</span>
              <span className="text-sm font-medium">{lastSale?.bike.bikeNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Amount</span>
              <span className="text-sm font-semibold text-emerald-600">
                ₹{parseFloat(lastSale?.finalAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Profit</span>
              <span className={`text-sm font-semibold ${
                lastSale?.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                ₹{parseFloat(lastSale?.profit || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={sendWhatsAppBill}
              disabled={sendingWhatsApp}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-emerald-500 rounded-xl text-sm font-medium transition-all ${
                sendingWhatsApp
                  ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600'
              }`}
            >
              {sendingWhatsApp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  Send WhatsApp Bill
                </>
              )}
            </button>
            <button
              onClick={() => setShowSuccess(false)}
              className={`w-full py-2.5 px-4 border rounded-xl text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Continue Selling
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 space-y-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-2 h-8 rounded-full ${theme === 'dark' ? 'bg-gradient-to-b from-blue-500 to-blue-600' : 'bg-gradient-to-b from-blue-500 to-blue-600'}`} />
          <div>
            <h1 className={`text-2xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Sell Bike
            </h1>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Complete sale transactions quickly
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bike Selection */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
          }`}>
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`} />
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Available Bikes
              </h3>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bike number, brand..."
                className={`w-full pl-9 pr-3 py-2 text-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-500' 
                    : 'bg-white/50 border-gray-200/50'
                }`}
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto -mx-1">
              {availableBikes.map((bike) => (
                <motion.div
                  key={bike._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleBikeSelect(bike)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:bg-blue-500/5 -mx-1 ${
                    selectedBike?._id === bike._id
                      ? 'border-blue-400 bg-blue-500/10'
                      : theme === 'dark'
                      ? 'border-gray-700/50 hover:border-gray-600/50 bg-gray-800/30'
                      : 'border-gray-200/50 hover:border-gray-300/50 bg-white/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {bike.bikeNumber}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {bike.brand} {bike.model}
                      </p>
                      <p className="text-xs text-emerald-500 font-medium">
                        ₹{bike.buyPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {availableBikes.length === 0 && (
                <div className={`p-8 text-center rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/30 text-gray-500' : 'bg-white/60 text-gray-500'
                }`}>
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No bikes found</p>
                </div>
              )}
            </div>
          </div>

          {/* Sale Form */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
          }`}>
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Sale Details
              </h3>
            </div>

            {selectedBike && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 border ${
                  theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full bg-blue-500`} />
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                    Selected Bike
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedBike.brand} {selectedBike.model}
                </p>
                <p className="text-xs text-emerald-500">{selectedBike.bikeNumber}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Buyer Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.buyerName}
                      onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                      required
                      className={`w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200/50 rounded-xl focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${
                        theme === 'dark' 
                          ? 'bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-500' 
                          : 'bg-white/50 border-gray-200/50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.buyerPhone}
                      onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})}
                      required
                      className={`w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200/50 rounded-xl focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${
                        theme === 'dark' 
                          ? 'bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-500' 
                          : 'bg-white/50 border-gray-200/50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                  <textarea
                    value={formData.buyerAddress}
                    onChange={(e) => setFormData({...formData, buyerAddress: e.target.value})}
                    required
                    rows="2"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200/50 rounded-xl focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none ${
                      theme === 'dark' 
                        ? 'bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-500' 
                        : 'bg-white/50 border-gray-200/50'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                    required
                    className={`w-full px-3 py-2.5 text-sm border border-gray-200/50 rounded-xl focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700/30 border-gray-600/50 text-white' 
                        : 'bg-white/50 border-gray-200/50'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className={`w-full px-3 py-2.5 text-sm border border-gray-200/50 rounded-xl focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700/30 border-gray-600/50 text-white' 
                        : 'bg-white/50 border-gray-200/50'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Payment Mode *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <select
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                      required
                      className={`w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200/50 rounded-xl focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none ${
                        theme === 'dark' 
                          ? 'bg-gray-700/30 border-gray-600/50 text-white' 
                          : 'bg-white/50 border-gray-200/50'
                      }`}
                    >
                      {paymentModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Profit Preview */}
              {selectedBike && formData.sellingPrice && (
                <div className={`p-4 rounded-xl border ${
                  calculateProfit() >= 0 
                    ? 'border-emerald-200/50 bg-emerald-500/5' 
                    : 'border-red-200/50 bg-red-500/5'
                }`}>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Final Amount</p>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ₹{((parseFloat(formData.sellingPrice) || 0) - (parseFloat(formData.discount) || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Profit</p>
                      <p className={`text-sm font-medium ${
                        calculateProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {calculateProfit() >= 0 ? '+' : ''}₹{Math.abs(calculateProfit()).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Profit %</p>
                      <p className={`text-sm font-medium ${
                        calculateProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {calculateProfitPercent()}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="2"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200/50 rounded-xl focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none ${
                      theme === 'dark' 
                        ? 'bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-500' 
                        : 'bg-white/50 border-gray-200/50'
                    }`}
                    placeholder="Optional notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBike(null);
                    setFormData({
                      buyerName: '',
                      buyerPhone: '',
                      buyerAddress: '',
                      sellingPrice: '',
                      discount: '',
                      paymentMode: 'Cash',
                      notes: ''
                    });
                  }}
                  className={`px-5 py-2.5 border rounded-xl text-xs font-medium transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-400 hover:bg-gray-700/50'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={!selectedBike || !formData.buyerName || !formData.buyerPhone || !formData.buyerAddress || !formData.sellingPrice}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Complete Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showConfirm && <ConfirmModal />}
      {showSuccess && <SuccessModal />}
    </div>
  );
};

export default SellBike;
