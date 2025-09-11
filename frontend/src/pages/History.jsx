import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ItemCard from "../Components/ItemCard";

const History = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); // all, consumed, expired, donated
  const [dateRange, setDateRange] = useState("all"); // all, week, month, year
  const [sortBy, setSortBy] = useState("date"); // date, name, category

  // Sample historical data (replace with your actual data source)
  const sampleItems = [
    { 
      name: "Apple", 
      quantity: 5, 
      expiryDate: "2025-09-15",
      category: "Fruit",
      addedDate: "2025-09-05",
      status: "consumed",
      consumedDate: "2025-09-12"
    },
    { 
      name: "Banana", 
      quantity: 12, 
      expiryDate: "2025-09-12",
      category: "Fruit",
      addedDate: "2025-09-07",
      status: "expired",
      removedDate: "2025-09-13"
    },
    { 
      name: "Carrot", 
      quantity: 8, 
      expiryDate: "2025-09-20",
      category: "Vegetable",
      addedDate: "2025-09-08",
      status: "donated",
      removedDate: "2025-09-15"
    },
    { 
      name: "Milk", 
      quantity: 1, 
      expiryDate: "2025-09-10",
      category: "Dairy",
      addedDate: "2025-09-09",
      status: "consumed",
      consumedDate: "2025-09-10"
    },
    { 
      name: "Bread", 
      quantity: 1, 
      expiryDate: "2025-09-08",
      category: "Bakery",
      addedDate: "2025-09-05",
      status: "expired",
      removedDate: "2025-09-09"
    },
    { 
      name: "Yogurt", 
      quantity: 4, 
      expiryDate: "2025-09-14",
      category: "Dairy",
      addedDate: "2025-09-10",
      status: "consumed",
      consumedDate: "2025-09-13"
    },
  ];

  // Fetch historical items
  useEffect(() => {
    // Replace this with your backend API call
    const storedItems = JSON.parse(localStorage.getItem("historicalItems")) || sampleItems;
    setItems(storedItems);
    setFilteredItems(storedItems);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...items];
    
    // Status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(item => item.status === activeFilter);
    }
    
    // Date range filter
    const now = new Date();
    if (dateRange !== "all") {
      const days = dateRange === "week" ? 7 : dateRange === "month" ? 30 : 365;
      const cutoffDate = new Date(now.setDate(now.getDate() - days));
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.removedDate || item.consumedDate || item.addedDate);
        return itemDate >= cutoffDate;
      });
    }
    
    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.removedDate || a.consumedDate || a.addedDate);
      const dateB = new Date(b.removedDate || b.consumedDate || b.addedDate);
      
      if (sortBy === "date") {
        return dateB - dateA; // Newest first
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return a.category.localeCompare(b.category);
      }
    });
    
    setFilteredItems(filtered);
  }, [items, activeFilter, dateRange, sortBy]);

  // Get stats for summary cards
  const getStats = () => {
    const totalItems = items.length;
    const consumed = items.filter(item => item.status === "consumed").length;
    const expired = items.filter(item => item.status === "expired").length;
    const donated = items.filter(item => item.status === "donated").length;
    
    return { totalItems, consumed, expired, donated };
  };

  const stats = getStats();

  const getStatusBadge = (status) => {
    const statusConfig = {
      consumed: { color: "bg-green-100 text-green-800", text: "Consumed" },
      expired: { color: "bg-red-100 text-red-800", text: "Expired" },
      donated: { color: "bg-blue-100 text-blue-800", text: "Donated" }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
        {statusConfig[status].text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Reports & History</h1>
            <p className="text-gray-600 mt-2">Track your food consumption and waste reduction progress</p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <div className="text-2xl font-bold text-emerald-600">{stats.totalItems}</div>
              <div className="text-sm text-gray-500">Total Items</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <div className="text-2xl font-bold text-green-600">{stats.consumed}</div>
              <div className="text-sm text-gray-500">Consumed</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
              <div className="text-sm text-gray-500">Expired</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <div className="text-2xl font-bold text-blue-600">{stats.donated}</div>
              <div className="text-sm text-gray-500">Donated</div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-4 px-6">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {["all", "consumed", "expired", "donated"].map(status => (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeFilter === status 
                          ? "bg-emerald-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Time</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                </select>
              </div>
              
              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="date">Date (Newest)</option>
                  <option value="name">Name</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-4 px-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Historical Items ({filteredItems.length})
              </h2>
              <span className="text-emerald-100 text-sm">
                {activeFilter !== "all" ? `Filtered by: ${activeFilter}` : "Showing all items"}
              </span>
            </div>
            
            <div className="p-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-500 mt-4">No items found</h3>
                  <p className="text-gray-400">Try adjusting your filters to see more results</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <ItemCard item={item} showDetails />
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          {getStatusBadge(item.status)}
                          <span className="text-xs text-gray-500">
                            {new Date(item.removedDate || item.consumedDate || item.addedDate).toLocaleDateString()}
                          </span>
                        </div>
                        {item.status === "consumed" && item.consumedDate && (
                          <p className="text-xs text-gray-600 mt-2">
                            Consumed on: {new Date(item.consumedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;