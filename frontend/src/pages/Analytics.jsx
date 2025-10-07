// frontend/src/pages/Analytics.jsx
import React, { useEffect, useState, useMemo } from "react";
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import axios from "axios";
import {
  TrendingUp,
  Package,
  Clock,
  Layers,
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  BarChart3
} from "lucide-react";

import jsPDF from "jspdf";

const Analytics = () => {
  const [items, setItems] = useState([]);
  const [timeRange, setTimeRange] = useState("all"); // "7days", "30days", "all"

  const COLORS = [
    "#10B981", "#3B82F6", "#F59E0B", "#EF4444",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
    "#F97316", "#6366F1", "#EC4899", "#14B8A6"
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

  // Analytics calculations
  const analyticsData = useMemo(() => {
    const today = new Date();
    const filteredItems = timeRange === "all" ? items : items.filter(item => {
      const itemDate = item.createdAt ? new Date(item.createdAt) : new Date();
      const diffTime = today - itemDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return timeRange === "7days" ? diffDays <= 7 : diffDays <= 30;
    });

    const totalProducts = filteredItems.length;
    const totalQuantity = filteredItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    const expiringSoon = filteredItems.filter((item) => {
      if (!item.expiryDate) return false;
      const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
      return daysLeft <= 3 && daysLeft >= 0;
    }).length;

    const expiredItems = filteredItems.filter((item) => {
      if (!item.expiryDate) return false;
      return new Date(item.expiryDate) < today;
    }).length;

    const categoriesCount = new Set(
      filteredItems.map((item) => item.category || "Other")
    ).size;

    const expiryData = filteredItems.map((item) => ({
      name: item.name,
      daysLeft: item.expiryDate
        ? Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24))
        : null,
      status: !item.expiryDate ? "No Date" :
        Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24)) < 0 ? "Expired" :
        Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24)) <= 3 ? "Expiring Soon" : "Fresh"
    }));

    const categoryData = Object.values(
      filteredItems.reduce((acc, item) => {
        const cat = item.category || "Other";
        if (!acc[cat]) {
          acc[cat] = { name: cat, itemCount: 0, totalQuantity: 0 };
        }
        acc[cat].itemCount += 1;
        acc[cat].totalQuantity += Number(item.quantity || 0);
        return acc;
      }, {})
    );

    const historicalData = Object.values(
      filteredItems.reduce((acc, item) => {
        const date = item.createdAt
          ? item.createdAt.split("T")[0]
          : new Date().toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, itemsAdded: 0, quantityAdded: 0 };
        }
        acc[date].itemsAdded += 1;
        acc[date].quantityAdded += Number(item.quantity || 0);
        return acc;
      }, {})
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    const expiryStatusData = Object.values(
      filteredItems.reduce((acc, item) => {
        let status = "No Date";
        if (item.expiryDate) {
          const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
          status = daysLeft < 0 ? "Expired" : daysLeft <= 3 ? "Expiring Soon" : "Fresh";
        }
        if (!acc[status]) {
          acc[status] = { name: status, value: 0, color:
            status === "Fresh" ? "#10B981" :
            status === "Expiring Soon" ? "#F59E0B" :
            status === "Expired" ? "#EF4444" : "#6B7280"
          };
        }
        acc[status].value += 1;
        return acc;
      }, {})
    );

    const monthlyData = Object.values(
      filteredItems.reduce((acc, item) => {
        const date = new Date(item.createdAt || new Date());
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!acc[monthYear]) {
          acc[monthYear] = { month: monthYear, items: 0, quantity: 0 };
        }
        acc[monthYear].items += 1;
        acc[monthYear].quantity += Number(item.quantity || 0);
        return acc;
      }, {})
    );

    return {
      totalProducts,
      totalQuantity,
      expiringSoon,
      expiredItems,
      categoriesCount,
      expiryData,
      categoryData,
      historicalData,
      expiryStatusData,
      monthlyData,
      filteredItems
    };
  }, [items, timeRange]);

  // Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // PDF Export
  const exportData = async () => {
    const doc = new jsPDF();
    const autoTable = (await import("jspdf-autotable")).default;

    doc.setFontSize(18);
    doc.text("Fridge Analytics Report", 14, 22);

    doc.setFontSize(12);
    const summary = [
      `Total Products: ${analyticsData.totalProducts}`,
      `Total Quantity: ${analyticsData.totalQuantity}`,
      `Expiring Soon: ${analyticsData.expiringSoon}`,
      `Expired Items: ${analyticsData.expiredItems}`,
      `Categories: ${analyticsData.categoriesCount}`
    ];
    summary.forEach((line, idx) => {
      doc.text(line, 14, 32 + idx * 8);
    });

    const columns = ["#", "Name", "Category", "Quantity", "Expiry Date"];
    const rows = analyticsData.filteredItems.map((item, index) => [
      index + 1,
      item.name,
      item.category || "Other",
      item.quantity || 0,
      item.expiryDate || "N/A"
    ]);

    autoTable(doc, {
      startY: 70,
      head: [columns],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`fridge-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const stats = [
    { label: "Total Products", value: analyticsData.totalProducts, icon: <Package className="h-6 w-6" />, color: "from-blue-500 to-cyan-500", description: "Unique items in your fridge" },
    { label: "Total Quantity", value: analyticsData.totalQuantity, icon: <Layers className="h-6 w-6" />, color: "from-purple-500 to-pink-500", description: "Total units across all items" },
    { label: "Expiring Soon", value: analyticsData.expiringSoon, icon: <Clock className="h-6 w-6" />, color: "from-orange-500 to-amber-500", description: "Items expiring in 3 days" },
    { label: "Expired Items", value: analyticsData.expiredItems, icon: <AlertTriangle className="h-6 w-6" />, color: "from-red-500 to-rose-500", description: "Items past expiry date" },
    { label: "Categories", value: analyticsData.categoriesCount, icon: <TrendingUp className="h-6 w-6" />, color: "from-green-500 to-emerald-500", description: "Different food categories" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header & Export */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
              </div>
              <p className="text-slate-600 text-lg">Track your items, categories & expiry trends</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-slate-700"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Export PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Time Range:</span>
            </div>
            <div className="flex gap-2">
              {["7days", "30days", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    timeRange === range
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {range === "7days" ? "7 Days" : range === "30days" ? "30 Days" : "All Time"}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-md`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-700">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Expiry Status & Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expiry Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5" />
                Expiry Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.expiryStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={60}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {analyticsData.expiryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
                <Package className="h-5 w-5" />
                Category Distribution (by Items)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="itemCount" name="Number of Items" radius={[4, 4, 0, 0]}>
                    {analyticsData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Expiry Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5" />
              Expiry Timeline (Days Left)
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData.expiryData.filter(item => item.daysLeft !== null)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="daysLeft" name="Days Until Expiry">
                  {analyticsData.expiryData.filter(item => item.daysLeft !== null).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.daysLeft < 0 ? "#EF4444" : entry.daysLeft <= 3 ? "#F59E0B" : "#10B981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
