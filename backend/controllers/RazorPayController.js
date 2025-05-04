const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
 const crypto = require("crypto");

 const orderModel = require("../models/Order")

require('dotenv').config(); // Load ENV before anything else


// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


const createOrder =async (req, res) => {
  const { amount, currency, notes} = req.body;
  
  const options = {
    amount: amount * 100, // Razorpay expects the amount in paise
    notes:notes,
    currency: currency
    
 
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order); // Returns the order details, including order_id
    console.log("✅ Received orderData:", order);

  } catch (error) {
    console.log(error)
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// const verifyOrder = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

//   console.log(req.body)

//   const hash = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest("hex");

//     console.log(hash)
//     console.log(razorpay_signature)
//   if (hash === razorpay_signature) {
//     try {
//       // Save the order in your database (replace with your DB logic)
//       const orderResponse = await orderModel.create(orderData); // Replace with your actual DB model

//       res.status(200).json({
//         success: true,
//         message: 'Payment verified and order stored.',
//         order: {
//           orderNumber: orderResponse.orderNumber,
//           estimatedDelivery: orderResponse.estimatedDelivery,
//           totalAmount: orderResponse.totalAmount,
//         }
//       });
//     } catch (err) {
//       console.error("Order DB Save Error:", err);
//       res.status(500).json({ success: false, message: "Failed to save order" });
//     }
//   } else {
//     res.status(400).json({ success: false, message: "Invalid signature" });
//   }
// };

const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    // 1. Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // 2. Add required fields
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // Estimated 5 days
    console.log("Incoming orderData:", orderData);

    try {
      const fullOrder = new orderModel({
        ...orderData,
        orderNumber: `ORD-${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
        currentStatus: "Processing"
      });
    
      const savedOrder = await fullOrder.save();
    
      res.status(200).json({
        success: true,
        message: "Order saved",
        order: {
          orderNumber: savedOrder.orderNumber,
          estimatedDelivery: savedOrder.estimatedDelivery,
          totalAmount: savedOrder.totalAmount
        }
      });
    
    } catch (err) {
      console.error("💥 Error saving order:", err);
      res.status(500).json({ success: false, message: "Database save failed", error: err.message });
    }

  } catch (error) {
    console.error("Error in verifying order:", error);
    res.status(500).json({ success: false, message: "Failed to save order", error });
  }
};

const getKeys = async(req,res)=>{
  res.status(200).json({
    key:process.env.RAZORPAY_API_KEY
  })
}
module.exports = {
    createOrder,
    verifyOrder,
    getKeys
}

