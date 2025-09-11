// src/Components/BillUpload.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tesseract from "tesseract.js";
import ItemCard from "./ItemCard";
import produceData from "../data/produce";

const BillUpload = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // manual entry states
  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [manualPurchaseDate, setManualPurchaseDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");

  // flatten produce list
  const PRODUCE = [
    ...produceData.fruits.map(f => ({
      name: f.name,
      shelfLifeDays: f.shelfLifeDays,
      category: "Fruit",
    })),
    ...produceData.vegetables.map(v => ({
      name: v.name,
      shelfLifeDays: v.shelfLifeDays,
      category: "Vegetable",
    })),
  ];

  // --- Helpers ---
  const getShelfLife = (name) => {
    const lower = name.toLowerCase();
    const found = PRODUCE.find(p => p.name.toLowerCase() === lower);
    return found ? found.shelfLifeDays : null;
  };

  const calculateExpiry = (purchaseDate, name) => {
    const shelf = getShelfLife(name);
    const expiry = new Date(purchaseDate);
    if (shelf) expiry.setDate(expiry.getDate() + shelf);
    return expiry;
  };

  // --- Load items from localStorage ---
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(storedItems);
  }, []);

  // --- Save items to localStorage ---
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // --- OCR Upload ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
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
      .then(({ data: { text } }) => {
        const parsedItems = parseBillText(text);
        setItems(prev => [...prev, ...parsedItems]);
        setLoading(false);
        setProgress(100);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const parseBillText = (text) => {
    const lines = text.split("\n");
    return lines
      .map(line => {
        const lower = line.toLowerCase();
        const found = PRODUCE.find(p => lower.includes(p.name.toLowerCase()));
        if (found) {
          return {
            name: found.name,
            quantity: 1,
            expiryDate: calculateExpiry(new Date(), found.name),
            category: found.category,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  // --- Manual Entry ---
  const handleAddManual = () => {
    if (!manualName || !manualPurchaseDate) return;

    const foundProduce = PRODUCE.find(p => p.name.toLowerCase() === manualName.toLowerCase());
    const category = foundProduce ? foundProduce.category : "Other";
    const expiryDate = calculateExpiry(new Date(manualPurchaseDate), manualName);

    const newItem = {
      name: manualName,
      quantity: manualQty,
      expiryDate,
      category,
      purchaseDate: new Date(manualPurchaseDate),
    };

    setItems(prev => [...prev, newItem]);
    setManualName("");
    setManualQty(1);
    setManualPurchaseDate("");
    setSuggestions([]);
  };

  const handleNameChange = (val) => {
    setManualName(val);
    if (!val) return setSuggestions([]);
    const filtered = PRODUCE.filter(p => p.name.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
    setSuggestions(filtered);
  };

  const selectSuggestion = (name) => {
    setManualName(name);
    setSuggestions([]);
  };

  // --- Download CSV ---
  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Quantity,PurchaseDate,ExpiryDate,Category", 
       ...items.map(i => `${i.name},${i.quantity},${i.purchaseDate?.toLocaleDateString() || ""},${i.expiryDate?.toLocaleDateString() || ""},${i.category}`)].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fridgella-groceries.csv");
    document.body.appendChild(link);
    link.click();
  };

  // --- Remove Item ---
  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-white">Upload Grocery Bill</h1>
            <p className="text-emerald-100 mt-2">Add items to your fridge by scanning your receipt or entering manually</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button className={`flex-1 py-4 font-medium ${activeTab === "upload" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`} onClick={() => setActiveTab("upload")}>Scan Receipt</button>
            <button className={`flex-1 py-4 font-medium ${activeTab === "manual" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`} onClick={() => setActiveTab("manual")}>Manual Entry</button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "upload" ? (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50">
                  <label className="mt-4 inline-block bg-emerald-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-emerald-600 transition-colors">
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
                </div>

                {file && (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleUpload} disabled={loading} className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none transition-colors">
                    {loading ? `Processing... ${progress}%` : "Scan Receipt"}
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input type="text" placeholder="e.g., Apple" value={manualName} onChange={(e) => handleNameChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition" />
                    {suggestions.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                        {suggestions.map((s, idx) => (
                          <div key={idx} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectSuggestion(s.name)}>{s.name}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input type="number" min="1" value={manualQty} onChange={(e) => setManualQty(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input type="date" value={manualPurchaseDate} onChange={(e) => setManualPurchaseDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition" />
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddManual} disabled={!manualName || !manualPurchaseDate} className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md shadow-sm hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                  Add Item
                </motion.button>
              </div>
            )}

            {/* Items List */}
            {items.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Your Items ({items.length})</h3>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDownload} className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-600 transition-colors">Export CSV</motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} layout>
                      <ItemCard item={item} onRemove={() => removeItem(idx)} showDetails />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillUpload;
