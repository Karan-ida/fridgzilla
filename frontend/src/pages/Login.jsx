import React, { useState } from "react";
import FormInput from "../Components/FormInput";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, Shield, Sparkles, ChefHat } from "lucide-react";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      localStorage.setItem("user", JSON.stringify(user));

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="space-y-8">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                  Fridgzilla
                </h1>
                <p className="text-slate-600 text-sm">Smart Food Management</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Welcome back to smarter food management
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: "Track expiry dates automatically" },
                  { icon: Shield, text: "Secure and private data storage" },
                  { icon: ChefHat, text: "Reduce food waste with smart insights" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <item.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100">
              <p className="text-slate-600 italic mb-4">
                "Fridgzilla helped me reduce my food waste by 40%! The expiry reminders are a lifesaver."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Sarah Johnson</p>
                  <p className="text-sm text-slate-500">Home Cook</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Form Header */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 py-8 px-8 text-center">
              <div className="absolute top-4 right-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                  <Sparkles className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-medium">Welcome back!</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Sign In</h2>
                <p className="text-emerald-100">Continue your food management journey</p>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={onSubmit} className="px-8 py-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Must contain 8+ chars, 1 uppercase, 1 number, 1 special char
                  </p>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded-md transition-all duration-300 ${
                        rememberMe 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'bg-white border-slate-300'
                      }`}>
                        {rememberMe && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 text-white mt-0.5 ml-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-slate-700">Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Sign In to Dashboard</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-6 rounded-b-3xl border-t border-slate-100">
              <div className="text-center text-slate-600">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-slate-500">
                <Shield className="h-3 w-3" />
                <span>Your data is securely encrypted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;