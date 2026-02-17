import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import AuthContext
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: 'https://sai-motors-management-backend.onrender.com/api',
  timeout: 10000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AppProvider = ({ children }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [dashboardFilter, setDashboardFilter] = useState('thisMonth');
  const [bikes, setBikes] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  // Apply theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize data only when user is authenticated
  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchBikes({ status: 'available' });
      fetchCustomers();
    }
  }, [user, dashboardFilter]);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await apiClient.get(`/dashboard?filter=${dashboardFilter}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard data error:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [dashboardFilter, user]);

  const fetchBikes = useCallback(async (params = {}) => {
    if (!user) return { bikes: [] };
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/bikes${queryString ? `?${queryString}` : ''}`);
      setBikes(response.data.bikes || response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch bikes error:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch bikes');
      }
      return { bikes: [] };
    }
  }, [user]);

  const fetchSales = useCallback(async (params = {}) => {
    if (!user) return { sales: [] };
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/sales${queryString ? `?${queryString}` : ''}`);
      setSales(response.data.sales || response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch sales error:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch sales');
      }
      return { sales: [] };
    }
  }, [user]);

  const fetchCustomers = useCallback(async (params = {}) => {
    if (!user) return { customers: [] };
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/customers${queryString ? `?${queryString}` : ''}`);
      setCustomers(response.data.customers || response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch customers error:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch customers');
      }
      return { customers: [] };
    }
  }, [user]);

  const addBike = async (bikeData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const response = await apiClient.post('/bikes', bikeData);
      setBikes(prevBikes => [...prevBikes, response.data]);
      toast.success('Bike added successfully');
      fetchDashboardData();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Add bike error:', error);
      const message = error.response?.data?.message || 'Failed to add bike';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateBike = async (id, bikeData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const response = await apiClient.put(`/bikes/${id}`, bikeData);
      setBikes(prevBikes => 
        prevBikes.map(bike => bike._id === id ? response.data : bike)
      );
      toast.success('Bike updated successfully');
      fetchDashboardData();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update bike error:', error);
      const message = error.response?.data?.message || 'Failed to update bike';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteBike = async (id) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      await apiClient.delete(`/bikes/${id}`);
      setBikes(prevBikes => prevBikes.filter(bike => bike._id !== id));
      toast.success('Bike deleted successfully');
      fetchDashboardData();
      return { success: true };
    } catch (error) {
      console.error('Delete bike error:', error);
      const message = error.response?.data?.message || 'Failed to delete bike';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const sellBike = async (saleData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const response = await apiClient.post('/sales', saleData);
      toast.success('Bike sold successfully');
      fetchBikes({ status: 'available' });
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
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const response = await apiClient.post('/customers', customerData);
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
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const response = await apiClient.put(`/customers/${id}`, customerData);
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
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      await apiClient.delete(`/customers/${id}`);
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
