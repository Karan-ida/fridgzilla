import React, { useState } from "react";
import { motion } from "framer-motion";

const FridgeInfo = () => {
  const [activeTab, setActiveTab] = useState("basics"); // basics, maintenance, cleaning, tips

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Fridge Information & Care Guide</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn how to properly maintain and optimize your refrigerator for better food preservation and energy efficiency
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
            <div className="flex flex-wrap">
              {[
                { id: "basics", label: "Basics", icon: "📋" },
                { id: "maintenance", label: "Maintenance", icon: "🔧" },
                { id: "cleaning", label: "Cleaning", icon: "🧽" },
                { id: "tips", label: "Tips", icon: "💡" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[150px] py-4 font-medium flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? "text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Basics Tab */}
            {activeTab === "basics" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">📋</span>
                  Refrigerator Basics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">How Refrigerators Work</h3>
                    <p className="text-gray-700 mb-4">
                      A refrigerator is an essential appliance that preserves food by maintaining a cool temperature 
                      and slowing bacterial growth. It works on the principle of heat absorption and transfer.
                    </p>
                    
                    <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-emerald-800 mb-2">Optimal Temperature Settings</h4>
                      <ul className="space-y-1 text-emerald-700">
                        <li>• Refrigerator: 35°F - 38°F (1.7°C - 3.3°C)</li>
                        <li>• Freezer: 0°F (-18°C)</li>
                        <li>• Humidity Drawers: 85-95% for produce</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">Key Components</h3>
                    <div className="space-y-4">
                      {[
                        { icon: "⚙️", title: "Compressor", desc: "Circulates refrigerant to remove heat" },
                        { icon: "🌀", title: "Evaporator Coil", desc: "Absorbs heat from inside the fridge" },
                        { icon: "🌡️", title: "Condenser Coil", desc: "Releases heat to the outside" },
                        { icon: "🎚️", title: "Thermostat", desc: "Controls and maintains temperature" },
                        { icon: "🗄️", title: "Shelves & Drawers", desc: "Organize and store food properly" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ x: 5 }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Maintenance Tab */}
            {activeTab === "maintenance" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">🔧</span>
                  Maintenance Schedule
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">Regular Maintenance Tasks</h3>
                    <div className="space-y-4">
                      {[
                        { frequency: "Weekly", task: "Check temperature settings", icon: "🌡️", importance: "High" },
                        { frequency: "Monthly", task: "Clean interior surfaces", icon: "🧼", importance: "Medium" },
                        { frequency: "Every 3-6 months", task: "Defrost freezer (if not frost-free)", icon: "❄️", importance: "High" },
                        { frequency: "Every 6 months", task: "Clean condenser coils", icon: "🌀", importance: "High" },
                        { frequency: "Every 6 months", task: "Check door seals", icon: "🚪", importance: "Medium" },
                        { frequency: "Annually", task: "Professional servicing", icon: "🔧", importance: "Medium" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xl">{item.icon}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.importance === "High" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {item.importance}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-800">{item.task}</h4>
                          <p className="text-sm text-emerald-600">{item.frequency}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">Maintenance Benefits</h3>
                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                      <h4 className="font-semibold text-blue-800 mb-3">Why Regular Maintenance Matters</h4>
                      <ul className="space-y-2 text-blue-700">
                        <li>• Extends appliance lifespan by 5-10 years</li>
                        <li>• Reduces energy consumption by 15-20%</li>
                        <li>• Prevents costly repairs and food spoilage</li>
                        <li>• Maintains optimal food preservation conditions</li>
                        <li>• Ensures consistent temperature control</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-3">Warning Signs</h4>
                      <ul className="space-y-2 text-orange-700">
                        <li>• Unusual noises from compressor</li>
                        <li>• Frost buildup in freezer</li>
                        <li>• Temperature fluctuations</li>
                        <li>• Water leakage</li>
                        <li>• Excessive energy bills</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cleaning Tab */}
            {activeTab === "cleaning" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">🧽</span>
                  Cleaning Guide
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">Step-by-Step Cleaning Process</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, instruction: "Turn off and unplug the refrigerator", icon: "🔌" },
                        { step: 2, instruction: "Remove all food items and store in cooler", icon: "📦" },
                        { step: 3, instruction: "Take out shelves and drawers for washing", icon: "🗄️" },
                        { step: 4, instruction: "Wash removable parts with warm soapy water", icon: "🧼" },
                        { step: 5, instruction: "Clean interior with baking soda solution (2 tbsp per quart)", icon: "🍶" },
                        { step: 6, instruction: "Wipe door seals and handles thoroughly", icon: "🚪" },
                        { step: 7, instruction: "Dry everything completely before reassembling", icon: "💨" },
                        { step: 8, instruction: "Plug in and restore temperature before reloading", icon: "⚡" }
                      ].map((item) => (
                        <motion.div
                          key={item.step}
                          whileHover={{ x: 5 }}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                            {item.step}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.instruction}</p>
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">Cleaning Tips & Products</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-6">
                      <h4 className="font-semibold text-green-800 mb-3">Recommended Cleaning Solutions</h4>
                      <ul className="space-y-2 text-green-700">
                        <li>• Baking soda and water (natural deodorizer)</li>
                        <li>• Vinegar solution (1:1 with water for disinfecting)</li>
                        <li>• Mild dish soap and warm water</li>
                        <li>• Commercial appliance cleaners</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg mb-6">
                      <h4 className="font-semibold text-purple-800 mb-3">What to Avoid</h4>
                      <ul className="space-y-2 text-purple-700">
                        <li>• Abrasive cleaners that can scratch surfaces</li>
                        <li>• Harsh chemicals that might leave odors</li>
                        <li>• Excessive water on electrical components</li>
                        <li>• Sharp objects that could damage seals</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-3">Frequency Guide</h4>
                      <ul className="space-y-2 text-yellow-700">
                        <li>• Spills: Clean immediately</li>
                        <li>• Interior: Every 3-4 months</li>
                        <li>• Door seals: Monthly</li>
                        <li>• Condenser coils: Every 6 months</li>
                        <li>• Full deep clean: Annually</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tips Tab */}
            {activeTab === "tips" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">💡</span>
                  Pro Tips & Best Practices
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">Energy Efficiency Tips</h3>
                    <div className="space-y-4">
                      {[
                        { tip: "Keep refrigerator full but not overcrowded", savings: "Saves 10-15% energy" },
                        { tip: "Ensure proper door seal integrity", savings: "Prevents 30% cold air loss" },
                        { tip: "Clean condenser coils regularly", savings: "Improves efficiency by 25%" },
                        { tip: "Set optimal temperature settings", savings: "Saves 5-10% on energy bills" },
                        { tip: "Allow hot food to cool before storing", savings: "Reduces compressor workload" },
                        { tip: "Position fridge away from heat sources", savings: "Maintains better efficiency" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <p className="font-medium text-gray-800 mb-2">{item.tip}</p>
                          <p className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full inline-block">
                            {item.savings}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-emerald-700 mb-4">Food Storage Optimization</h3>
                    
                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                      <h4 className="font-semibold text-blue-800 mb-3">Ideal Storage Locations</h4>
                      <ul className="space-y-2 text-blue-700">
                        <li>• <strong>Upper shelves:</strong> Ready-to-eat foods, leftovers</li>
                        <li>• <strong>Lower shelves:</strong> Raw meat, dairy products</li>
                        <li>• <strong>Door:</strong> Condiments, juices, butter</li>
                        <li>• <strong>Crisper drawers:</strong> Fruits and vegetables</li>
                        <li>• <strong>Freezer door:</strong> Ice cream, frozen vegetables</li>
                        <li>• <strong>Freezer main:</strong> Meat, prepared meals, ice</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-3">Quick Troubleshooting</h4>
                      <ul className="space-y-2 text-orange-700">
                        <li>• <strong>Warm fridge:</strong> Check power, thermostat, door seal</li>
                        <li>• <strong>Excessive frost:</strong> Defrost, check door seal</li>
                        <li>• <strong>Noisy operation:</strong> Clean coils, check leveling</li>
                        <li>• <strong>Water leakage:</strong> Check defrost drain, water line</li>
                        <li>• <strong>Odors:</strong> Clean interior, use baking soda</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FridgeInfo;