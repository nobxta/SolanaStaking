require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "StakeSol - Verify Your Account",
    html: `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px; }
          .container { max-width: 500px; margin: auto; padding: 25px; }
          .otp { font-size: 26px; font-weight: bold; color: #8E76FF; margin: 20px auto; padding: 10px; border-bottom: 2px solid #00FFA3; display: inline-block; }
          .footer { font-size: 14px; color: #777; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 style="color: #222;">Verify Your StakeSol Account</h2>
          <p style="color: #555;">Your OTP is valid for 10 minutes.</p>
          <div class="otp">${otp}</div>
          <p style="color: #777;">If you didn’t request this, ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  });
}


// User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 🔥 **Fix: Hash password before saving**
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      otp,
      otpExpires,
      isVerified: false,
    });

    await user.save();
    await sendOTP(email, otp);

    return res.status(201).json({ message: "OTP sent to email. Verify to proceed." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Ensure OTP exists
    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    // Convert both OTPs to strings and trim spaces before comparing
    if (user.otp.toString().trim() !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Fix expiration check
    if (new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("❌ Error in verifyOTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password +otp +otpExpires");

    if (!user) {
      return res.status(400).json({ message: "Account does not exist." });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Password not set. Try resetting your password." });
    }

    if (!user.isVerified) {
      const newOTP = generateOTP();
      user.otp = newOTP;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendOTP(email, newOTP);
      return res.status(401).json({
        message: "Your account is not verified. OTP has been sent.",
        redirectTo: "verifyOTP", // Frontend should navigate to OTP verification page
        email: user.email, // Include email so the frontend can autofill it
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTP(email, otp);

    return res.json({ message: "New OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Logout (Client handles token removal)
exports.logout = (req, res) => res.json({ message: "Logged out successfully" });
