import React, { useState } from "react";
import FormInput from "../Components/FormInput";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, Shield, Sparkles, ChefHat, Check, User, Phone, Mail } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "1 number", met: /\d/.test(password) },
    { label: "1 special character", met: /[@$!%*?&]/.test(password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-green-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Benefits */}
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
                  Fridgella
                </h1>
                <p className="text-slate-600 text-sm">Smart Food Management</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Join thousands of smart kitchens
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: "Never forget expiry dates again" },
                  { icon: Shield, text: "Reduce food waste by up to 40%" },
                  { icon: ChefHat, text: "Smart inventory tracking" },
                  { icon: Check, text: "Get alerts before food goes bad" }
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[
                { number: "40%", label: "Less Waste" },
                { number: "50+", label: "Products" },
                { number: "24/7", label: "Monitoring" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/80 rounded-xl shadow-sm border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-600">{stat.number}</div>
                  <div className="text-xs text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
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
                  <span className="text-white text-sm font-medium">Get started</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Create Account</h2>
                <p className="text-emerald-100">Start your food management journey</p>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleRegister} className="px-8 py-8">
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

              <div className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-500">3–50 letters, no numbers or special characters</p>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400"
                    required
                  />
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-500">10–15 digits</p>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
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
                  
                  {/* Password Requirements */}
                  <div className="space-y-2 mt-3">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}>
                          {req.met && <Check className="h-2 w-2 text-white" />}
                        </div>
                        <span className={req.met ? 'text-emerald-600' : 'text-slate-500'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-slate-400 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <label className="flex items-start space-x-3 cursor-pointer mt-4">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all duration-300 ${
                      agreeToTerms 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'bg-white border-slate-300'
                    }`}>
                      {agreeToTerms && (
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
                  <span className="text-sm text-slate-700 flex-1">
                    I agree to the{" "}
                    <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-6 rounded-b-3xl border-t border-slate-100">
              <div className="text-center text-slate-600">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
                  >
                    Sign in
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

export default Register;