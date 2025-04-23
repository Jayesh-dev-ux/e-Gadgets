import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./components/Footer";
import AddProduct from "./pages/AddProducts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Card from "./pages/Card";
import WishlistPage from "./pages/WishlistPage ";
import FAQPage from "./pages/Faq";
import ProductCard from "./components/ProductCard";
import VendorRegister from "../src/pages/vendor/VendorRegister";
import VendorDashboard from "../src/pages/vendor/VendorDashboard";
import VendorLogin from "../src/pages/vendor/VendorLogin";
import ProductsTab from "./pages/vendor/ProductTab";
import EditProduct from "./pages/vendor/EditProduct";
import NavbarLoader from "./pages/NavbarLoader";
import OrderConfirmation from "./pages/OrderConfirmation ";
import OrdersTab from "./pages/vendor/OrdersTab";
import { AdminUser } from "./pages/AdminUser";
import { AdminVendor } from "./pages/AdminVendor";
import { AdminProduct } from "./pages/AdminProduct";
// import VendorSidebar from "./pages/vendor/VendorSidebar";
// import VendorNavItem from "./pages/vendor/VendorNavItem";
// import VendorMainContent from "./pages/vendor/VendorMainContent";
// import DashboardTab from "./pages/vendor/DashboardTab";
// import InfoField from "./pages/vendor/InfoField";
// import StatsCard from "./pages/vendor/StatsCard";
// import ProductsTab from "./pages/vendor/ProductsTab";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <Contact />
            </PageWrapper>
          }
        />
        <Route
          path="/products"
          element={
            <PageWrapper>
              <ProductList />
            </PageWrapper>
          }
        />
        <Route
          path="/vendor/edit-product/:id"
          element={
            <PageWrapper>
              <EditProduct />
            </PageWrapper>
          }
        />

        <Route
          path="/products/:id"
          element={
            <PageWrapper>
              <ProductDetails />
            </PageWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <PageWrapper>
              {" "}
              <Cart />
            </PageWrapper>
          }
        />
        <Route
          path="/card"
          element={
            <PageWrapper>
              {" "}
              <Card />
            </PageWrapper>
          }
        />
        <Route
          path="/orders"
          element={
            <PageWrapper>
              <Orders />
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <Profile />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/vendor/products"
          element={
            <PageWrapper>
              <ProductsTab />
            </PageWrapper>
          }
        />
        <Route path="/vendor/add-product" element={<AddProduct />} />
        <Route
          path="/wishlist"
          element={
            <PageWrapper>
              {" "}
              <WishlistPage />
            </PageWrapper>
          }
        />
        <Route
          path="/faq"
          element={
            <PageWrapper>
              <FAQPage />
            </PageWrapper>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/checkout"
          element={
            // <ProtectedRoute>
            <PageWrapper>
              <Checkout />
            </PageWrapper>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/orderConfirmation/:orderId"
          element={
            // <ProtectedRoute>
            <PageWrapper>
              <OrderConfirmation />
            </PageWrapper>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            // <ProtectedRoute adminOnly>
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <AdminDashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            // <ProtectedRoute>
              <AdminUser />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            // <ProtectedRoute>
              <AdminVendor />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            // <ProtectedRoute>
              <AdminProduct />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/dashboard"
          element={
            // <ProtectedRoute>
            <VendorDashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/login"
          element={
            <PageWrapper>
              <VendorLogin />
            </PageWrapper>
          }
        />
        <Route
          path="/vendor/register"
          element={
            <PageWrapper>
              <VendorRegister />
            </PageWrapper>
          }
        />
        <Route
          path="/vendor/orders"
          element={
            <PageWrapper>
              <OrdersTab />
            </PageWrapper>
          }
        />
        {/* <Route
          path="/vendor/sidebar"
          element={
            <ProtectedRoute>
              <VendorSidebar />
            </ProtectedRoute>
          }
        />
         <Route
          path="/vendor/navitem"
          element={
            <ProtectedRoute>
              <VendorNavItem />
            </ProtectedRoute>
          }
          />
            <Route
          path="/vendor/maincontent"
          element={
            <ProtectedRoute>
              <VendorMainContent/>
            </ProtectedRoute>
          }
          />
            <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute>
              <DashboardTab/>
            </ProtectedRoute>
          }
          />
            <Route
          path="/vendor/infofield"
          element={
            <ProtectedRoute>
              <InfoField/>
            </ProtectedRoute>
          }
          />
            <Route
          path="/vendor/statscard"
          element={
            <ProtectedRoute>
              <StatsCard/>
            </ProtectedRoute>
          }
          />
              <Route
          path="/vendor/product"
          element={
            <ProtectedRoute>
              <ProductsTab/>
            </ProtectedRoute>
          }
          /> */}
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavbarLoader />
        <AnimatedRoutes />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;