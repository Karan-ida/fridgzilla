// frontend/src/pages/History.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "../Components/ItemCard";
import axios from "axios";
import { 
  Filter, 
  Search, 
  Calendar, 
  Package, 
  SortAsc, 
  RefreshCw,
  ChefHat,
  BarChart3,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Shield,
  Sparkles
} from "lucide-react";

const History = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", quantity: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Fetch all items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
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
      setRefreshing(false);
    } catch (err) {
      console.error("Error loading items", err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter and sort items whenever dependencies change
  useEffect(() => {
    const today = new Date();
    let filtered = [...items];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Expiry filter
    if (expiryFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (!item.expiryDate) return expiryFilter === "unknown";
        const exp = new Date(item.expiryDate);
        if (expiryFilter === "expired") return exp < today;
        if (expiryFilter === "expiring") {
          const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
          return diffDays <= 3 && diffDays >= 0;
        }
        if (expiryFilter === "valid") return exp >= today;
        if (expiryFilter === "unknown") return !item.expiryDate;
        return true;
      });
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => (item.category || "Uncategorized") === categoryFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === "date") {
        aValue = a.expiryDate ? new Date(a.expiryDate) : new Date(0);
        bValue = b.expiryDate ? new Date(b.expiryDate) : new Date(0);
      } else if (sortBy === "name") {
        aValue = a.name?.toLowerCase() || "";
        bValue = b.name?.toLowerCase() || "";
      } else if (sortBy === "quantity") {
        aValue = a.quantity || 0;
        bValue = b.quantity || 0;
      } else if (sortBy === "category") {
        aValue = a.category?.toLowerCase() || "uncategorized";
        bValue = b.category?.toLowerCase() || "uncategorized";
      }

      if (sortOrder === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    setFilteredItems(filtered);
  }, [items, expiryFilter, categoryFilter, sortBy, sortOrder, searchTerm]);

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
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) return;
    try {
      const token = localStorage.getItem("token");
      const deletePromises = Array.from(selectedItems).map(id =>
        axios.delete(`http://localhost:5000/api/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      await Promise.all(deletePromises);
      fetchItems();
      setSelectedItems(new Set());
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: "unknown", text: "No Date", color: "bg-slate-100 text-slate-700", icon: "❓" };
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { status: "expired", text: "Expired", color: "bg-red-50 text-red-700 border border-red-200", icon: "⚠️" };
    if (diffDays <= 3) return { status: "expiring", text: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`, color: "bg-orange-50 text-orange-700 border border-orange-200", icon: "⏳" };
    return { status: "valid", text: `${diffDays} days left`, color: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: "✅" };
  };

  const getStats = () => {
    const today = new Date();
    return {
      total: items.length,
      expired: items.filter(item => {
        if (!item.expiryDate) return false;
        return new Date(item.expiryDate) < today;
      }).length,
      expiring: items.filter(item => {
        if (!item.expiryDate) return false;
        const exp = new Date(item.expiryDate);
        const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
      }).length,
      fresh: items.filter(item => {
        if (!item.expiryDate) return false;
        return new Date(item.expiryDate) > today;
      }).length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading your items...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-xl shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                  Item History
                </h1>
              </div>
              <p className="text-slate-600 text-lg">Manage and track your food items efficiently</p>
            </div>
            
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

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Items", value: stats.total, color: "from-blue-500 to-cyan-500" },
              { label: "Fresh Items", value: stats.fresh, color: "from-emerald-500 to-green-500" },
              { label: "Expiring Soon", value: stats.expiring, color: "from-orange-500 to-amber-500" },
              { label: "Expired", value: stats.expired, color: "from-red-500 to-pink-500" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20"
              >
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
                <div className={`h-1 mt-2 bg-gradient-to-r ${stat.color} rounded-full`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Search Items</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                <Package className="h-4 w-4" />
                Category
              </label>
              <select 
                value={categoryFilter} 
                onChange={e => setCategoryFilter(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Expiry Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Status
              </label>
              <select 
                value={expiryFilter} 
                onChange={e => setExpiryFilter(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="valid">Fresh</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="unknown">No Date</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                Sort By
              </label>
              <div className="flex gap-2">
                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)} 
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                >
                  <option value="date">Expiry Date</option>
                  <option value="name">Name</option>
                  <option value="quantity">Quantity</option>
                  <option value="category">Category</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-slate-200"
                  }`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-slate-400 rounded-sm"></div>
                    <div className="bg-slate-400 rounded-sm"></div>
                    <div className="bg-slate-400 rounded-sm"></div>
                    <div className="bg-slate-400 rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-slate-200"
                  }`}
                >
                  <div className="w-4 h-4 flex flex-col gap-0.5">
                    <div className="bg-slate-400 rounded-sm h-1"></div>
                    <div className="bg-slate-400 rounded-sm h-1"></div>
                    <div className="bg-slate-400 rounded-sm h-1"></div>
                  </div>
                </button>
              </div>

              {/* Bulk Actions */}
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={selectAllItems}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="text-sm text-slate-500">
              Showing {filteredItems.length} of {items.length} items
            </div>
          </div>
        </motion.div>

        {/* Items Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-16"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                    <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No items found</h3>
                    <p className="text-slate-500">
                      {searchTerm || expiryFilter !== "all" || categoryFilter !== "all" 
                        ? "Try adjusting your filters or search terms" 
                        : "Get started by adding your first item"}
                    </p>
                  </div>
                </motion.div>
              ) : (
                filteredItems.map((item, index) => {
                  const status = getExpiryStatus(item.expiryDate);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden">
                        {/* Selection Checkbox */}
                        <div className="absolute top-10 right-4 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
                          />
                        </div>

                        <ItemCard item={item} showDetails />

                        {/* Status Badge */}
                        <div className="absolute bottom-4 right-2">
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <span>{status.icon}</span>
                            <span>{status.text}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* List View */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 text-sm font-medium text-slate-600">
              <div className="col-span-1"></div>
              <div className="col-span-3">Item</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Expiry Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const status = getExpiryStatus(item.expiryDate);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors items-center"
                  >
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
                      />
                    </div>
                    <div className="col-span-3 font-medium text-slate-800">{item.name}</div>
                    <div className="col-span-2 text-slate-600 capitalize">{item.category || "Uncategorized"}</div>
                    <div className="col-span-2 text-slate-600">{item.quantity}</div>
                    <div className="col-span-2 text-slate-600">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "No date"}
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="col-span-1 flex gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingItem && (
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
                    onClick={() => setEditingItem(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span className="text-2xl text-slate-400">×</span>
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Item Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default History;