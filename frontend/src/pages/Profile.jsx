
// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2, FiCamera, FiLock, FiTrash2, FiLogOut } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditedUser(parsedUser);
    } else {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // ✅ Some backends return { user: {...} } and others return {...}
          const fetchedUser = res.data.user || res.data;
          setUser(fetchedUser);
          setEditedUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        })
        .catch((err) => {
          console.error(err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
        });
    }
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update",
        editedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      setEditedUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed successfully!");
      setPasswords({ current: "", new: "" });
      setShowPasswordModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      await axios.delete("http://localhost:5000/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const avatarData = reader.result;
      setEditedUser({ ...editedUser, avatar: avatarData });
      const updatedUser = { ...user, avatar: avatarData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Card */}
        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-10 px-6 text-center relative">
            <label className="relative inline-block cursor-pointer group">
              <img
                className="h-32 w-32 rounded-full border-4 border-white shadow-md mx-auto object-cover"
                src={user.avatar || "https://i.pravatar.cc/150"}
                alt={user.name}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <FiCamera className="text-white text-2xl" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
            <h2 className="mt-4 text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-emerald-100">{user.email}</p>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Editable fields */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                <FiEdit2 /> {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                {isEditing ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={editedUser[field] || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, [field]: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                ) : (
                  <p className="text-gray-600">
                    {user[field] || "Not provided"}
                  </p>
                )}
              </div>
            ))}

            {isEditing && (
              <motion.button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-md shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </motion.button>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-3 px-4 rounded-lg shadow hover:bg-blue-600 transition"
              >
                <FiLock /> Change Password
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-3 px-4 rounded-lg shadow hover:bg-red-600 transition"
              >
                <FiTrash2 /> Delete Account
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full bg-gray-600 text-white py-3 px-4 rounded-lg shadow hover:bg-gray-700 transition"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Change Password
                </h3>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  className="w-full mb-3 px-4 py-2 border rounded-md"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  className="w-full mb-4 px-4 py-2 border rounded-md"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-md border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Delete Account
                </h3>
                <p className="mb-4 text-gray-600">
                  Are you sure you want to permanently delete your account? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-md border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile;
