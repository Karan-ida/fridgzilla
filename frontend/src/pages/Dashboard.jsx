// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "../Components/ItemCard";
import axios from "axios";
import { 
  FaClock, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaExclamationCircle,
  FaSearch
} from "react-icons/fa";
import { 
  ChefHat, 
  AlertTriangle, 
  RefreshCw,
  Filter,
  Shield,
  Sparkles
} from "lucide-react";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allItems = res.data.items || [];
      setItems(allItems);
    } catch (err) {
      console.error("❌ Error fetching items:", err);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error("❌ Error deleting item:", err);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/items/${editItem.id}`,
        {
          name: editItem.name,
          quantity: editItem.quantity,
          expiryDate: editItem.expiryDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchItems();
      setEditItem(null);
    } catch (err) {
      console.error("❌ Error updating item:", err);
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: "unknown", text: "No Date", color: "bg-gray-100 text-gray-600", icon: <FaBox className="text-gray-500" /> };
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { 
      status: "expired", 
      text: "Expired", 
      color: "bg-red-50 text-red-700 border border-red-200",
      icon: <FaExclamationCircle className="text-red-500" />
    };
    if (diffDays <= 3) return { 
      status: "expiring", 
      text: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`, 
      color: "bg-orange-50 text-orange-700 border border-orange-200",
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />
    };
    return { 
      status: "valid", 
      text: `${diffDays} days left`, 
      color: "bg-emerald-50 text-emerald-700 border border-emerald-200 ",
      icon: <FaCheckCircle className="text-emerald-500" />
    };
  };

  const filteredItems = items.filter((item) => {
    const status = getExpiryStatus(item.expiryDate).status;
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "expiring") return status === "expiring" && matchesSearch;
    if (activeTab === "expired") return status === "expired" && matchesSearch;
    if (activeTab === "valid") return status === "valid" && matchesSearch;
    return matchesSearch;
  });

  const stats = [
    {
      label: "Total Products",
      value: items.length,
      color: "from-blue-500 to-cyan-500",
      icon: <FaBox className="h-6 w-6 text-white" />
    },
    {
      label: "Expiring Soon",
      value: items.filter(item => getExpiryStatus(item.expiryDate).status === "expiring").length,
      color: "from-orange-500 to-amber-500",
      icon: <FaClock className="h-6 w-6 text-white" />
    },
    {
      label: "Expired Items",
      value: items.filter(item => getExpiryStatus(item.expiryDate).status === "expired").length,
      color: "from-red-500 to-pink-500",
      icon: <FaExclamationTriangle className="h-6 w-6 text-white" />
    },
    {
      label: "Fresh Items",
      value: items.filter(item => getExpiryStatus(item.expiryDate).status === "valid").length,
      color: "from-emerald-500 to-green-500",
      icon: <FaCheckCircle className="h-6 w-6 text-white" />
    }
  ];

  const tabs = [
    { key: "all", label: "All Items", icon: <FaBox className="h-4 w-4" />, count: items.length },
    { key: "expiring", label: "Expiring Soon", icon: <FaClock className="h-4 w-4" />, count: items.filter(item => getExpiryStatus(item.expiryDate).status === "expiring").length },
    { key: "expired", label: "Expired", icon: <FaExclamationTriangle className="h-4 w-4" />, count: items.filter(item => getExpiryStatus(item.expiryDate).status === "expired").length },
    { key: "valid", label: "Fresh", icon: <FaCheckCircle className="h-4 w-4" />, count: items.filter(item => getExpiryStatus(item.expiryDate).status === "valid").length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 flex flex-col">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Product Name */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchItems}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-slate-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">Refresh</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-md`}>
                    {stat.icon}
                  </div>
                </div>
                {/* Gradient accent */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}></div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search items by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filter by:</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mt-6">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.key ? "bg-white/20" : "bg-slate-200"
                  }`}>
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            <AnimatePresence>
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="flex items-center gap-3 text-slate-600">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Loading your items...</span>
                  </div>
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <motion.div
                   initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
  className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mt-8" 
>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden">
                      <ItemCard item={item} />
                      {/* Action Buttons */}
                    <div className="absolute bottom-4 right-2 flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                    onClick={() => setEditItem(item)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                    >
                    Edit
                    </button>

                    <button
                     onClick={() => handleDelete(item.id)}
                     className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                    >
                     Delete
                    </button>
                    </div>

                      {/* Status Badge */}
                      <div className="absolute top-12 right-2">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getExpiryStatus(item.expiryDate).color}`}>
                          {getExpiryStatus(item.expiryDate).icon}
                          <span>{getExpiryStatus(item.expiryDate).text}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-16"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                    <FaBox className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No items found</h3>
                    <p className="text-slate-500 mb-6">
                      {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first item"}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FaPlus className="inline h-4 w-4 mr-2" />
                      Add First Item
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editItem && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Edit Item</h2>
                  <button
                    onClick={() => setEditItem(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span className="text-2xl text-slate-400">×</span>
                  </button>
                </div>
                <div className="space-y-4 pt-10">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Item Name</label>
                    <input
                      type="text"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Quantity</label>
                    <input
                      type="number"
                      value={editItem.quantity}
                      onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Expiry Date</label>
                    <input
                      type="date"
                      value={editItem.expiryDate?.split("T")[0] || ""}
                      onChange={(e) => setEditItem({ ...editItem, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditItem(null)}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;