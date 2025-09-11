import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const isActiveLink = (path) =>
    location.pathname === path
      ? "nav-link active"
      : "nav-link";

  return (
    <nav className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <div className="font-bold text-2xl text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Fridgella
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActiveLink("/")}>Home</Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={isActiveLink("/dashboard")}>Dashboard</Link>
                <Link to="/upload-bill" className={isActiveLink("/upload-bill")}>Upload Bill</Link>
                {/* History with custom styling */}
                <Link
                  to="/history"
                  className={`${isActiveLink("/history")} font-bold text-yellow-300 hover:text-yellow-200`}
                >
                  History
                </Link>

                {/* Account Dropdown */}
                <div className="relative group">
                  <button className="text-white flex items-center focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Account
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={isActiveLink("/login")}>Login</Link>
                <Link to="/register" className={isActiveLink("/register")}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Extra styles */}
      <style jsx>{`
        .nav-link {
          color: white;
          font-weight: 500;
          padding: 8px 0;
          position: relative;
          transition: all 0.3s;
        }
        .nav-link:hover {
          color: #d1fae5;
        }
        .nav-link.active {
          color: #ffffff;
          font-weight: 600;
        }
        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: white;
          border-radius: 2px;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
