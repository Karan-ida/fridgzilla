import Bill from "../models/Bill.js";

export const createBill = async (req, res) => {
  try {
    const { title, amount } = req.body;
    const bill = await Bill.create({ title, amount, userId: req.user.id });
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({ where: { userId: req.user.id } });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bill.destroy({ where: { id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
