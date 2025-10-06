// backend/src/utils/twilioClient.js
import Twilio from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,  // SID
  process.env.TWILIO_AUTH_TOKEN    // Auth Token
);

export default client;
