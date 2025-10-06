// frontend/src/Components/BillUpload.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tesseract from "tesseract.js";
import axios from "axios";
import produceData from "../data/produce";

const BillUpload = () => {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "manual"
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [manualPurchaseDate, setManualPurchaseDate] = useState("");
  const [manualCategory, setManualCategory] = useState("Fruit");
  const [suggestions, setSuggestions] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" }); // type: success or error

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
    if (selectedFile) setFile(selectedFile);
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
    setTimeout(() => setToast({ message: "", type: "" }), 4000); // disappears after 4 seconds
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-6 px-6 text-center relative">
            <h1 className="text-2xl font-bold text-white">Grocery Bill Manager</h1>
            <p className="text-emerald-100 mt-2">Scan your receipt or add items manually</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "upload" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("upload")}
            >
              Scan Receipt
            </button>
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "manual" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Entry
            </button>
          </div>

          <div className="p-6">
            {/* Scan Receipt Tab */}
            {activeTab === "upload" && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50">
                  <label className="mt-4 inline-block bg-emerald-500 text-white px-4 py-2 rounded-md cursor-pointer">
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
                </div>
                {file && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-md"
                  >
                    {loading ? `Processing... ${progress}%` : "Scan Receipt"}
                  </motion.button>
                )}
              </div>
            )}

            {/* Manual Entry Tab */}
            {activeTab === "manual" && (
              <div className="space-y-4 relative">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                {suggestions.length > 0 && (
                  <div className="absolute bg-white border rounded-md shadow-lg mt-1 w-full z-50 max-h-60 overflow-auto">
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setManualName(s.name);
                          setManualQty(1);
                          setManualCategory(s.category);
                          setSuggestions([]);
                        }}
                      >
                        {s.name} ({s.category})
                      </div>
                    ))}
                  </div>
                )}

                <select value={manualCategory} onChange={e => setManualCategory(e.target.value)} className="w-full px-4 py-2 border rounded-md">
                  <option value="Fruit">Fruit</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="number"
                  min="1"
                  value={manualQty}
                  onChange={e => setManualQty(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <input
                  type="date"
                  value={manualPurchaseDate}
                  onChange={e => setManualPurchaseDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />

                <motion.button
                  onClick={handleAddManual}
                  disabled={!manualName || !manualPurchaseDate}
                  className="w-full bg-emerald-600 text-white py-3 rounded-md"
                >
                  Add Item
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      {toast.message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-md text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
};

export default BillUpload;
