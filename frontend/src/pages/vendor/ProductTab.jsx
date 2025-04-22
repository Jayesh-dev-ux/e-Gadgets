import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const ProductsTab = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vendorToken");
      const res = await axios.get("http://localhost:5000/api/vendor-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setDeletingId(productId);
      const token = localStorage.getItem("vendorToken");
      await axios.delete(
        `http://localhost:5000/api/vendor-products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/vendor/edit-product/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaSpinner className="animate-spin text-indigo-600 text-2xl mb-3" />
        <p className="text-gray-600">Loading your products...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Your Products
          </h2>
          <p className="text-gray-500 mt-1">Manage your product listings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 sm:mt-0 flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          onClick={() => navigate("/vendor/add-product")}
        >
          <FiPlus className="mr-2" />
          Add New Product
        </motion.button>
      </div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center"
        >
          <div className="max-w-md mx-auto">
            <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't added any products yet. Get started by adding your
              first product!
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-sm"
              onClick={() => navigate("/vendor/add-product")}
            >
              Add Your First Product
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 w-full">
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
                <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded">
                  {product.stock} in stock
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {product.description || "No description available"}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-indigo-600 font-bold">
                    <FiDollarSign className="mr-1" />
                    {product.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(product._id)}
                    className="flex-1 flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                    className={`flex-1 flex items-center justify-center py-2 px-3 border border-transparent rounded-lg text-white transition-colors ${
                      deletingId === product._id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deletingId === product._id ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FiTrash2 className="mr-2" />
                    )}
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTab;
