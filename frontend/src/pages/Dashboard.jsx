// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "../Components/ItemCard";
import axios from "axios";
import { FaClock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Combine manual and uploaded items
      const allItems = res.data.items || [];
      setItems(allItems);
    } catch (err) {
      console.error("❌ Error fetching items:", err);
      setItems([]);
    } finally {
      setLoading(false);
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
    if (!expiryDate) return { status: "unknown", text: "No Date", color: "bg-gray-200 text-gray-800" };
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { status: "expired", text: "Expired", color: "bg-red-100 text-red-800" };
    if (diffDays <= 3) return { status: "expiring", text: "Expiring Soon", color: "bg-orange-100 text-orange-800" };
    return { status: "valid", text: "Valid", color: "bg-green-100 text-green-800" };
  };

  const filteredItems = items.filter((item) => {
    const status = getExpiryStatus(item.expiryDate).status;
    if (activeTab === "all") return true;
    if (activeTab === "expiring") return status === "expiring";
    if (activeTab === "expired") return status === "expired";
    return true;
  });

  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const expiringCount = items.filter((item) => getExpiryStatus(item.expiryDate).status === "expiring").length;
  const expiredCount = items.filter((item) => getExpiryStatus(item.expiryDate).status === "expired").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <h1 className="text-4xl font-extrabold text-emerald-800">🧊 Smart Fridge Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Track your items, expiry dates & keep food fresh!</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-emerald-600">{totalItems}</div>
            <div className="text-sm text-gray-500 mt-2">Total Items</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-orange-500">{expiringCount}</div>
            <div className="text-sm text-gray-500 mt-2">Expiring Soon</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-red-600">{expiredCount}</div>
            <div className="text-sm text-gray-500 mt-2">Expired Items</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {[{ key: "all", label: "All Items", icon: <FaCheckCircle /> }, { key: "expiring", label: "Expiring Soon", icon: <FaClock /> }, { key: "expired", label: "Expired", icon: <FaExclamationTriangle /> }].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition-all ${activeTab === tab.key ? "bg-emerald-600 text-white scale-105" : "bg-white text-gray-600 hover:bg-emerald-100"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              <p className="text-gray-500">Loading items...</p>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative">
                  <ItemCard item={item} />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => setEditItem(item)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow">✏️</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">🗑️</button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-12">No items found</p>
            )}
          </AnimatePresence>
        </div>

        {/* Edit Modal */}
        {editItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Item</h2>
              <input type="text" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="border rounded p-2 w-full mb-3" />
              <input type="number" value={editItem.quantity} onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })} className="border rounded p-2 w-full mb-3" />
              <input type="date" value={editItem.expiryDate?.split("T")[0] || ""} onChange={(e) => setEditItem({ ...editItem, expiryDate: e.target.value })} className="border rounded p-2 w-full mb-4" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditItem(null)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
