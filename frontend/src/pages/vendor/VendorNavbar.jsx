import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiBox,
  FiDollarSign,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiPlus,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { logoutVendor, getVendorProfile, getCachedVendorData } from "../../services/vendorAPI";
import { toast } from "react-toastify";

const VendorNavbar = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        // First try to get cached data for immediate display
        const cachedData = getCachedVendorData();
        if (cachedData) setVendor(cachedData);

        // Then fetch fresh data
        const { data } = await getVendorProfile();
        setVendor(data.data);
      } catch (error) {
        console.error("Failed to load vendor data:", error);
      }
    };

    loadVendorData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutVendor();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and desktop nav */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FiBox className="h-8 w-8 text-indigo-300" />
              <span className="ml-2 text-xl font-semibold truncate max-w-xs">
                {vendor?.companyName || "Vendor Dashboard"}
              </span>
            </div>

            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <NavLink
                  active={activeTab === "dashboard"}
                  onClick={() => handleNavClick("dashboard")}
                  to="/vendor/dashboard"
                >
                  <FiHome className="mr-2" /> Dashboard
                </NavLink>
                <NavLink
                  active={activeTab === "products"}
                  onClick={() => handleNavClick("products")}
                  to="/vendor/products"
                >
                  <FiBox className="mr-2" /> Products
                </NavLink>
                <NavLink
                  active={activeTab === "add-product"}
                  onClick={() => handleNavClick("add-product")}
                  to="/vendor/add-product"
                >
                  <FiPlus className="mr-2" /> Add Product
                </NavLink>
                <NavLink
                  active={activeTab === "orders"}
                  onClick={() => handleNavClick("orders")}
                  to="/vendor/orders"
                >
                  <FiDollarSign className="mr-2" /> Orders
                </NavLink>
              </div>
            </div>
          </div>

          {/* Right side - User dropdown */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="max-w-xs flex items-center text-sm rounded-full focus:outline-none"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2 mr-1">{vendor?.name || "Account"}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                    >
                      <DropdownLink
                        onClick={() => {
                          handleNavClick("settings");
                          setDropdownOpen(false);
                        }}
                        to="/vendor/settings"
                      >
                        <FiSettings className="mr-2" /> Settings
                      </DropdownLink>
                      <DropdownButton onClick={handleLogout}>
                        <FiLogOut className="mr-2" /> Sign out
                      </DropdownButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-indigo-800"
            role="menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink
                active={activeTab === "dashboard"}
                onClick={() => handleNavClick("dashboard")}
                to="/vendor"
              >
                <FiHome className="mr-3" /> Dashboard
              </MobileNavLink>
              <MobileNavLink
                active={activeTab === "products"}
                onClick={() => handleNavClick("products")}
                to="/vendor/products"
              >
                <FiBox className="mr-3" /> Products
              </MobileNavLink>
              <MobileNavLink
                active={activeTab === "add-product"}
                onClick={() => handleNavClick("add-product")}
                to="/vendor/add-product"
              >
                <FiPlus className="mr-3" /> Add Product
              </MobileNavLink>
              <MobileNavLink
                active={activeTab === "orders"}
                onClick={() => handleNavClick("orders")}
                to="/vendor/orders"
              >
                <FiDollarSign className="mr-3" /> Orders
              </MobileNavLink>
              <MobileNavLink
                active={activeTab === "settings"}
                onClick={() => handleNavClick("settings")}
                to="/vendor/settings"
              >
                <FiSettings className="mr-3" /> Settings
              </MobileNavLink>
              <MobileNavButton onClick={handleLogout}>
                <FiLogOut className="mr-3" /> Sign out
              </MobileNavButton>
            </div>
            <div className="pt-4 pb-3 border-t border-indigo-700">
              <div className="flex items-center px-5">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {vendor?.name || "Vendor"}
                  </div>
                  <div className="text-sm font-medium text-indigo-200">
                    {vendor?.email || ""}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ active, onClick, to, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
      active
        ? "bg-indigo-800 text-white"
        : "text-indigo-200 hover:bg-indigo-600 hover:text-white"
    }`}
  >
    {children}
  </Link>
);

const DropdownLink = ({ onClick, to, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
    role="menuitem"
  >
    {children}
  </Link>
);

const DropdownButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
    role="menuitem"
  >
    {children}
  </button>
);

const MobileNavLink = ({ active, onClick, to, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
      active
        ? "bg-indigo-600 text-white"
        : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
    }`}
    role="menuitem"
  >
    {children}
  </Link>
);

const MobileNavButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:bg-indigo-700 hover:text-white"
    role="menuitem"
  >
    {children}
  </button>
);

export default VendorNavbar;
