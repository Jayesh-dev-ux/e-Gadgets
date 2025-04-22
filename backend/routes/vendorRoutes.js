const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  getDashboard,
  updateDetails,
  updatePassword,
} = require("../controllers/vendorController");

const { vendorAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", vendorAuth, logout);
router.get("/me", vendorAuth, getMe);
router.get("/dashboard", vendorAuth, getDashboard);
router.put("/updatedetails", vendorAuth, updateDetails);
router.put("/updatepassword", vendorAuth, updatePassword);

module.exports = router;
