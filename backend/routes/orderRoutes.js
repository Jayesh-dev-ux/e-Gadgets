const express = require("express");
const { getOrders, createOrder, updateOrderStatus, getOrderById, getOrdersByUser} = require("../controllers/orderController");
const { protect, admin,vendorAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// router.get("/", protect, admin,vendorAuth, getOrders);
router.get("/", getOrders);
router.post("/", protect, createOrder);
router.put("/:id", updateOrderStatus);
router.get("/:id", protect, getOrderById); // ✅ add this line
router.get("/user/:userId", protect, getOrdersByUser); // Add this new route
module.exports = router;
