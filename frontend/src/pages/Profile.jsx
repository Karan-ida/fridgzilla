import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2, FiCamera } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate, token]);

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
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
    }
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
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
                onClick={async () => {
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
                }}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-md shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
