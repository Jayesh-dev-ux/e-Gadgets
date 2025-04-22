import { useEffect, useState } from 'react';
import VendorNavbar from '../../components/VendorNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('vendorToken');
        const { data } = await axios.get('http://localhost:5000/api/vendors/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <VendorNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.products}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.orders}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Recent orders and other widgets can be added here */}
      </div>
    </div>
  );
};

export default VendorDashboard;