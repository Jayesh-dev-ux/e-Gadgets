import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Assuming you store user ID in localStorage after login
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userId = userInfo?._id;
        const token = userInfo?.token;
        const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Order Tracking</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              {/* Order Info */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-blue-600 font-bold">Total: ${order.totalAmount}</p>

              {/* Order Status Timeline */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">Order Status</h3>
                <div className="flex items-center justify-between mt-4">
                  {["Processing", "Shipped", "Out for Delivery", "Delivered"].map((step, index) => {
                    const currentStepIndex = ["Processing", "Shipped", "Out for Delivery", "Delivered"].indexOf(order.status);
                    return (
                      <div key={index} className="flex flex-col items-center text-center">
                        <motion.div
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            index <= currentStepIndex ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
                          }`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.2 }}
                        >
                          {index === 0 ? <FiPackage /> : index === 3 ? <FiCheckCircle /> : <FiTruck />}
                        </motion.div>
                        <p className={`mt-2 text-sm ${index <= currentStepIndex ? "text-blue-600" : "text-gray-500"}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
