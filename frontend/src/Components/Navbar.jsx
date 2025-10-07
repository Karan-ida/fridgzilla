// src/Components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (path) =>
    location.pathname === path
      ? "text-emerald-400 font-semibold"
      : "text-white hover:text-emerald-300";

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
    setIsOpen(false);
  };

  // ------------------------
  // Fridgzilla Logo
  // ------------------------
  const FridgzillaLogo = ({ size = "medium" }) => {
    const sizes = {
      small: "h-8 w-8",
      medium: "h-10 w-10",
      large: "h-12 w-12",
    };

    return (
      <motion.div
        whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.6 } }}
        className={`${sizes[size]} relative cursor-pointer`}
        onClick={() => navigate("/")}
      >
        {/* Main Fridge */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-black-700 rounded-lg shadow-lg border-2 border-emerald-300">
          <div className="absolute inset-1 bg-gradient-to-b from-emerald-400 to-orange-600 rounded border border-emerald-300">
            {/* Spikes */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-emerald-700 rounded-t-lg"></div>
            <div className="absolute -top-1 left-1/4 w-2 h-1 bg-emerald-700 rounded-t"></div>
            <div className="absolute -top-1 right-1/4 w-2 h-1 bg-emerald-700 rounded-t"></div>

            {/* Handle */}
            <div className="absolute right-0 top-1/4 translate-x-1 w-1 h-6 bg-amber-500 rounded-l-lg shadow-md">
              <div className="absolute -left-0.5 top-1 w-1 h-1 bg-amber-600 rounded-full"></div>
              <div className="absolute -left-0.5 top-3 w-1 h-1 bg-amber-600 rounded-full"></div>
            </div>

            {/* Eyes */}
            <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute top-2 left-5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>

            {/* Vent */}
            <div className="absolute bottom-2 left-2 right-4 h-0.5 bg-emerald-800 rounded-full"></div>
            <div className="absolute bottom-1.5 left-3 right-5 h-0.5 bg-emerald-800 rounded-full"></div>
          </div>
        </div>

        {/* Tail */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-gradient-to-r from-emerald-600 to-green-700 rounded-r-lg -rotate-12"></div>
      </motion.div>
    );
  };

  const LogoWithText = ({ size = "medium" }) => {
    const textSizes = {
      small: "text-lg",
      medium: "text-xl",
      large: "text-2xl",
    };

    return (
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <FridgzillaLogo size={size} />
        <div className="flex flex-col">
          <span
            className={`${textSizes[size]} font-extrabold bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent leading-tight tracking-wide`}
          >
            FRIDGZILLA
          </span>
          <span className="text-xs text-emerald-200 -mt-1 leading-none">
            Food Monster
          </span>
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 shadow-xl sticky top-0 z-50 border-b-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <LogoWithText size="medium" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${isActiveLink("/")} font-medium`}>
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={isActiveLink("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/fridge-info" className={isActiveLink("/fridge-info")}>
                  Fridge Info
                </Link>
                <Link to="/upload-bill" className={isActiveLink("/upload-bill")}>
                  Upload Bill
                </Link>
                <Link to="/history" className={isActiveLink("/history")}>
                  History
                </Link>
                <Link to="/analytics" className={isActiveLink("/analytics")}>
                  Analytics
                </Link>
                <Link to="/profile" className={isActiveLink("/profile")}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={isActiveLink("/login")}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white "
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-white focus:outline-none p-2 rounded-lg hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-b from-green-800 to-emerald-900 space-y-1 px-4 py-3 border-t border-emerald-600"
          >
            <Link
              to="/"
              className={`${isActiveLink("/")} block py-3 px-4 rounded-lg hover:bg-white/10`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${isActiveLink("/dashboard")} block py-3 px-4 rounded-lg hover:bg-white/10`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/fridge-info"
                  className={`${isActiveLink("/fridge-info")} block py-3 px-4 rounded-lg hover:bg-white/10`}
                  onClick={() => setIsOpen(false)}
                >
                  Fridge Info
                </Link>
                <Link
                  to="/upload-bill"
                  className={`${isActiveLink("/upload-bill")} block py-3 px-4 rounded-lg hover:bg-white/10`}
                  onClick={() => setIsOpen(false)}
                >
                  Upload Bill
                </Link>
                <Link
                  to="/history"
                  className={`${isActiveLink("/history")} block py-3 px-4 rounded-lg hover:bg-white/10`}
                  onClick={() => setIsOpen(false)}
                >
                  History
                </Link>
                <Link
                  to="/analytics"
                  className={`${isActiveLink("/analytics")} block py-3 px-4 rounded-lg hover:bg-white/10`}
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  to="/profile"
                  className={`${isActiveLink("/profile")} block py-3 px-4 rounded-lg hover:bg-white/10`}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-300 hover:text-red-200 block py-3 px-4 rounded-lg hover:bg-red-500/20 border border-red-400/30 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isActiveLink("/login")} block py-3 px-4 rounded-lg hover:bg-white/10`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-3 px-4 rounded-lg hover:bg-white/10` bg-amber-500 text-green-900 font-bold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
