import axios from "axios";

const API_URL = "http://localhost:5000/api/vendors";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("vendorToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

// Register new vendor
export const registerVendor = async (vendorData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, vendorData);
    if (response.data.token) {
      localStorage.setItem("vendorToken", response.data.token);
      localStorage.setItem("vendorData", JSON.stringify(response.data.vendor));
    }
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Registration failed"
    );
  }
};

// Login vendor
export const loginVendor = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("vendorToken", response.data.token);
      localStorage.setItem("vendorData", JSON.stringify(response.data.vendor));
    }
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Login failed"
    );
  }
};

// Get logged in vendor profile
export const getVendorProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
    // Update local storage with fresh data
    localStorage.setItem("vendorData", JSON.stringify(response.data.data));
    return response.data;
  } catch (error) {
    // Clear storage if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("vendorData");
    }
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch profile"
    );
  }
};

// Get vendor dashboard stats
export const getVendorDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch dashboard"
    );
  }
};

// Update vendor details
export const updateVendorDetails = async (details) => {
  try {
    const response = await axios.put(
      `${API_URL}/updatedetails`,
      details,
      getAuthHeaders()
    );
    // Update local storage with fresh data
    localStorage.setItem("vendorData", JSON.stringify(response.data.data));
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to update profile"
    );
  }
};

// Update vendor password
export const updateVendorPassword = async (passwordData) => {
  try {
    const response = await axios.put(
      `${API_URL}/updatepassword`,
      passwordData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to update password"
    );
  }
};

// Logout vendor
export const logoutVendor = async () => {
  try {
    await axios.get(`${API_URL}/logout`, getAuthHeaders());
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    return { success: true };
  } catch (error) {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Logout failed"
    );
  }
};

// Get cached vendor data
export const getCachedVendorData = () => {
  const vendorData = localStorage.getItem("vendorData");
  return vendorData ? JSON.parse(vendorData) : null;
};

export default {
  registerVendor,
  loginVendor,
  getVendorProfile,
  getVendorDashboard,
  updateVendorDetails,
  updateVendorPassword,
  logoutVendor,
  getCachedVendorData,
};
