import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/password/reset", {
        email,
        newPassword: password,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-gray-50 to-white flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* ------ GREEN HEADER ----- */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-10 text-center rounded-b-3xl">
          <h1 className="text-white font-semibold text-lg mb-1">Reset Account</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-white/70 text-sm">Enter your email to reset your password</p>
        </div>

        {/* ------ FORM BODY ------ */}
        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="text-sm text-gray-700 font-medium">Email Address</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700 font-medium">New Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must contain 8+ chars, 1 uppercase, 1 number, 1 special character
            </p>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Update Password <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to Login */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 text-emerald-600 font-medium hover:underline"
            type="button"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
