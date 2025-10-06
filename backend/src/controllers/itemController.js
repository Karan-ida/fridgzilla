// backend/src/controllers/itemController.js
import Item from "../models/Item.js";
import { validateItem } from "../utils/validators.js";
import client from "../utils/twilioClient.js";
import User from "../models/User.js";

// Function to send SMS reminder
const sendExpirySMS = async (item) => {
  try {
    const user = await User.findByPk(item.userId);
    if (!user?.phone) return;

    const message = `⚠️ Reminder: Your product "${item.name}" expires on ${item.expiryDate.toDateString()}`;
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });

    // Mark item as SMS notified
    await item.update({ smsNotified: true });
    console.log(`✅ SMS sent for ${item.name} to ${user.phone}`);
  } catch (err) {
    console.error("❌ SMS error:", err.message);
  }
};

// Helper to schedule SMS 1 day before expiry
const scheduleSMS = (item) => {
  if (!item.expiryDate || item.smsNotified) return; // Don't schedule if already notified

  const reminderDate = new Date(item.expiryDate);
  reminderDate.setDate(reminderDate.getDate() - 1);
  const delay = reminderDate.getTime() - Date.now();

  if (delay > 0) {
    setTimeout(() => sendExpirySMS(item), delay);
  }
};

/**
 * Create new manual item
 */
export const createItem = async (req, res) => {
  try {
    const { name, quantity, expiryDate, category, unit, purchaseDate } = req.body;

    if (!validateItem({ name, quantity, expiryDate })) {
      return res.status(400).json({ success: false, message: "Invalid item data" });
    }

    const item = await Item.create({
      name,
      quantity,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      expiryDate,
      category,
      unit,
      userId: req.user.id,
      source: "manual",
      addedDate: new Date(),
      smsNotified: false, // default
    });

    // Schedule SMS reminder
    scheduleSMS(item);

    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Add items from uploaded bill
 */
export const createBillItems = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Invalid bill items" });
    }

    const createdItems = await Promise.all(
      items.map(async (item) => {
        const newItem = await Item.create({
          name: item.name,
          quantity: item.quantity || 1,
          purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : new Date(),
          expiryDate: item.expiryDate || null,
          category: item.category || "Other",
          unit: item.unit || null,
          userId: req.user.id,
          source: "bill",
          addedDate: new Date(),
          smsNotified: false,
        });

        // Schedule SMS reminder
        scheduleSMS(newItem);

        return newItem;
      })
    );

    res.status(201).json({ success: true, items: createdItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all items for logged-in user
 */
export const getItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id },
      order: [["addedDate", "DESC"]],
    });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update an item
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, expiryDate, category, unit, status, purchaseDate } = req.body;

    const item = await Item.findOne({ where: { id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    await item.update({ name, quantity, expiryDate, category, unit, status, purchaseDate });

    // Reschedule SMS if expiry date changed and SMS not yet sent
    if (!item.smsNotified) scheduleSMS(item);

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete an item
 */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findOne({ where: { id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    await item.destroy();
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
