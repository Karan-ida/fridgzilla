// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateEmail, validatePassword, validateName } from "../utils/validators.js";

// ================== REGISTER ==================
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate inputs
    if (!validateName(name)) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, phone, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully.", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful.", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ================== UPDATE PROFILE ==================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { name, email, phone, avatar } = req.body;

    // Validate inputs
    if (name && !validateName(name)) {
      return res.status(400).json({ message: "Name must be at least 2 letters." });
    }
    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check if new email already exists
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
