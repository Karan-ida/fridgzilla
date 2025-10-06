import User from "../models/User.js";

// Get current logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    // `req.user` will be set by authMiddleware after verifying JWT
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update current logged-in user's profile
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
