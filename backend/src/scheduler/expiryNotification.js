import cron from "node-cron";
import { Op } from "sequelize";
import client from "../utils/twilioClient.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

// Daily check at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("🔍 Checking for products expiring in 24h...");

  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const items = await Item.findAll({
      where: {
        expiryDate: { [Op.between]: [now, tomorrow] },
        smsNotified: false,
      },
      include: [{ model: User, as: "user" }],
    });

    for (const item of items) {
      if (item.user?.phone) {
        const message = `⚠️ Reminder: Your product "${item.name}" expires on ${item.expiryDate.toDateString()}`;
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: item.user.phone,
        });

        // Update SMS status
        await item.update({ smsNotified: true });
        console.log(`✅ SMS sent and updated for ${item.user.phone} (Item: ${item.name})`);
      }
    }
  } catch (err) {
    console.error("❌ Error in expiry notification:", err.message);
  }
});
