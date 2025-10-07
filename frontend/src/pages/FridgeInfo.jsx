import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Droplets, 
  Lightbulb, 
  Shield, 
  Zap, 
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Sparkles
} from "lucide-react";

const FridgeInfo = () => {
  const [activeTab, setActiveTab] = useState("basics");

  const tabs = [
    { id: "basics", label: "Basics", icon: <BookOpen className="h-5 w-5" /> },
    { id: "maintenance", label: "Maintenance", icon: <Wrench className="h-5 w-5" /> },
    { id: "cleaning", label: "Cleaning", icon: <Droplets className="h-5 w-5" /> },
    { id: "tips", label: "Pro Tips", icon: <Lightbulb className="h-5 w-5" /> },
    { id: "troubleshooting", label: "Troubleshooting", icon: <AlertTriangle className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                Fridge Care Guide
              </h1>
            </div>
            <p className=" text-slate-600 max-w-3xl mx-auto">
              Complete guide to refrigerator maintenance, cleaning, and optimization for better food preservation and energy efficiency
            </p>
          </div>

          {/* Enhanced Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8 overflow-hidden">
            <div className="flex flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[150px] py-5 font-medium flex items-center justify-center gap-3 transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-emerald-600 bg-gradient-to-r from-emerald-50 to-green-50/50 border-b-2 border-emerald-600"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                  }`}
                >
                  {tab.icon}
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Basics Tab */}
              {activeTab === "basics" && (
                <motion.div
                  key="basics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <BookOpen className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Refrigerator Fundamentals</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          How Refrigerators Work
                        </h3>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                          Refrigerators use a refrigeration cycle to remove heat from the interior and release it outside. 
                          This process involves compression, condensation, expansion, and evaporation of refrigerant.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {[
                            { step: "Compression", desc: "Refrigerant gas is compressed" },
                            { step: "Condensation", desc: "Heat is released outside" },
                            { step: "Expansion", desc: "Pressure drops suddenly" },
                            { step: "Evaporation", desc: "Heat is absorbed inside" }
                          ].map((item, index) => (
                            <div key={index} className="bg-white/50 p-3 rounded-lg border border-blue-200">
                              <div className="font-semibold text-blue-700">{item.step}</div>
                              <div className="text-slate-600 text-xs">{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                        <h3 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                          <Thermometer className="h-5 w-5" />
                          Optimal Temperature Settings
                        </h3>
                        <div className="space-y-3">
                          {[
                            { zone: "Main Refrigerator", temp: "35°F - 38°F", desc: "Ideal for most food items" },
                            { zone: "Freezer", temp: "0°F", desc: "Prevents ice crystal formation" },
                            { zone: "Crisper Drawers", temp: "High Humidity", desc: "85-95% for vegetables" },
                            { zone: "Meat Drawer", temp: "30°F - 32°F", desc: "Extra cold for raw meat" }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white/50 rounded-lg border border-emerald-200">
                              <div>
                                <div className="font-semibold text-emerald-700">{item.zone}</div>
                                <div className="text-sm text-slate-600">{item.desc}</div>
                              </div>
                              <div className="text-lg font-bold text-emerald-600 bg-white px-3 py-1 rounded-full border border-emerald-300">
                                {item.temp}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="text-xl font-semibold text-purple-800 mb-4">Key Components</h3>
                        <div className="space-y-4">
                          {[
                            { icon: "⚙️", title: "Compressor", desc: "Heart of the system - circulates refrigerant" },
                            { icon: "🌀", title: "Evaporator Coils", desc: "Absorb heat from inside the fridge" },
                            { icon: "🌡️", title: "Condenser Coils", desc: "Release heat to the environment" },
                            { icon: "🎚️", title: "Thermostat", desc: "Monitors and controls temperature" },
                            { icon: "🚪", title: "Door Seals", desc: "Maintain airtight closure" },
                            { icon: "💨", title: "Fans", desc: "Circulate air for even cooling" }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-purple-200"
                            >
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <h4 className="font-semibold text-purple-700 mb-1">{item.title}</h4>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Maintenance Tab */}
              {activeTab === "maintenance" && (
                <motion.div
                  key="maintenance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <Wrench className="h-6 w-6 text-orange-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Maintenance Schedule</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">Regular Maintenance Tasks</h3>
                      <div className="space-y-4">
                        {[
                          { 
                            frequency: "Weekly", 
                            task: "Check temperature settings", 
                            icon: "🌡️", 
                            importance: "High",
                            benefit: "Ensures food safety"
                          },
                          { 
                            frequency: "Monthly", 
                            task: "Clean interior surfaces", 
                            icon: "🧼", 
                            importance: "Medium",
                            benefit: "Prevents odors"
                          },
                          { 
                            frequency: "Every 3 Months", 
                            task: "Defrost freezer (if needed)", 
                            icon: "❄️", 
                            importance: "High",
                            benefit: "Maintains efficiency"
                          },
                          { 
                            frequency: "Every 6 Months", 
                            task: "Clean condenser coils", 
                            icon: "🌀", 
                            importance: "High",
                            benefit: "Reduces energy use"
                          },
                          { 
                            frequency: "Every 6 Months", 
                            task: "Inspect door seals", 
                            icon: "🚪", 
                            importance: "Medium",
                            benefit: "Prevents cold air loss"
                          },
                          { 
                            frequency: "Annually", 
                            task: "Professional servicing", 
                            icon: "🔧", 
                            importance: "Medium",
                            benefit: "Extends lifespan"
                          }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <h4 className="font-semibold text-slate-800">{item.task}</h4>
                                  <p className="text-sm text-emerald-600 font-medium">{item.frequency}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.importance === "High" 
                                  ? "bg-red-100 text-red-800 border border-red-200" 
                                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              }`}>
                                {item.importance}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                              💡 {item.benefit}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                        <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Maintenance Benefits
                        </h3>
                        <div className="space-y-3">
                          {[
                            "Extends appliance lifespan by 5-10 years",
                            "Reduces energy consumption by 15-20%",
                            "Prevents costly emergency repairs",
                            "Maintains optimal food preservation",
                            "Ensures consistent temperature control",
                            "Reduces food spoilage and waste"
                          ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-green-200">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-green-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                        <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Warning Signs
                        </h3>
                        <div className="space-y-3">
                          {[
                            "Unusual noises from compressor",
                            "Frost buildup in freezer section",
                            "Temperature fluctuations",
                            "Water pooling under refrigerator",
                            "Excessive condensation",
                            "Rising energy bills",
                            "Food spoiling quickly"
                          ].map((warning, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-red-200">
                              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                              <span className="text-red-700">{warning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Cleaning Tab */}
              {activeTab === "cleaning" && (
                <motion.div
                  key="cleaning"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Droplets className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Cleaning Guide</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">Step-by-Step Cleaning Process</h3>
                      <div className="space-y-4">
                        {[
                          { step: 1, instruction: "Turn off and unplug the refrigerator", icon: "🔌", time: "2 min" },
                          { step: 2, instruction: "Remove all food items and store in cooler", icon: "📦", time: "5 min" },
                          { step: 3, instruction: "Take out shelves and drawers for separate washing", icon: "🗄️", time: "5 min" },
                          { step: 4, instruction: "Wash removable parts with warm soapy water", icon: "🧼", time: "10 min" },
                          { step: 5, instruction: "Clean interior with baking soda solution", icon: "🍶", time: "15 min" },
                          { step: 6, instruction: "Wipe door seals and handles thoroughly", icon: "🚪", time: "5 min" },
                          { step: 7, instruction: "Dry everything completely before reassembling", icon: "💨", time: "10 min" },
                          { step: 8, instruction: "Plug in and restore temperature before reloading", icon: "⚡", time: "5 min" }
                        ].map((item) => (
                          <motion.div
                            key={item.step}
                            whileHover={{ x: 5 }}
                            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {item.step}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-800 mb-1">{item.instruction}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="text-2xl">{item.icon}</span>
                                <span>⏱️ {item.time}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                        <h3 className="text-xl font-semibold text-emerald-800 mb-4">Cleaning Solutions</h3>
                        <div className="space-y-3">
                          {[
                            { solution: "Baking soda + water", ratio: "2 tbsp per quart", use: "Natural deodorizer" },
                            { solution: "Vinegar solution", ratio: "1:1 with water", use: "Disinfecting" },
                            { solution: "Mild dish soap", ratio: "Few drops in warm water", use: "General cleaning" },
                            { solution: "Lemon juice", ratio: "50/50 with water", use: "Stain removal" }
                          ].map((item, index) => (
                            <div key={index} className="bg-white/50 p-4 rounded-lg border border-emerald-200">
                              <div className="font-semibold text-emerald-700 mb-1">{item.solution}</div>
                              <div className="text-sm text-emerald-600 mb-2">{item.ratio}</div>
                              <div className="text-xs text-slate-600 bg-emerald-100 px-2 py-1 rounded-full inline-block">
                                {item.use}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4">Cleaning Frequency</h3>
                        <div className="space-y-3">
                          {[
                            { task: "Spills and stains", frequency: "Immediately", importance: "High" },
                            { task: "Interior surfaces", frequency: "Every 1-2 months", importance: "Medium" },
                            { task: "Door seals", frequency: "Monthly", importance: "High" },
                            { task: "Condenser coils", frequency: "Every 6 months", importance: "High" },
                            { task: "Drip pan", frequency: "Every 6 months", importance: "Medium" },
                            { task: "Full deep clean", frequency: "Annually", importance: "Medium" }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white/50 rounded-lg border border-amber-200">
                              <div>
                                <div className="font-medium text-amber-700">{item.task}</div>
                                <div className="text-sm text-amber-600">{item.frequency}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                item.importance === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {item.importance}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tips Tab */}
              {activeTab === "tips" && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-yellow-100 p-3 rounded-xl">
                      <Lightbulb className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Pro Tips & Best Practices</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Energy Efficiency Tips
                        </h3>
                        <div className="space-y-4">
                          {[
                            { 
                              tip: "Keep refrigerator adequately filled", 
                              savings: "15-20% energy savings",
                              details: "Use water bottles to fill empty space"
                            },
                            { 
                              tip: "Ensure proper door seal integrity", 
                              savings: "Prevents 25-30% cold air loss",
                              details: "Test with dollar bill - should resist pull"
                            },
                            { 
                              tip: "Clean condenser coils regularly", 
                              savings: "Improves efficiency by 20-25%",
                              details: "Dust buildup reduces heat transfer"
                            },
                            { 
                              tip: "Set optimal temperature settings", 
                              savings: "Saves 5-10% on energy bills",
                              details: "Every degree lower increases energy use by 2-4%"
                            },
                            { 
                              tip: "Allow hot food to cool before storing", 
                              savings: "Reduces compressor workload by 15%",
                              details: "Hot food raises internal temperature"
                            },
                            { 
                              tip: "Position away from heat sources", 
                              savings: "Maintains 10-15% better efficiency",
                              details: "Keep away from ovens, dishwashers, direct sunlight"
                            }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white/50 p-4 rounded-xl border border-purple-200"
                            >
                              <p className="font-semibold text-purple-700 mb-2">{item.tip}</p>
                              <p className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full inline-block mb-2">
                                💰 {item.savings}
                              </p>
                              <p className="text-xs text-slate-600">{item.details}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                        <h3 className="text-xl font-semibold text-cyan-800 mb-4">Food Storage Optimization</h3>
                        <div className="space-y-4">
                          {[
                            {
                              zone: "Upper Shelves",
                              items: "Ready-to-eat foods, leftovers, drinks",
                              temp: "Most consistent temperature"
                            },
                            {
                              zone: "Lower Shelves",
                              items: "Raw meat, dairy products, eggs",
                              temp: "Coldest area - best for perishables"
                            },
                            {
                              zone: "Door Shelves",
                              items: "Condiments, juices, butter",
                              temp: "Warmest area - temperature fluctuates"
                            },
                            {
                              zone: "Crisper Drawers",
                              items: "Fruits and vegetables",
                              temp: "High humidity preserves freshness"
                            },
                            {
                              zone: "Freezer Door",
                              items: "Ice cream, frozen vegetables",
                              temp: "Moderate cold - frequent access"
                            },
                            {
                              zone: "Freezer Main",
                              items: "Meat, prepared meals, ice",
                              temp: "Most consistent freezing"
                            }
                          ].map((item, index) => (
                            <div key={index} className="bg-white/50 p-4 rounded-xl border border-cyan-200">
                              <div className="font-semibold text-cyan-700 mb-1">{item.zone}</div>
                              <div className="text-sm text-cyan-600 mb-2">{item.items}</div>
                              <div className="text-xs text-slate-600 bg-cyan-100 px-2 py-1 rounded-full inline-block">
                                🌡️ {item.temp}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Troubleshooting Tab */}
              {activeTab === "troubleshooting" && (
                <motion.div
                  key="troubleshooting"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Troubleshooting Guide</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">Common Issues & Solutions</h3>
                      <div className="space-y-4">
                        {[
                          {
                            problem: "Refrigerator not cooling",
                            causes: ["Power outage", "Thermostat setting", "Dirty condenser coils", "Faulty compressor"],
                            solutions: ["Check power supply", "Adjust thermostat", "Clean coils", "Call technician"]
                          },
                          {
                            problem: "Excessive frost in freezer",
                            causes: ["Frequent door opening", "Faulty door seal", "Defrost system failure", "High humidity"],
                            solutions: ["Limit door openings", "Replace door seal", "Check defrost heater", "Use dehumidifier"]
                          },
                          {
                            problem: "Unusual noises",
                            causes: ["Loose parts", "Dirty condenser fan", "Faulty compressor", "Ice buildup"],
                            solutions: ["Tighten screws", "Clean fan blades", "Professional service", "Defrost freezer"]
                          },
                          {
                            problem: "Water leakage",
                            causes: ["Clogged defrost drain", "Damaged water line", "Overfilled drip pan", "Door not sealing"],
                            solutions: ["Clear drain tube", "Inspect water line", "Empty drip pan", "Adjust door"]
                          },
                          {
                            problem: "Fridge runs constantly",
                            causes: ["Dirty coils", "Faulty thermostat", "Door left open", "Hot kitchen temperature"],
                            solutions: ["Clean coils", "Replace thermostat", "Check door seal", "Improve ventilation"]
                          },
                          {
                            problem: "Bad odors",
                            causes: ["Spoiled food", "Dirty interior", "Drain pan issues", "Mold growth"],
                            solutions: ["Remove old food", "Deep clean interior", "Clean drain pan", "Use baking soda"]
                          }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                          >
                            <h4 className="font-semibold text-red-700 mb-3 text-lg">{item.problem}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-slate-700 mb-2">Possible Causes:</div>
                                <ul className="text-sm text-slate-600 space-y-1">
                                  {item.causes.map((cause, idx) => (
                                    <li key={idx}>• {cause}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-emerald-700 mb-2">Solutions:</div>
                                <ul className="text-sm text-emerald-600 space-y-1">
                                  {item.solutions.map((solution, idx) => (
                                    <li key={idx}>• {solution}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">Quick Fixes</h3>
                        <div className="space-y-3">
                          {[
                            "Reset refrigerator by unplugging for 5 minutes",
                            "Check circuit breaker and power outlet",
                            "Ensure refrigerator is level (use a level tool)",
                            "Clean condenser coils with coil brush",
                            "Test door seal with paper - should grip firmly",
                            "Defrost freezer if ice buildup exceeds 1/4 inch",
                            "Clear drain tube with warm water and pipe cleaner"
                          ].map((fix, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-green-200">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-green-700">{fix}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                        <h3 className="text-xl font-semibold text-orange-800 mb-4">When to Call a Professional</h3>
                        <div className="space-y-3">
                          {[
                            "Electrical issues or burning smells",
                            "Compressor not starting or making loud noises",
                            "Refrigerant leaks (hissing sound)",
                            "Continuous water leakage after cleaning drain",
                            "Temperature inconsistent after basic troubleshooting",
                            "Ice maker not working despite power and water supply",
                            "Any gas smell (for gas absorption refrigerators)"
                          ].map((scenario, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-orange-200">
                              <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <span className="text-orange-700">{scenario}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FridgeInfo;