// src/Components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const location = useLocation();

  const isActiveLink = (path) =>
    location.pathname === path
      ? "text-emerald-400 font-semibold"
      : "text-white hover:text-emerald-300";

  // Update login state on token change or navigation
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  return (
    <nav className="bg-green-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Fridgella
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActiveLink("/")}>
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={isActiveLink("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/fridge-info" className="text-white hover:text-emerald-200">
                  Fridge Info
                </Link>
                <Link to="/upload-bill" className="text-white hover:text-emerald-200">
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
              </>
            ) : (
              <>
                <Link to="/login" className={isActiveLink("/login")}>
                  Login
                </Link>
                <Link to="/register" className={isActiveLink("/register")}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
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
      {isOpen && (
        <div className="md:hidden bg-green-700 space-y-1 px-4 py-3">
          <Link
            to="/"
            className={`${isActiveLink("/")} block`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className={`${isActiveLink("/dashboard")} block`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/fridge-info"
                className={`${isActiveLink("/fridge-info")} block`}
                onClick={() => setIsOpen(false)}
              >
                Fridge Info
              </Link>
              <Link
                to="/upload-bill"
                className={`${isActiveLink("/upload-bill")} block`}
                onClick={() => setIsOpen(false)}
              >
                Upload Bill
              </Link>
              <Link
                to="/history"
                className={`${isActiveLink("/history")} block`}
                onClick={() => setIsOpen(false)}
              >
                History
              </Link>
              <Link
                to="/analytics"
                className={`${isActiveLink("/analytics")} block`}
                onClick={() => setIsOpen(false)}
              >
                Analytics
              </Link>
              <Link
                to="/profile"
                className={`${isActiveLink("/profile")} block`}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${isActiveLink("/login")} block`}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`${isActiveLink("/register")} block`}
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
