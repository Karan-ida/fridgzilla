import User from "../models/User.js";
import Bill from "../models/Bill.js";

export const getAnalytics = async (req, res) => {
  try {
    const userCount = await User.count();
    const billCount = await Bill.count();
    const totalAmount = await Bill.sum("amount") || 0;

    res.json({
      users: userCount,
      bills: billCount,
      totalAmount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
