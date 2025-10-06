// src/Components/BillUpload.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tesseract from "tesseract.js";
import axios from "axios";
import ItemCard from "./ItemCard";
import produceData from "../data/produce";

const BillUpload = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [manualPurchaseDate, setManualPurchaseDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");

  const token = localStorage.getItem("token");

  const PRODUCE = [
    ...produceData.fruits.map(f => ({ name: f.name, shelfLifeDays: f.shelfLifeDays, category: "Fruit" })),
    ...produceData.vegetables.map(v => ({ name: v.name, shelfLifeDays: v.shelfLifeDays, category: "Vegetable" })),
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

  // Fetch all items for the user
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setItems(res.data.items);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, [token]);

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
          const res = await axios.post(
            "http://localhost:5000/api/items/bill",
            { items: parsedItems },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) setItems(prev => [...prev, ...res.data.items]);
        } catch (err) {
          console.error("Error saving bill items:", err);
        }

        setLoading(false);
        setProgress(100);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
            smsNotified: false, // track SMS status
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  // Manual entry handler
  const handleAddManual = async () => {
    if (!manualName || !manualPurchaseDate) return;

    const foundProduce = PRODUCE.find(p => p.name.toLowerCase() === manualName.toLowerCase());
    const category = foundProduce ? foundProduce.category : "Other";
    const expiryDate = calculateExpiry(new Date(manualPurchaseDate), manualName);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/items/manual",
        {
          name: manualName,
          quantity: manualQty,
          expiryDate,
          category,
          purchaseDate: new Date(manualPurchaseDate),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setItems(prev => [...prev, { ...res.data.item, smsNotified: false }]);
      }
    } catch (err) {
      console.error("Error adding manual item:", err);
    }

    // Reset fields
    setManualName("");
    setManualQty(1);
    setManualPurchaseDate("");
    setSuggestions([]);
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Quantity,PurchaseDate,ExpiryDate,Category,SMS Notified",
        ...items.map(i =>
          `${i.name},${i.quantity},${new Date(i.purchaseDate).toLocaleDateString()},${i.expiryDate ? new Date(i.expiryDate).toLocaleDateString() : ""},${i.category},${i.smsNotified ? "Yes" : "No"}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fridge-items.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Count pending notifications
  const pendingNotifications = items.filter(item => !item.smsNotified && new Date(item.expiryDate) - new Date() <= 24 * 60 * 60 * 1000).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-6 px-6 text-center relative">
            <h1 className="text-2xl font-bold text-white">Upload Grocery Bill</h1>
            <p className="text-emerald-100 mt-2">Add items by scanning receipt or manual entry</p>

            {/* Pending Notifications Badge */}
            {pendingNotifications > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {pendingNotifications} Pending SMS
              </div>
            )}
          </div>

          <div className="flex border-b">
            <button className={`flex-1 py-4 font-medium ${activeTab === "upload" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`} onClick={() => setActiveTab("upload")}>Scan Receipt</button>
            <button className={`flex-1 py-4 font-medium ${activeTab === "manual" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`} onClick={() => setActiveTab("manual")}>Manual Entry</button>
          </div>

          <div className="p-6">
            {activeTab === "upload" ? (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50">
                  <label className="mt-4 inline-block bg-emerald-500 text-white px-4 py-2 rounded-md cursor-pointer">
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
                </div>
                {file && (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleUpload} disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-md">
                    {loading ? `Processing... ${progress}%` : "Scan Receipt"}
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="space-y-4 relative">
                <input type="text" placeholder="Item Name" value={manualName} onChange={e => setManualName(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                {suggestions.length > 0 && (
                  <div className="absolute bg-white border rounded-md shadow-lg mt-1 w-full z-50 max-h-60 overflow-auto">
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setManualName(s.name);
                          setManualQty(1);
                          setSuggestions([]);
                        }}
                      >
                        {s.name} ({s.category})
                      </div>
                    ))}
                  </div>
                )}
                <input type="number" min="1" value={manualQty} onChange={e => setManualQty(Number(e.target.value))} className="w-full px-4 py-2 border rounded-md" />
                <input type="date" value={manualPurchaseDate} onChange={e => setManualPurchaseDate(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                <motion.button onClick={handleAddManual} disabled={!manualName || !manualPurchaseDate} className="w-full bg-emerald-600 text-white py-3 rounded-md">
                  Add Item
                </motion.button>
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Your Items ({items.length})</h3>
                  <motion.button onClick={handleDownload} className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm">Export CSV</motion.button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map(item => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} layout>
                      <ItemCard item={item} onRemove={() => removeItem(item.id)} />
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
