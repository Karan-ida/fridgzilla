// backend/testTwilio.js
import dotenv from "dotenv";
dotenv.config();

import client from "./src/utils/twilioClient.js";

// Debug env
console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing");
console.log("PHONE:", process.env.TWILIO_PHONE_NUMBER);

const run = async () => {
  try {
    const message = await client.messages.create({
      body: "Hello 👋 This is a Twilio test!",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+91XXXXXXXXXX", // replace with your phone number
    });

    console.log("✅ Sent:", message.sid);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

run();
