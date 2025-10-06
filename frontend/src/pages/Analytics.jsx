// frontend/src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Analytics = () => {
  const [items, setItems] = useState([]);

  const COLORS = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
  ];

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data.items || []);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  // Summary values
  const totalProducts = items.length; // total unique products
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0); // total quantity units

  const expiringSoon = items.filter((item) => {
    if (!item.expiryDate) return false;
    const daysLeft = Math.ceil(
      (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft <= 3 && daysLeft >= 0;
  }).length;

  const categoriesCount = new Set(
    items.map((item) => item.category || "Other")
  ).size;

  // Charts data
  const expiryData = items.map((item) => ({
    name: item.name,
    daysLeft: item.expiryDate
      ? Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      : 0,
  }));

  const categoryData = Object.values(
    items.reduce((acc, item) => {
      const cat = item.category || "Other";
      acc[cat] = acc[cat] || { name: cat, value: 0 };
      acc[cat].value += Number(item.quantity || 0);
      return acc;
    }, {})
  );

  const historicalData = items.map((item) => ({
    date: item.createdAt
      ? item.createdAt.split("T")[0]
      : new Date().toISOString().split("T")[0],
    itemsAdded: Number(item.quantity || 0),
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-indigo-800">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track your items, categories & expiry trends
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-bold text-indigo-700">Total Products</h2>
            <p className="text-3xl font-extrabold mt-2">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-bold text-indigo-700">Total Quantity</h2>
            <p className="text-3xl font-extrabold mt-2">{totalQuantity}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-bold text-yellow-600">Expiring Soon</h2>
            <p className="text-3xl font-extrabold mt-2">{expiringSoon}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-bold text-green-600">Categories</h2>
            <p className="text-3xl font-extrabold mt-2">{categoriesCount}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Line Chart - Historical Data */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">📈 Items Added Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="itemsAdded"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Expiry */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">⏳ Expiry Days Left</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expiryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="daysLeft" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Categories */}
          <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">🍎 Category Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
