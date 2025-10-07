import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiEdit2, 
  FiCamera, 
  FiLogOut, 
  FiLock, 
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiX
} from "react-icons/fi";
import { 
  ChefHat, 
  Download,
  Shield,
  Sparkles
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch profile on mount
  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setEditedUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchProfile();
  }, [navigate, token]);

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/users/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.user);
      setEditedUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        editedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setEditedUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed successfully!");
      setShowChangePassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const exportData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const dataStr = JSON.stringify(res.data.items, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fridge-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to export data.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 py-12 px-8 text-center">
            <div className="absolute top-6 right-6">
              <div className="bg-white/20 p-2 rounded-full">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="relative inline-block cursor-pointer group">
                <img
                  className="h-24 w-24 rounded-full border-4 border-white/80 shadow-2xl mx-auto object-cover"
                  src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                  alt={user.name}
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <FiCamera className="text-white text-xl" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
              </label>
              
              <div>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-emerald-100 mt-2">{user.email}</p>
                <div className="flex justify-center gap-2 mt-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white">
                    Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Single Page Layout */}
          <div className="p-8">
            {/* Profile Information Section */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isEditing 
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {isEditing ? <FiX className="h-4 w-4" /> : <FiEdit2 className="h-4 w-4" />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "name", label: "Full Name", icon: <FiUser className="h-4 w-4" />, type: "text" },
                    { key: "email", label: "Email Address", icon: <FiMail className="h-4 w-4" />, type: "email" },
                    { key: "phone", label: "Phone Number", icon: <FiPhone className="h-4 w-4" />, type: "tel" }
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        {field.icon}
                        {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          type={field.type}
                          value={editedUser[field.key] || ""}
                          onChange={(e) =>
                            setEditedUser({ ...editedUser, [field.key]: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                        />
                      ) : (
                        <p className="text-slate-600 py-3 px-4 bg-slate-50 rounded-xl">
                          {user[field.key] || "Not provided"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSave className="h-5 w-5" />
                    )}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </motion.button>
                )}
              </div>

              {/* Change Password Section */}
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">Security</h2>
                  <button
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                  >
                    <FiLock className="h-4 w-4" />
                    {showChangePassword ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {showChangePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    {[
                      { key: "currentPassword", label: "Current Password", type: "password" },
                      { key: "newPassword", label: "New Password", type: "password" },
                      { key: "confirmPassword", label: "Confirm New Password", type: "password" }
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">{field.label}</label>
                        <input
                          type={field.type}
                          value={passwordData[field.key]}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, [field.key]: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FiLock className="h-4 w-4" />
                      )}
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 px-8 py-6 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4" />
                <span>Your data is securely encrypted</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;