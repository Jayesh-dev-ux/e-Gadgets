import React from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiBox,
  FiDollarSign,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NavItem from "./NavItem";

const VendorSidebar = ({ vendor, activeTab, setActiveTab, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-full md:w-64 bg-white shadow-md fixed md:static h-full z-10"
    >
      <div className="p-6 border-b">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-bold text-gray-800 truncate"
        >
          {vendor?.companyName}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500"
        >
          Vendor Dashboard
        </motion.p>
      </div>

      <nav className="mt-6">
        <NavItem
          icon={<FiHome className="w-5 h-5" />}
          text="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => {
            setActiveTab("dashboard");
            navigate("/vendor");
          }}
        />
        <NavItem
          icon={<FiBox className="w-5 h-5" />}
          text="Products"
          active={activeTab === "products"}
          onClick={() => {
            setActiveTab("products");
            navigate("/vendor/products");
          }}
        />
        <NavItem
          icon={<FiPlus className="w-5 h-5" />}
          text="Add Product"
          active={activeTab === "add-product"}
          onClick={() => {
            setActiveTab("add-product");
            navigate("/vendor/products/add");
          }}
        />
        <NavItem
          icon={<FiDollarSign className="w-5 h-5" />}
          text="Orders"
          active={activeTab === "orders"}
          onClick={() => {
            setActiveTab("orders");
            navigate("/vendor/orders");
          }}
        />
        <NavItem
          icon={<FiUsers className="w-5 h-5" />}
          text="Customers"
          active={activeTab === "customers"}
          onClick={() => {
            setActiveTab("customers");
            navigate("/vendor/customers");
          }}
        />
        <NavItem
          icon={<FiSettings className="w-5 h-5" />}
          text="Settings"
          active={activeTab === "settings"}
          onClick={() => {
            setActiveTab("settings");
            navigate("/vendor/settings");
          }}
        />
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VendorSidebar;
