const express = require("express");
const { sendOtp, verifyOtp } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOtp); // Send OTP to phone number
router.post("/verify-otp", verifyOtp); // Verify OTP

module.exports = router;
