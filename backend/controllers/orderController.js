const Order = require("../models/Order");

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/orderController.js

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    // Verify the user is requesting their own orders or is admin
    if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: "Not authorized to access these orders" 
      });
    }

    const orders = await Order.find({ user: req.params.userId })
      .populate("user", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ 
      message: "Failed to fetch orders",
      error: error.message 
    });
  }
};


// Create an order
// const createOrder = async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.status(201).json(newOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || !totalAmount) {
      return res.status(400).json({ message: "Missing products or total amount" });
    }

    const newOrder = new Order({
      user: req.user._id, // ✅ securely set user from middleware
      products,
      totalAmount,
      status: "Processing",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created", orderId: newOrder._id });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error during order creation" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrderStatus, getOrderById, getOrdersByUser };