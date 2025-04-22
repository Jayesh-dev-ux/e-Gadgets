import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { getVendorProfile, logoutVendor } from "../../services/vendorAPI";
import VendorNavbar from "./VendorNavbar";
import DashboardTab from "./DashboardTab";
import CustomersTab from "./CustomersTab";
import SettingsTab from "./SettingTab";
import ProductsTab from "./ProductTab";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const vendorData = await getVendorProfile();
        setVendor(vendorData);
      } catch (error) {
        setError(error.message || "Please login to continue");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutVendor();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 pt-20 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "products" && "Product Management"}
            {activeTab === "customers" && "Customer Insights"}
            {activeTab === "settings" && "Account Settings"}
          </h1>

          {activeTab === "dashboard" && <DashboardTab vendor={vendor} />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "customers" && <CustomersTab />}
          {activeTab === "settings" && <SettingsTab vendor={vendor} />}
        </motion.div>
      </div>
    </div>
  );
};

export default VendorDashboard;