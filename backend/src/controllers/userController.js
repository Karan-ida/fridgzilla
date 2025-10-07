// backend/src/controllers/userController.js
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fullUser = {
      ...user.toJSON(),
      avatar: user.avatar
        ? `${req.protocol}://${req.get("host")}${user.avatar}`
        : null,
    };

    res.json(fullUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, phone } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        ...user.toJSON(),
        avatar: user.avatar
          ? `${req.protocol}://${req.get("host")}${user.avatar}`
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Save relative path like `/uploads/1696587465123.jpg`
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Avatar updated successfully",
      user: {
        ...user.toJSON(),
        avatar: `${req.protocol}://${req.get("host")}${user.avatar}`,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update avatar" });
  }
};
