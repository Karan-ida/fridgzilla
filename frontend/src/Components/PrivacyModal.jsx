import React from "react";
import { motion } from "framer-motion";

const PrivacyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[80vh]"
      >
        <h2 className="text-2xl font-bold mb-4 text-emerald-700">Privacy Policy</h2>
        <p className="text-gray-700 mb-3">
          Your privacy is important to us. Fridgella ensures your data — such as email, bills, and expiry reminders — are securely stored and not shared without consent.
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Personal data is used only for login and reminder notifications.</li>
          <li>Images uploaded (bills, items) remain private to your account.</li>
          <li>No third-party tracking or advertising cookies are used.</li>
          <li>You can delete your account anytime to remove all data permanently.</li>
        </ul>

        <p className="mt-4 text-gray-700">
          For any data removal or privacy-related queries, contact our support team via the app settings page.
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default PrivacyModal;
