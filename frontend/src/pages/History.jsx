// frontend/src/pages/History.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "../Components/ItemCard";
import axios from "axios";

const History = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", quantity: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Fetch all items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const itemsData = res.data.items || [];
      setItems(itemsData);

      // Extract unique categories
      const uniqueCategories = [...new Set(itemsData.map(item => item.category || "Uncategorized"))];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (err) {
      console.error("Error loading items", err);
      setLoading(false);
    }
  };

  // Filter and sort items whenever dependencies change
  useEffect(() => {
    const today = new Date();
    let filtered = [...items];

    // Expiry filter
    if (expiryFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (!item.expiryDate) return false;
        const exp = new Date(item.expiryDate);
        if (expiryFilter === "expired") return exp < today;
        if (expiryFilter === "valid") return exp >= today;
        return true;
      });
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => (item.category || "Uncategorized") === categoryFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") return new Date(a.expiryDate) - new Date(b.expiryDate);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "quantity") return b.quantity - a.quantity;
      return 0;
    });

    setFilteredItems(filtered);
  }, [items, expiryFilter, categoryFilter, sortBy]);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/items/${editingItem.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
      setEditingItem(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: "unknown", text: "No Date", color: "bg-gray-200 text-gray-800" };
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { status: "expired", text: "Expired", color: "bg-red-100 text-red-800" };
    if (diffDays <= 3) return { status: "soon", text: "Expiring soon", color: "bg-orange-100 text-orange-800" };
    return { status: "valid", text: "Valid", color: "bg-green-100 text-green-800" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <p className="text-gray-500 text-lg">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Item History</h1>
          <p className="text-gray-600 mb-6">Manage and track your food items</p>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-md mb-8 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Status</label>
              <div className="flex flex-wrap gap-2">
                {["all", "valid", "expired"].map(f => (
                  <button key={f} onClick={() => setExpiryFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium ${expiryFilter === f ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="all">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="date">Expiry Date</option>
                <option value="name">Name</option>
                <option value="quantity">Quantity</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-6">No items found.</p>
              ) : (
                filteredItems.map(item => {
                  const status = getExpiryStatus(item.expiryDate);
                  return (
                    <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="border rounded-lg overflow-hidden shadow hover:shadow-md">
                      <ItemCard item={item} showDetails />

                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
