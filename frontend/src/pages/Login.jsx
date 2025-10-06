import React, { useState } from "react";
import FormInput from "../Components/FormInput";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // general error message
  const navigate = useNavigate();

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // <-- store user info

      // Call App.jsx handler to update login state
      if (handleLogin) handleLogin(token, user);

      setIsLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
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
          <h2 className="text-xl font-semibold text-white mt-2">Welcome back</h2>
          <p className="text-emerald-100 mt-1">Sign in to continue to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-8 py-6">
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            helperText="Enter a valid email address"
          />

          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            helperText="Minimum 8 chars, 1 uppercase, 1 number, 1 special char"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </motion.button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
          >
            Register now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
