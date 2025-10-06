import React, { useState } from "react";
import FormInput from "../Components/FormInput";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  // Regex patterns
  const nameRegex = /^[A-Za-z\s]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const phoneRegex = /^[0-9]{10,15}$/; 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!nameRegex.test(name)) {
      setError("Name must be 3–50 letters only.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be 10–15 digits.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone,
        password,
      });

      console.log("Registered user:", response.data);

      setIsLoading(false);

      // ✅ After successful register → go to login
      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-6 px-6 text-center">
          <h1 className="text-3xl font-bold text-white">Fridgella</h1>
          <h2 className="text-xl font-semibold text-white mt-2">Create your account</h2>
          <p className="text-emerald-100 mt-1">
            Join us to manage your kitchen efficiently
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="px-8 py-6">
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          <FormInput
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            helperText="3–50 letters, no numbers or special characters"
          />

          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            helperText="Must be a valid email address"
          />

          <FormInput
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
            helperText="10–15 digits"
          />

          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            required
            helperText="Minimum 8 chars, 1 uppercase, 1 number, 1 special char"
          />

          <FormInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />

          <div className="flex items-center mt-4">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Terms and Conditions
              </a>
            </label>
          </div>

          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </motion.button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
