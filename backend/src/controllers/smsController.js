import client from "../utils/twilioClient.js";

export const sendSMS = async (req, res) => {
  try {
    const { to, message } = req.body;

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    res.status(200).json({ success: true, sid: sms.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
