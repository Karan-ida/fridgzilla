// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Upload, Bell, LineChart } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <motion.h1
          className="text-5xl font-extrabold mb-6 text-emerald-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Fridgella 🥦
        </motion.h1>
        <motion.p
          className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Track your groceries, get expiry reminders, analyze usage, and reduce food waste with smart insights.
        </motion.p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg shadow hover:bg-emerald-50 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Fridgella?
        </h2>
        <div className="grid gap-8 max-w-5xl mx-auto px-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            className="p-6 bg-emerald-50 rounded-xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.05 }}
          >
            <Upload className="h-10 w-10 text-emerald-600 mb-4" />
            <h3 className="font-bold text-lg">Bill Scanning</h3>
            <p className="text-sm text-gray-600 mt-2">
              Upload receipts and let OCR extract your grocery items automatically.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-emerald-50 rounded-xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.05 }}
          >
            <Bell className="h-10 w-10 text-emerald-600 mb-4" />
            <h3 className="font-bold text-lg">Expiry Alerts</h3>
            <p className="text-sm text-gray-600 mt-2">
              Get reminders before your fruits & vegetables expire.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-emerald-50 rounded-xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.05 }}
          >
            <BarChart3 className="h-10 w-10 text-emerald-600 mb-4" />
            <h3 className="font-bold text-lg">Track Inventory</h3>
            <p className="text-sm text-gray-600 mt-2">
              Keep track of what’s in your fridge with easy dashboards.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-emerald-50 rounded-xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.05 }}
          >
            <LineChart className="h-10 w-10 text-emerald-600 mb-4" />
            <h3 className="font-bold text-lg">Analytics</h3>
            <p className="text-sm text-gray-600 mt-2">
              View charts and reports to optimize shopping and reduce waste.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Start Reducing Waste Today</h2>
        <p className="mb-6">Sign up now and make your fridge smarter with Fridgella.</p>
        <Link
          to="/register"
          className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

export default Home;
