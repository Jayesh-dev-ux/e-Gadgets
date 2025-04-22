const express = require("express");
const {
  getVendorProducts,
  getVendorProduct,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
} = require("../controllers/vendorProductController");
const { vendorAuth } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Cloudinary Multer config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// Vendor protected routes
router.get("/", vendorAuth, getVendorProducts);
router.get("/:id", vendorAuth, getVendorProduct);
router.post("/", vendorAuth, upload.single("image"), createVendorProduct);
router.put("/:id", vendorAuth, upload.single("image"), updateVendorProduct);
router.delete("/:id", vendorAuth, deleteVendorProduct);

module.exports = router;
