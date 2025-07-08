import React, { useState, useEffect } from "react";
import NepaliDate from "nepali-date-converter";
import logo from "../assets/logo.png";
import flag from "../assets/flag.gif";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  // Check auth state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Nepali Date & Time state
  const [dateTimeStr, setDateTimeStr] = useState("");

  useEffect(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Baishakh",
      "Jestha",
      "Asar",
      "Shrawan",
      "Bhadra",
      "Ashwin",
      "Kartik",
      "Mangsir",
      "Poush",
      "Magh",
      "Falgun",
      "Chaitra",
    ];

    const updateDateTime = () => {
      const now = new Date();
      const nd = new NepaliDate(now);

      const dayName = days[nd.getDay()];
      const monthName = months[nd.getMonth()];

      const year = nd.getYear();
      const date = nd.getDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const formatted = `${year} ${monthName} ${date}, ${dayName} ${hours}:${minutes}:${seconds}`;
      setDateTimeStr(formatted);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Check auth state on component mount and listen for storage changes
  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    // Check initially
    checkAuthState();

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = () => {
      checkAuthState();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check when the component receives focus (for same-tab login)
    const handleFocus = () => {
      checkAuthState();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userDetail");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* Top Marquee Heading */}
      <div className="overflow-hidden bg-gradient-to-r from-nepal-blue via-blue-700 to-nepal-blue shadow-md">
        <div className="inline-block animate-marquee py-2 px-4 text-white font-bold text-lg tracking-wide group-hover:[animation-play-state:paused]">
          Government of Nepal - Ministry of Physical Infrastructure and Transport - Department of Transport Management - Nepal
        </div>
      </div>

      {/* Main Heading */}
      <div className="main-heading grid grid-cols-3 items-center p-6 bg-white rounded-xl shadow-lg mt-4 mx-4">
        <div className="img-container justify-self-start flex items-center">
          <img
            src={logo}
            alt="logo"
            className="w-[90px] h-[80px] rounded-lg shadow-lg border-2 border-nepal-blue transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="middle-heading text-nepal-red space-y-1 text-center justify-self-center animate-fade-in">
          <h6 className="text-base font-semibold tracking-wide">Government of Nepal</h6>
          <h6 className="text-base font-medium">Ministry of Physical Infrastructure and Transport</h6>
          <h3 className="text-2xl font-extrabold text-nepal-blue drop-shadow-lg">Department of Transport Management</h3>
          <h6 className="text-base font-medium">Nepal</h6>
        </div>

        <div className="right-heading flex flex-col items-end">
          <div className="flag-container justify-self-end">
            <img
              src={flag}
              alt="flag"
              className="w-[66px] h-[80px] rounded-lg shadow-lg border-2 border-red-400 animate-bounce-slow"
            />
          </div>
          <div className="date text-sm mt-2 text-gray-700 text-center font-mono bg-gray-100 px-3 py-1 rounded-lg shadow-inner animate-fade-in">
            {dateTimeStr}
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="menu bg-gradient-to-r from-nepal-blue via-blue-700 to-nepal-blue p-4 rounded-b-xl shadow-lg mx-4 mb-4 mt-2">
        <ul className="flex space-x-8 items-center w-full">
          {/* Home icon as separate menu item */}
          <li className="nav-item transition-transform duration-200 hover:scale-110">
            <Link
              to="/"
              className="text-white text-3xl hover:text-red-400 drop-shadow-lg"
              aria-label="Home"
            >
              <FaHome />
            </Link>
          </li>
          {/* Services Dropdown */}
          <li className="nav-item relative group transition-all duration-200">
            <Link
              to="#"
              className="text-white text-lg font-semibold hover:text-red-400 flex items-center gap-1 transition-colors duration-200"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Services
              <span className="ml-1 transition-transform duration-200 group-hover:rotate-180">
                ▼
              </span>
            </Link>

            <ul className="absolute left-0 mt-3 bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 z-20 min-w-[200px] scale-95 group-hover:scale-100">
              <li>
                <Link
                  to="#"
                  className="block px-6 py-3 text-base text-gray-800 hover:bg-nepal-blue hover:text-white rounded-t-xl transition-colors duration-200"
                >
                  Blue Book Renewal
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-6 py-3 text-base text-gray-800 hover:bg-nepal-blue hover:text-white rounded-b-xl transition-colors duration-200"
                >
                  License Renewal
                </Link>
              </li>
            </ul>
          </li>

          {/* Spacer to push auth buttons right */}
          <div className="flex-grow"></div>

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/login"
                  className="bg-white text-nepal-blue font-bold px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-200 border border-nepal-blue"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-200"
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="text-white font-semibold hover:text-red-400 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-white text-nepal-blue font-bold px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-200 border border-nepal-blue"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          min-width: 100%;
          animation: marquee 18s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
      `}</style>
    </>
  );
}

export default Navbar;
