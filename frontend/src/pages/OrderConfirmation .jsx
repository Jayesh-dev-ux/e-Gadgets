import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getOrders}  from "../services/orderAPI";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrders(orderId);
        console.log(orderData)
        setOrder(orderData);
      } catch (error) {
        console.error("Order loading error:", error);
        toast.error("Failed to load order details", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-3xl font-extrabold text-gray-900 mb-2"
            whileHover={{ scale: 1.02 }}
          >
            Order Confirmation
          </motion.h2>
          <p className="text-lg text-gray-600">
            Thank you for your purchase, {order.shippingAddress?.firstName}!
          </p>
          <motion.p
            className="text-blue-600 font-medium mt-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Order #: {order.orderNumber || order._id}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Order Details
              </h3>
              
              <div className="space-y-4">
                {order.products.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Shipping Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{order.shippingAddress?.email}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Address</p>
                  <p className="font-medium">{order.shippingAddress?.street}</p>
                  <p className="font-medium">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                    {order.shippingAddress?.zipCode}
                  </p>
                  <p className="font-medium">{order.shippingAddress?.country}</p>
                </div>
                
                <div className="pt-4">
                  <p className="text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod?.replace("_", " ")}
                  </p>
                </div>
                
                <div className="pt-4">
                  <p className="text-gray-600">Order Status</p>
                  <div className="flex items-center mt-1">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      order.status === "processing" ? "bg-yellow-500" :
                      order.status === "shipped" ? "bg-blue-500" :
                      order.status === "delivered" ? "bg-green-500" : "bg-gray-500"
                    }`}></div>
                    <p className="font-medium capitalize">{order.status}</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/orders")}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                View All Orders
              </motion.button>
              
              <button
                onClick={() => navigate("/")}
                className="w-full mt-4 bg-white text-gray-800 py-3 px-6 rounded-lg font-semibold shadow-md border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Need Help With Your Order?
          </h3>
          <p className="text-gray-600 mb-4">
            We're here to help! Contact our customer support team.
          </p>
          <button className="text-blue-600 font-medium hover:underline">
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;