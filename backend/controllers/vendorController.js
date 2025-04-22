const Vendor = require("../models/Vendor");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");
// Register vendor
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, companyName, businessType } = req.body;

  const existing = await Vendor.findOne({ email });
  if (existing) {
    return next(new ErrorResponse("Email already registered", 400));
  }

  const vendor = await Vendor.create({
    name,
    email,
    password,
    companyName,
    businessType,
  });

  sendTokenResponse(vendor, 201, res);
});

// Login vendor
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  const vendor = await Vendor.findOne({ email }).select("+password");
  if (!vendor || !(await vendor.matchPassword(password))) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(vendor, 200, res);
});

// Get current vendor
exports.getMe = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.vendor.id).select("-password");
  if (!vendor) return next(new ErrorResponse("Vendor not found", 404));

  res.status(200).json({ success: true, data: vendor });
});

// Get dashboard stats
exports.getDashboard = asyncHandler(async (req, res, next) => {
  const [productCount, orderCount, revenueResult] = await Promise.all([
    Product.countDocuments({ vendor: req.vendor.id }),
    Order.countDocuments({ vendor: req.vendor.id }),
    Order.aggregate([
      { $match: { vendor: mongoose.Types.ObjectId(req.vendor.id) } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const stats = {
    products: productCount || 0,
    orders: orderCount || 0,
    revenue: revenueResult[0]?.total || 0,
  };

  res.status(200).json({ success: true, data: stats });
});

// Update vendor details
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    companyName: req.body.companyName,
    businessType: req.body.businessType,
    address: req.body.address,
    phone: req.body.phone,
    website: req.body.website,
    taxId: req.body.taxId,
  };

  const vendor = await Vendor.findByIdAndUpdate(req.vendor.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!vendor) return next(new ErrorResponse("Vendor not found", 404));

  res.status(200).json({ success: true, data: vendor });
});

// Update vendor password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.vendor.id).select("+password");

  if (!(await vendor.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Current password is incorrect", 401));
  }

  vendor.password = req.body.newPassword;
  await vendor.save();

  sendTokenResponse(vendor, 200, res);
});

// Logout vendor
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Token helper
const sendTokenResponse = (vendor, statusCode, res) => {
  const token = vendor.getSignedJwtToken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        companyName: vendor.companyName,
        businessType: vendor.businessType,
      },
    });
};
