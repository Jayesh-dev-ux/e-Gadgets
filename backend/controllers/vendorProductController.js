const Product = require("../models/Product");
// const Product = require("../models/VendorProduct");
const Vendor = require("../models/Vendor"); // Ensure you have Vendor model
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const multer = require("multer")
const cloudinaryUtil = require("../utils/CloudinaryUtil")
const Counter = require("../models/Counter");

const storage = multer.diskStorage({
  destination:"./upload",
  fileName: function(req,file,cb){
      cb(null, file.originalname)
  }
})
const upload = multer({
  storage:storage,
}).single("image")

// @desc    Get all products for a vendor
// @route   GET /api/vendor-products
// @access  Private
exports.getVendorProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ vendor: req.vendor.id });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get single product for a vendor
// @route   GET /api/vendor-products/:id
// @access  Private
exports.getVendorProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    vendor: req.vendor.id,
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Create product for a vendor
// @route   POST /api/vendor-products
// @access  Private
// exports.createVendorProduct = asyncHandler(async (req, res, next) => {
//   req.body.vendor = req.vendor.id;

//   // Save Cloudinary URL
//   if (req.file && req.file.path) {
//     req.body.image = req.file.path; // Cloudinary gives .path as secure_url
//   }

//   // Generate numericId dynamically
//   const latestProduct = await Product.findOne().sort({ numericId: -1 }).lean();
//   const nextNumericId = latestProduct ? latestProduct.numericId + 1 : 1;
//   req.body.numericId = nextNumericId;

//   const product = await Product.create(req.body);

//   // Optional: Add product to Vendor's products array
//   await Vendor.findByIdAndUpdate(req.vendor.id, {
//     $push: { products: product._id },
//   });

//   res.status(201).json({
//     success: true,
//     data: product,
//   });
// });
exports.createVendorProduct = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      try {
        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
        console.log(cloudinaryResponse);
        console.log(req.body);

        // Assign cloudinary image url
        req.body.image = cloudinaryResponse.secure_url;

        // Auto-increment numericId
        let counter = await Counter.findOne({ id: "product_numericId" });

        if (!counter) {
          // Create initial counter if not exists
          counter = await Counter.create({ id: "product_numericId", seq: 1 });
        } else {
          // Increment existing counter
          counter = await Counter.findOneAndUpdate(
            { id: "product_numericId" },
            { $inc: { seq: 1 } },
            { new: true }
          );
        }
        
        req.body.numericId = counter.seq;

        // Store product in DB
        const savedProduct = await Product.create(req.body);

        res.status(200).json({
          message: "File is uploaded and product saved",
          data: savedProduct,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
    }
  });
});

// @desc    Update product for a vendor
// @route   PUT /api/vendor-products/:id
// @access  Private
exports.updateVendorProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure vendor owns the product
  if (product.vendor.toString() !== req.vendor.id) {
    return next(
      new ErrorResponse(`Not authorized to update this product`, 401)
    );
  }

  // Handle image update if needed
  if (req.file && req.file.path) {
    req.body.image = req.file.path;
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Delete product for a vendor
// @route   DELETE /api/vendor-products/:id
// @access  Private
// @desc    Delete product for a vendor
// @route   DELETE /api/vendor-products/:id
// @access  Private
exports.deleteVendorProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure vendor owns the product
  if (product.vendor.toString() !== req.vendor.id) {
    return next(
      new ErrorResponse(`Not authorized to delete this product`, 401)
    );
  }

  await Product.deleteOne({ _id: req.params.id }); // ✅ Correct way!

  // Optional: Remove from Vendor products array
  await Vendor.findByIdAndUpdate(req.vendor.id, {
    $pull: { products: product._id },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});