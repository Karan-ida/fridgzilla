import React from "react";
import { motion } from "framer-motion";

const TermsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[80vh]"
      >
        <h2 className="text-2xl font-bold mb-4 text-emerald-700">Terms & Conditions</h2>
        <p className="text-gray-700 mb-3">
          Welcome to <strong>Fridgella</strong> — your smart expiry reminder and food management platform.  
          By creating an account, you agree to use this app responsibly.
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Provide accurate details while registering.</li>
          <li>Do not share your login credentials with others.</li>
          <li>Fridgella is not responsible for any loss due to expired data inaccuracies.</li>
          <li>We may update our terms occasionally to improve service.</li>
        </ul>

        <p className="mt-4 text-gray-700">
          By using this application, you accept these terms and consent to receive notifications related to expiry reminders and account activities.
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

export default TermsModal;
