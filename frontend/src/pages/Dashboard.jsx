import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "../Components/ItemCard";
import NotificationCard from "../Components/NotificationCard";

const Dashboard = () => {
  // Make items stateful so we can edit/delete
  const [items, setItems] = useState([
    { 
      name: "Apple", 
      quantity: 5, 
      expiryDate: "2025-09-15",
      category: "Fruit",
      addedDate: "2025-09-05"
    },
    { 
      name: "Banana", 
      quantity: 12, 
      expiryDate: "2025-09-12",
      category: "Fruit",
      addedDate: "2025-09-07"
    },
    { 
      name: "Carrot", 
      quantity: 8, 
      expiryDate: "2025-09-20",
      category: "Vegetable",
      addedDate: "2025-09-08"
    },
    { 
      name: "Milk", 
      quantity: 1, 
      expiryDate: "2025-09-10",
      category: "Dairy",
      addedDate: "2025-09-09"
    },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(1);
  const [editExpiry, setEditExpiry] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'expiring', 'categories'

  const notifications = [
    { 
      message: "Your bananas are expiring in 2 days!", 
      date: "2025-09-10T10:30:00",
      type: "warning",
      read: false
    },
    { 
      message: "You added new items to your fridge.", 
      date: "2025-09-10T08:00:00",
      type: "info",
      read: true
    },
    { 
      message: "Milk will expire tomorrow!", 
      date: "2025-09-09T16:45:00",
      type: "urgent",
      read: false
    },
  ];

  // Filter items based on active tab
  const filteredItems = items.filter(item => {
    if (activeTab === "expiring") {
      const today = new Date();
      const expiryDate = new Date(item.expiryDate);
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    }
    return true;
  });

  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];

  // Delete item
  const handleDelete = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Start editing
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditName(items[index].name);
    setEditQty(items[index].quantity);
    setEditExpiry(items[index].expiryDate);
  };

  // Save edited item
  const handleSave = () => {
    if (editIndex === null) return;

    const updatedItems = [...items];
    updatedItems[editIndex] = {
      ...updatedItems[editIndex],
      name: editName,
      quantity: editQty,
      expiryDate: editExpiry
    };
    setItems(updatedItems);
    setEditIndex(null);
  };

  // Calculate stats
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const expiringItems = items.filter(item => {
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your fridge inventory and stay updated</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-white rounded-lg p-3 shadow-sm mr-4">
                <div className="text-2xl font-bold text-emerald-600">{totalItems}</div>
                <div className="text-xs text-gray-500">Total Items</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-orange-500">{expiringItems}</div>
                <div className="text-xs text-gray-500">Expiring Soon</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2">
              {/* Items Section */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-4 px-6">
                  <h2 className="text-xl font-semibold text-white">Your Fridge Items</h2>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    className={`flex-1 py-3 font-medium ${activeTab === 'all' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Items
                  </button>
                  <button
                    className={`flex-1 py-3 font-medium ${activeTab === 'expiring' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('expiring')}
                  >
                    Expiring Soon
                  </button>
                </div>

                <div className="p-6">
                  {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {filteredItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            layout
                          >
                            {editIndex === index ? (
                              <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-2"
                                  placeholder="Item name"
                                />
                                <input
                                  type="number"
                                  min="1"
                                  value={editQty}
                                  onChange={(e) => setEditQty(Number(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-2"
                                  placeholder="Quantity"
                                />
                                <input
                                  type="date"
                                  value={editExpiry}
                                  onChange={(e) => setEditExpiry(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-3"
                                />
                                <div className="flex space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm"
                                  >
                                    Save
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setEditIndex(null)}
                                    className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm"
                                  >
                                    Cancel
                                  </motion.button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <ItemCard item={item} />
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEdit(index)}
                                    className="bg-blue-500 text-white p-1 rounded-md"
                                    title="Edit item"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(index)}
                                    className="bg-red-500 text-white p-1 rounded-md"
                                    title="Delete item"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </motion.button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-gray-500 mt-2">No items found</p>
                      <p className="text-sm text-gray-400">Add items to your fridge to see them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              {/* Notifications Section */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-4 px-6">
                  <h2 className="text-xl font-semibold text-white">Notifications</h2>
                </div>
                <div className="p-6">
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <NotificationCard notification={notification} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="text-gray-500 mt-2">No notifications</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-4 px-6">
                  <h2 className="text-xl font-semibold text-white">Categories</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {categories.map((category, index) => {
                      const count = items.filter(item => item.category === category).length;
                      return (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{category}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                            {count} items
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;