import cron from "node-cron";
import { Op } from "sequelize";
import { sendSMS } from "../utils/sendSMS.js";
import { Product, User } from "../models/index.js";

console.log("🕒 Expiry reminder scheduler is active and waiting...");

// 🔔 Run every day at 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("🔔 Checking for expiring groceries...");

  const today = new Date();
  const upcoming = new Date();
  upcoming.setDate(today.getDate() + 2); // next 2 days

  try {
    const expiringItems = await Product.findAll({
      where: {
        expiryDate: { [Op.between]: [today, upcoming] },
        isNotified: false,
      },
      include: [{ model: User, as: "user", attributes: ["name", "phone"] }],
    });

    for (const item of expiringItems) {
      if (item.user?.phone) {
        const message = `⚠️ Hi ${item.user.name || "there"}! Your grocery "${item.name}" will expire on ${item.expiryDate.toDateString()}.`;
        await sendSMS(item.user.phone, message);

        // Mark as notified to avoid duplicates
        item.isNotified = true;
        await item.save();
      }
    }

    console.log(`✅ Sent ${expiringItems.length} expiry reminders.`);
  } catch (error) {
    console.error("❌ Scheduler Error:", error.message);
  }
});
