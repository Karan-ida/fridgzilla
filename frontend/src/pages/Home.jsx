import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Upload, 
  Bell, 
  BarChart3, 
  LineChart, 
  Scan, 
  Calendar,
  Shield,
  Sparkles,
  ChefHat,
  Leaf,
  Settings
} from "lucide-react";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    // Check login status
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Scan className="h-12 w-12" />,
      title: "Smart Scanning",
      description: "Scan receipts or product images to automatically add items with AI-powered recognition",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Bell className="h-12 w-12" />,
      title: "Smart Reminders",
      description: "Get timely alerts before your fruits, vegetables, and dairy products expire",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Settings className="h-12 w-12" />,
      title: "Fridge Maintenance Tips",
      description: "Get expert tips on optimal storage conditions and fridge organization to extend product freshness",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Leaf className="h-12 w-12" />,
      title: "Waste Analytics",
      description: "Track your food savings and environmental impact with detailed reports",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { value: "30%", label: "Average Food Waste Reduction" },
    { value: "50+", label: "Products Supported" },
    { value: "24/7", label: "Smart Monitoring" },
    { value: "95%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Smart Food Management</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent">
                Never Waste
              </span>
              <br />
              <span className="text-slate-800">Food Again</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track your groceries, get smart expiry reminders, and reduce food waste with AI-powered insights. 
              Perfect for fruits, vegetables, milk, and all your perishables.
            </p>

            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <Sparkles className="h-5 w-5" />
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200 rounded-full blur-xl opacity-30"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-200 rounded-full blur-xl opacity-20"></div>
        <div className="absolute bottom-10 left-20 w-24 h-24 bg-emerald-300 rounded-full blur-xl opacity-40"></div>
      </section>

      {/* Animated Feature Showcase */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Smart Food Management
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage your groceries efficiently and reduce food waste
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Display */}
            <div className="relative h-96">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl shadow-2xl p-8 flex flex-col justify-center ${
                    currentFeature === index ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-500`}
                >
                  <div className="text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    currentFeature === index
                      ? "bg-white shadow-2xl border-2 border-emerald-200 scale-105"
                      : "bg-slate-100/50 hover:bg-white hover:shadow-lg"
                  }`}
                  onMouseEnter={() => setCurrentFeature(index)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Simple steps to smarter food management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Add Items", desc: "Scan receipts, upload images, or manually enter your groceries" },
              { step: "02", title: "Track Expiry", desc: "Get automatic expiry dates and smart reminders" },
              { step: "03", title: "Reduce Waste", desc: "Use analytics and maintenance tips to minimize food waste" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!isLoggedIn && (
        <section className="py-20 bg-gradient-to-r from-slate-900 to-emerald-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Kitchen?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are saving money and reducing food waste with Fridgzilla
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              </div>
              <div className="flex items-center justify-center space-x-4 mt-6 text-slate-400">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Secure • Private • No Credit Card Required</span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

       {/* Footer */}
            <footer className="bg-slate-800 text-white py-12 px-6 mt-auto">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Brand */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-lg">
                        <ChefHat className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xl font-bold">Fridgzilla</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Smart food management system to reduce waste and keep your kitchen organized.
                    </p>
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>Secure • Private • Reliable</span>
                    </div>
                  </div>
      
                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Features</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-center space-x-2">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        <span>Expiry Tracking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        <span>Smart Reminders</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        <span>Bill Scanning</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        <span>Waste Analytics</span>
                      </li>
                    </ul>
                  </div>
      
                  {/* Support */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Support</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                    </ul>
                  </div>
      
                  {/* Legal */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Data Protection</a></li>
                    </ul>
                  </div>
                </div>
      
                {/* Bottom Bar */}
                <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-slate-400 text-sm">
                    © 2024 Fridgzilla. All rights reserved.
                  </p>
                  <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">Facebook</a>
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
  );
};

export default Home;