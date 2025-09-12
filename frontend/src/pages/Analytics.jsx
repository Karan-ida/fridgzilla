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
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

const Analytics = () => {
  const [items, setItems] = useState([]);
  const [timeRange, setTimeRange] = useState("month"); // week, month, year
  const [activeTab, setActiveTab] = useState("overview"); // overview, trends, categories

  // Sample data for demonstration
  const sampleItems = [
    { name: "Apple", quantity: 5, expiryDate: "2025-09-15", category: "Fruit", addedDate: "2025-09-05" },
    { name: "Banana", quantity: 12, expiryDate: "2025-09-12", category: "Fruit", addedDate: "2025-09-07" },
    { name: "Carrot", quantity: 8, expiryDate: "2025-09-20", category: "Vegetable", addedDate: "2025-09-08" },
    { name: "Milk", quantity: 1, expiryDate: "2025-09-10", category: "Dairy", addedDate: "2025-09-09" },
    { name: "Bread", quantity: 1, expiryDate: "2025-09-08", category: "Bakery", addedDate: "2025-09-05" },
    { name: "Yogurt", quantity: 4, expiryDate: "2025-09-14", category: "Dairy", addedDate: "2025-09-10" },
    { name: "Cheese", quantity: 2, expiryDate: "2025-09-18", category: "Dairy", addedDate: "2025-09-11" },
    { name: "Orange", quantity: 6, expiryDate: "2025-09-16", category: "Fruit", addedDate: "2025-09-12" },
  ];

  const historicalData = [
    { date: "2025-09-01", itemsAdded: 5, itemsExpired: 1, itemsConsumed: 8 },
    { date: "2025-09-02", itemsAdded: 3, itemsExpired: 2, itemsConsumed: 6 },
    { date: "2025-09-03", itemsAdded: 7, itemsExpired: 0, itemsConsumed: 4 },
    { date: "2025-09-04", itemsAdded: 4, itemsExpired: 1, itemsConsumed: 7 },
    { date: "2025-09-05", itemsAdded: 6, itemsExpired: 3, itemsConsumed: 5 },
    { date: "2025-09-06", itemsAdded: 2, itemsExpired: 2, itemsConsumed: 6 },
    { date: "2025-09-07", itemsAdded: 8, itemsExpired: 1, itemsConsumed: 9 },
    { date: "2025-09-08", itemsAdded: 5, itemsExpired: 0, itemsConsumed: 7 },
    { date: "2025-09-09", itemsAdded: 3, itemsExpired: 2, itemsConsumed: 5 },
    { date: "2025-09-10", itemsAdded: 7, itemsExpired: 1, itemsConsumed: 8 },
  ];

  useEffect(() => {
    // Fetch items from backend or localStorage
    const stored = localStorage.getItem("items");
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(sampleItems);
    }
  }, []);

  // Analytics data calculations
  const expiryData = items.map((item) => ({
    name: item.name,
    daysLeft: Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
    category: item.category
  }));

  const quantityData = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    category: item.category
  }));

  const categoryData = Object.values(
    items.reduce((acc, item) => {
      const cat = item.category || "Other";
      acc[cat] = acc[cat] || { name: cat, value: 0, items: 0 };
      acc[cat].value += item.quantity;
      acc[cat].items += 1;
      return acc;
    }, {})
  );

  const consumptionData = [
    { day: "Mon", consumed: 12, wasted: 2 },
    { day: "Tue", consumed: 18, wasted: 1 },
    { day: "Wed", consumed: 15, wasted: 3 },
    { day: "Thu", consumed: 20, wasted: 2 },
    { day: "Fri", consumed: 16, wasted: 4 },
    { day: "Sat", consumed: 22, wasted: 1 },
    { day: "Sun", consumed: 19, wasted: 2 },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

  // Calculate statistics
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const expiringSoon = items.filter(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3;
  }).length;
  const categoriesCount = new Set(items.map(item => item.category)).size;

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>
            <p className="text-gray-600 mt-2">Track your food consumption patterns and reduce waste</p>
          </div>

          {/* Time Range Selector */}
          <div className="bg-white rounded-xl p-4 shadow-md mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Time Range</h2>
              <div className="flex space-x-2">
                {["week", "month", "year"].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      timeRange === range
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-md text-center"
            >
              <div className="text-3xl font-bold text-emerald-600">{totalItems}</div>
              <div className="text-sm text-gray-500 mt-2">Total Items</div>
              <div className="text-xs text-emerald-500 mt-1">+12% from last week</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-md text-center"
            >
              <div className="text-3xl font-bold text-orange-500">{expiringSoon}</div>
              <div className="text-sm text-gray-500 mt-2">Expiring Soon</div>
              <div className="text-xs text-orange-500 mt-1">Need attention</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-md text-center"
            >
              <div className="text-3xl font-bold text-blue-500">{categoriesCount}</div>
              <div className="text-sm text-gray-500 mt-2">Categories</div>
              <div className="text-xs text-blue-500 mt-1">Diverse inventory</div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-8">
            <div className="flex border-b">
              {["overview", "trends", "categories"].map(tab => (
                <button
                  key={tab}
                  className={`flex-1 py-4 font-medium ${
                    activeTab === tab
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expiry Timeline */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Days Until Expiry</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expiryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="daysLeft" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Distribution */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Consumption Trends */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-md lg:col-span-2"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Consumption Pattern</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="consumed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="wasted" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Inventory Value */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-md lg:col-span-2"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="itemsAdded" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="itemsConsumed" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="itemsExpired" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Insights Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-md mt-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-800">Positive Trend</h3>
                <p className="text-sm text-emerald-700 mt-2">
                  Food waste reduced by 15% compared to last month. Keep it up!
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Consumption Pattern</h3>
                <p className="text-sm text-blue-700 mt-2">
                  Highest consumption on weekends. Plan your shopping accordingly.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800">Attention Needed</h3>
                <p className="text-sm text-orange-700 mt-2">
                  Dairy products have the shortest shelf life. Consider buying smaller quantities.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Recommendation</h3>
                <p className="text-sm text-purple-700 mt-2">
                  Try meal planning to better utilize ingredients before they expire.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;