import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCart, getSessionId } from "../services/cartAPI";
import { createOrder } from "../services/orderAPI";
import Razorpay from "razorpay";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "credit_card",
  });

  // const userInfo = localStorage.getItem("userInfo")
  // console.log(userInfo._id)

  useEffect(() => {
    const loadCart = async () => {
      try {
        const sessionId = getSessionId();
        setSessionId(sessionId);
        const userInfo = localStorage.getItem("userInfo")
        console.log(userInfo._id)
        const cartData = await getCart(sessionId);
        setCart(cartData);
      } catch (error) {
        console.error("Cart loading error:", error);
        toast.error("Failed to load cart", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (orderData) => {
    const {data:{key}} = await axios.get("http://localhost:5000/api/getkeys")
    console.log(key)
    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Create order on your server (you'll need to implement this endpoint)
      const razorpayOrder = await axios.post(
        "http://localhost:5000/api/createOrder",
        {
          amount: cart.subtotal * 100, // Razorpay expects amount in paise
          currency: "INR",
        }
      );
      console.log(razorpayOrder)

      const options = {
        key, // Your Razorpay Key ID
        amount: razorpayOrder.data.amount,
        currency: razorpayOrder.data.currency,
        name: "Your Store Name",
        description: "Payment for your order",
        image: razorpayOrder.data.image,
        order_id: razorpayOrder.data.id,
        handler: async function (response) {
          // Handle successful payment
          try {
            // Verify payment on your server
            const verification = await axios.post(
              "http://localhost:5000/api/verifyPayment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData
              }
            );

            if (verification.data.success) {
              // Payment successful, create order in your database
              const orderResponse = await createOrder({
                ...orderData,
                paymentId: response.razorpay_payment_id,
                paymentStatus: "completed",
              });

              toast.success("Payment successful! Order placed.", {
                position: "top-right",
                autoClose: 2000,
              });
              navigate(`/orderConfirmation/${orderResponse.orderId}`);
            } else {
              toast.error("Payment verification failed", {
                position: "top-right",
                autoClose: 2000,
              });
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed", {
              position: "top-right",
              autoClose: 2000,
            });
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: "9000000000", // You might want to add phone number to your form
        },
        notes: {
          address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Error initiating payment", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };

      const orderData = {
        sessionId,
        // user: userInfo._id,
        products: cart.items.map((item) => ({
          image: item.image,
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cart.subtotal,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
      };

      // const orderData = {
      //   user: userInfo._id,
      //   totalAmount: totalPrice,
      //   products: cartItems.map(item => ({
      //     product: item._id,
      //     quantity: item.quantity,
      //     image: item.image,
      //     price: item.price
      //   }))
      // };
      
      
      console.log(orderData);
      

      if (formData.paymentMethod === "credit_card") {
        // Initiate Razorpay payment
        await displayRazorpay(orderData);
      } else {
        // For other payment methods, create order directly
        const response = await createOrder(orderData);
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate(`/orderConfirmation/${response.orderId}`);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-center text-gray-900 mb-6"
        >
          Checkout
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Shipping Information
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Method
                </h3>
                <div className="space-y-3 mb-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === "credit_card"}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span>Credit Card</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span>PayPal</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === "bank_transfer"}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Place Order
                </motion.button>
              </form>
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
                Order Summary
              </h3>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b pb-3"
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
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cart.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${cart.subtotal?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;