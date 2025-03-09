const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// 🟢 Get User Info
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ name: user.name, email: user.email, profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 🟢 Update User Info
router.post("/update", async (req, res) => {
  try {
    const { email, name, newPassword, confirmPassword, profilePicture } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (newPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    user.name = name || user.name;
    user.profilePicture = profilePicture || user.profilePicture;
    await user.save();

    res.json({ message: "Profile updated successfully!", name: user.name, email: user.email, profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
