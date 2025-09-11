// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <h1 className="text-4xl font-bold mb-6">Welcome to Fridgella</h1>
      <p className="text-lg mb-8">
        Keep track of your fruits and vegetables, get expiry reminders, and reduce waste!
      </p>
      <div className="space-x-4">
        <Link
          to="/register"
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="bg-white border border-green-500 text-green-500 px-6 py-3 rounded hover:bg-green-50 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
