// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import ItemCard from "./Components/ItemCard.jsx";
import NotificationCard from "./Components/NotificationCard.jsx";
import FormInput from "./Components/FormInput.jsx";
import BillUpload from "./Components/BillUpload.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";


const App = () => {
  // Sample data to test components
  const sampleItem = {
    name: "Apple",
    quantity: 5,
    expiryDate: "2025-09-15",
  };

  const sampleNotification = {
    message: "Your bananas are expiring soon!",
    date: "2025-09-12T10:30:00",
  };

  const [inputValue, setInputValue] = React.useState("");

  return (
     <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar appears on all pages */}
        <Navbar />

        {/* Page content */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload-bill" element={<BillUpload />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
      );
};

export default App;
