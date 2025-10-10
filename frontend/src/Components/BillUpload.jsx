// frontend/src/Components/BillUpload.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";
import axios from "axios";
import produceData from "../data/produce";
import { 
  Upload, 
  FileText, 
  Plus, 
  Scan, 
  CheckCircle, 
  AlertCircle,
  X,
  Camera,
  Search,
  Calendar,
  Package,
  ChefHat,
  Shield,
  Sparkles
} from "lucide-react";

const BillUpload = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");

  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [manualPurchaseDate, setManualPurchaseDate] = useState("");
  const [manualCategory, setManualCategory] = useState("Fruit");
  const [suggestions, setSuggestions] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");

  const PRODUCE = [
    ...(produceData.fruits || []).map(f => ({ name: f.name, shelfLifeDays: f.shelfLifeDays, category: "Fruit" })),
    ...(produceData.vegetables || []).map(v => ({ name: v.name, shelfLifeDays: v.shelfLifeDays, category: "Vegetable" })),
    ...(produceData.dairy || []).map(d => ({ name: d.name, shelfLifeDays: d.shelfLifeDays, category: "Dairy" })),
  ];

  const getShelfLife = (name) => {
    const found = PRODUCE.find(p => p.name.toLowerCase() === name.toLowerCase());
    return found ? found.shelfLifeDays : null;
  };

  const calculateExpiry = (purchaseDate, name) => {
    const shelf = getShelfLife(name);
    const expiry = new Date(purchaseDate);
    if (shelf) expiry.setDate(expiry.getDate() + shelf);
    return expiry;
  };

  // Auto-suggestions for manual entry
  useEffect(() => {
    if (!manualName) {
      setSuggestions([]);
      return;
    }
    const filtered = PRODUCE.filter(p => p.name.toLowerCase().includes(manualName.toLowerCase()));
    setSuggestions(filtered.slice(0, 5));
  }, [manualName]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const parseBillText = (text, today) => {
    return text
      .split("\n")
      .map(line => {
        const lower = line.toLowerCase();
        const found = PRODUCE.find(p => lower.includes(p.name.toLowerCase()));
        if (found) {
          return {
            name: found.name,
            quantity: 1,
            purchaseDate: today,
            expiryDate: calculateExpiry(today, found.name),
            category: found.category,
            smsNotified: false,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);

    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
      },
    })
      .then(async ({ data: { text } }) => {
        const today = new Date();
        const parsedItems = parseBillText(text, today);

        try {
          await axios.post(
            "http://localhost:5000/api/items/bill",
            { items: parsedItems },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          showToast("Bill items uploaded successfully!", "success");
        } catch (err) {
          console.error("Error saving bill items:", err);
          showToast("Failed to upload bill items.", "error");
        }

        setLoading(false);
        setProgress(100);
        setFile(null);
        setPreviewUrl("");
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        showToast("Error processing the file.", "error");
      });
  };

  const handleAddManual = async () => {
    if (!manualName || !manualPurchaseDate) return;

    const expiryDate = calculateExpiry(new Date(manualPurchaseDate), manualName);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/items/manual",
        {
          name: manualName,
          quantity: manualQty,
          expiryDate,
          category: manualCategory,
          purchaseDate: new Date(manualPurchaseDate),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        showToast("Item added successfully!", "success");
      }
    } catch (err) {
      console.error("Error adding manual item:", err);
      showToast("Failed to add item.", "error");
    }

    setManualName("");
    setManualQty(1);
    setManualPurchaseDate("");
    setSuggestions([]);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 flex flex-col">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 py-8 px-8 text-center">
              <div className="absolute top-4 right-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Scan className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                  <Upload className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-medium">Add Items</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Grocery Manager</h1>
                <p className="text-emerald-100">Scan your receipt or add items manually</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {[
                { key: "upload", label: "Scan Receipt", icon: <Camera className="h-4 w-4" /> },
                { key: "manual", label: "Manual Entry", icon: <Plus className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Scan Receipt Tab */}
              <AnimatePresence mode="wait">
                {activeTab === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-semibold text-slate-800">Upload Receipt</h2>
                      <p className="text-slate-600">Take a photo or upload an image of your grocery receipt</p>
                    </div>

                    <div className="border-3 border-dashed border-emerald-200 rounded-2xl p-8 text-center bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-300">
                      {previewUrl ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={previewUrl}
                              alt="Receipt preview"
                              className="max-h-64 rounded-lg shadow-md mx-auto"
                            />
                            <button
                              onClick={clearFile}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-600">{file.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-emerald-100 p-4 rounded-2xl inline-flex">
                            <Upload className="h-8 w-8 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-slate-700 font-medium">Drop your receipt here or click to browse</p>
                            <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG, PDF files</p>
                          </div>
                          <label className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                            <Camera className="h-4 w-4" />
                            Choose File
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                          </label>
                        </div>
                      )}
                    </div>

                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Progress Bar */}
                        {loading && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-600">
                              <span>Processing receipt...</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                              />
                            </div>
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleUpload}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Scanning Receipt...</span>
                            </>
                          ) : (
                            <>
                              <Scan className="h-5 w-5" />
                              <span>Scan Receipt</span>
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Manual Entry Tab */}
                {activeTab === "manual" && (
                  <motion.div
                    key="manual"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-semibold text-slate-800">Add Item Manually</h2>
                      <p className="text-slate-600">Enter your grocery item details below</p>
                    </div>

                    <div className="space-y-5">
                      {/* Item Name with Autocomplete */}
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          Item Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Apple, Milk, Carrot"
                          value={manualName}
                          onChange={e => setManualName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400"
                        />
                        <AnimatePresence>
                          {suggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 z-50 max-h-60 overflow-auto"
                            >
                              {suggestions.map((s, idx) => (
                                <div
                                  key={idx}
                                  className="px-4 py-3 cursor-pointer hover:bg-emerald-50 transition-colors border-b border-slate-100 last:border-b-0"
                                  onClick={() => {
                                    setManualName(s.name);
                                    setManualCategory(s.category);
                                    setSuggestions([]);
                                  }}
                                >
                                  <div className="font-medium text-slate-800">{s.name}</div>
                                  <div className="text-sm text-slate-500 capitalize">{s.category}</div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Category */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Category
                          </label>
                          <select
                            value={manualCategory}
                            onChange={e => setManualCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          >
                            <option value="Fruit">Fruit</option>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={manualQty}
                            onChange={e => setManualQty(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Purchase Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Purchase Date
                        </label>
                        <input
                          type="date"
                          value={manualPurchaseDate}
                          onChange={e => setManualPurchaseDate(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddManual}
                        disabled={!manualName || !manualPurchaseDate}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Item to Fridge</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed bottom-24 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
              toast.type === "success" 
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white" 
                : "bg-gradient-to-r from-red-500 to-pink-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillUpload;