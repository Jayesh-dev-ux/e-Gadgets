import { motion } from "framer-motion";
import {
  FiBox,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";
import InfoField from "./InfoField";
import { useEffect, useState } from "react";
import {
  getVendorDashboard,
  getCachedVendorData,
} from "../../services/vendorAPI";
import { toast } from "react-toastify";
// import Spinner from "./Spinner";


const DashboardTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(getCachedVendorData());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard stats
        const dashboardResponse = await getVendorDashboard();
        setStats(dashboardResponse.data);

        // Update vendor data if not already set
        if (!vendor) {
          const vendorResponse = await getVendorProfile();
          setVendor(vendorResponse.data.data);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load dashboard data");
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (<div>loading</div>);

  const statCards = [
    {
      title: "Total Products",
      value: stats?.products || 0,
      change: "+0 this month",
      icon: <FiBox className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
      trend: "up",
    },
    {
      title: "Total Orders",
      value: stats?.orders || 0,
      change: "+0 this month",
      icon: <FiShoppingCart className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.revenue || 0).toLocaleString()}`,
      change: "+0% this month",
      icon: <FiDollarSign className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-50",
      trend: "up",
    },
    {
      title: "Growth Rate",
      value: "0%",
      change: "vs last month",
      icon: <FiTrendingUp className="w-6 h-6 text-yellow-500" />,
      bg: "bg-yellow-50",
      trend: "neutral",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg shadow-sm border border-gray-100 ${stat.bg}`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="p-3 rounded-full h-12 w-12 flex items-center justify-center bg-white">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Vendor Information
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Company Name" value={vendor?.companyName} />
            <InfoField label="Business Type" value={vendor?.businessType} />
            <InfoField label="Email" value={vendor?.email} />
            <InfoField
              label="Account Status"
              value={vendor?.approved ? "Active" : "Pending"}
              status={vendor?.approved ? "success" : "warning"}
            />
            {vendor?.address && (
              <>
                <InfoField
                  label="Address"
                  value={`${vendor.address.street || ""}, ${
                    vendor.address.city || ""
                  }, ${vendor.address.state || ""}`}
                />
                <InfoField label="Phone" value={vendor.phone} />
                <InfoField label="Website" value={vendor.website} />
                <InfoField label="Tax ID" value={vendor.taxId} />
              </>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-center py-4">
            Recent activity will appear here
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardTab;
