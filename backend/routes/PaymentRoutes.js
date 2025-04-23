const express = require('express');
const routes = express.Router();


const razorpayController = require('../controllers/RazorPayController');


routes.post('/createOrder', razorpayController.createOrder);
routes.post('/verifyPayment', razorpayController.verifyOrder);
routes.get("/getkeys", razorpayController.getKeys);
module.exports = routes;