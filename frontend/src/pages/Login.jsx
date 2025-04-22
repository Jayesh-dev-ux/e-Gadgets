import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiBriefcase, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../services/authAPI";
import { loginVendor } from "../services/vendorAPI";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [loginType, setLoginType] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (loginType === "user") {
        const userData = await loginUser({
          email: formData.email,
          password: formData.password
        });
        
        // localStorage.setItem("userInfo", JSON.stringify(userData));
        
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("userToken", userData.token); // ✅ THIS is the key!
        setUser(userData);
        navigate("/");
      } else {
        const vendorData = await loginVendor({
          email: formData.email,
          password: formData.password
        });
          localStorage.setItem("vendorInfo", JSON.stringify(vendorData));
          localStorage.setItem("id", JSON.stringify(vendorData.vendor.id));
        navigate("/vendor/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    if (loginType === "user") {
      navigate("/register");
    } else {
      navigate("/vendor/register");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100 rounded-full opacity-20"></div>
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
          >
            YourBrand
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm"
          >
            {loginType === "user" ? "Customer Portal" : "Business Portal"}
          </motion.p>
        </div>

        {/* Login Type Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setLoginType("user")}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center ${
                loginType === "user"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FiUser className="mr-2" />
              User
            </button>
            <button
              type="button"
              onClick={() => setLoginType("vendor")}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center ${
                loginType === "vendor"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FiBriefcase className="mr-2" />
              Vendor
            </button>
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          key={loginType}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-center text-gray-800 mb-2"
          >
            {loginType === "user" ? "Welcome Back!" : "Vendor Sign In"}
          </motion.h2>
          <motion.p 
            className="text-center text-gray-500 mb-6"
          >
            {loginType === "user" 
              ? "Sign in to access your account" 
              : "Manage your business dashboard"}
          </motion.p>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg flex items-start"
              >
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="space-y-2"
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                loginType === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
              } disabled:opacity-70 flex items-center justify-center`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {loginType === "user" ? "Signing in..." : "Accessing dashboard..."}
                </span>
              ) : (
                <span className="flex items-center">
                  {loginType === "user" ? "Sign In" : "Vendor Login"}
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-gray-500">
                New to YourBrand?
              </span>
            </div>
          </div>

          {/* Register CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={handleRegisterRedirect}
              className={`inline-flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                loginType === "user" 
                  ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                  : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
              } group`}
            >
              Create {loginType === "user" ? "user" : "vendor"} account
              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
