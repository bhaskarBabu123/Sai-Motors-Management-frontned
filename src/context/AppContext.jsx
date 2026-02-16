import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [dashboardFilter, setDashboardFilter] = useState('thisMonth');
  const [bikes, setBikes] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    fetchDashboardData();
  }, [dashboardFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://sai-motors-management-backend.onrender.com/api/dashboard?filter=${dashboardFilter}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard data error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBikes = async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`https://sai-motors-management-backend.onrender.com/api/bikes${queryString ? `?${queryString}` : ''}`);
      setBikes(response.data.bikes || response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch bikes error:', error);
      toast.error('Failed to fetch bikes');
      return { bikes: [] };
    }
  };

  const fetchSales = async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`https://sai-motors-management-backend.onrender.com/api/sales${queryString ? `?${queryString}` : ''}`);
      setSales(response.data.sales || response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch sales error:', error);
      toast.error('Failed to fetch sales');
      return { sales: [] };
    }
  };

  const fetchCustomers = async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`https://sai-motors-management-backend.onrender.com/api/customers${queryString ? `?${queryString}` : ''}`);
      setCustomers(response.data.customers || response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch customers error:', error);
      toast.error('Failed to fetch customers');
      return { customers: [] };
    }
  };

  const addBike = async (bikeData) => {
    try {
      const response = await axios.post('https://sai-motors-management-backend.onrender.com/api/bikes', bikeData);
      setBikes(prevBikes => [...prevBikes, response.data]);
      toast.success('Bike added successfully');
      fetchDashboardData(); // Refresh dashboard
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Add bike error:', error);
      const message = error.response?.data?.message || 'Failed to add bike';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateBike = async (id, bikeData) => {
    try {
      const response = await axios.put(`https://sai-motors-management-backend.onrender.com/api/bikes/${id}`, bikeData);
      setBikes(prevBikes => 
        prevBikes.map(bike => bike._id === id ? response.data : bike)
      );
      toast.success('Bike updated successfully');
      fetchDashboardData(); // Refresh dashboard
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update bike error:', error);
      const message = error.response?.data?.message || 'Failed to update bike';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteBike = async (id) => {
    try {
      await axios.delete(`https://sai-motors-management-backend.onrender.com/api/bikes/${id}`);
      setBikes(prevBikes => prevBikes.filter(bike => bike._id !== id));
      toast.success('Bike deleted successfully');
      fetchDashboardData(); // Refresh dashboard
      return { success: true };
    } catch (error) {
      console.error('Delete bike error:', error);
      const message = error.response?.data?.message || 'Failed to delete bike';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const sellBike = async (saleData) => {
    try {
      const response = await axios.post('https://sai-motors-management-backend.onrender.com/api/sales', saleData);
      toast.success('Bike sold successfully');
      
      // Refresh data
      fetchBikes();
      fetchDashboardData();
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Sell bike error:', error);
      const message = error.response?.data?.message || 'Failed to sell bike';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const response = await axios.post('https://sai-motors-management-backend.onrender.com/api/customers', customerData);
      setCustomers(prevCustomers => [...prevCustomers, response.data]);
      toast.success('Customer added successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Add customer error:', error);
      const message = error.response?.data?.message || 'Failed to add customer';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      const response = await axios.put(`https://sai-motors-management-backend.onrender.com/api/customers/${id}`, customerData);
      setCustomers(prevCustomers =>
        prevCustomers.map(customer => customer._id === id ? response.data : customer)
      );
      toast.success('Customer updated successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update customer error:', error);
      const message = error.response?.data?.message || 'Failed to update customer';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`https://sai-motors-management-backend.onrender.com/api/customers/${id}`);
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer._id !== id));
      toast.success('Customer deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Delete customer error:', error);
      const message = error.response?.data?.message || 'Failed to delete customer';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    dashboardFilter,
    setDashboardFilter,
    bikes,
    sales,
    customers,
    dashboardData,
    loading,
    
    // API functions
    fetchDashboardData,
    fetchBikes,
    fetchSales,
    fetchCustomers,
    addBike,
    updateBike,
    deleteBike,
    sellBike,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };

  return (
    <AppContext.Provider value={value}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};