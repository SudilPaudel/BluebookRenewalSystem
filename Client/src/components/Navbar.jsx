import React, { useState, useEffect } from "react";
import NepaliDate from "nepali-date-converter";
import logo from "../assets/logo.png";
import flag from "../assets/flag.gif";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaHome } from "react-icons/fa";

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
      <div className="overflow-hidden whitespace-nowrap bg-nepal-blue group">
        <div className="inline-block animate-marquee py-2 px-4 text-white font-semibold text-center group-hover:[animation-play-state:paused]">
          Government of Nepal - Ministry of Physical Infrastructure and
          Transport - Department of Transport Management - Nepal
        </div>
      </div>

      {/* Main Heading */}
      <div className="main-heading grid grid-cols-3 items-center p-4">
        <div className="img-container justify-self-start">
          <img src={logo} alt="logo" className="w-[90px] h-[80px]" />
        </div>

        <div className="middle-heading text-nepal-red space-y-1 text-center justify-self-center">
          <h6 className="text-sm font-semibold">Government of Nepal</h6>
          <h6 className="text-sm">
            Ministry of Physical Infrastructure and Transport
          </h6>
          <h3 className="text-xl font-bold">
            Department of Transport Management
          </h3>
          <h6 className="text-sm">Nepal</h6>
        </div>

        <div className="right-heading flex flex-col items-end">
          <div className="flag-container jestify-self-end">
            <img src={flag} alt="flag" className="w-[66px] h-[80px]" />
          </div>
          <div className="date text-sm mt-2 text-black text-center">
            {dateTimeStr}
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="menu bg-nepal-blue p-3">
        <ul className="flex space-x-6 items-center w-full">
          {/* Home icon as separate menu item */}
          <li className="nav-item">
            <a
              href="/"
              className="text-white text-2xl hover:text-red-400"
              aria-label="Home"
            >
              <FaHome />
            </a>
          </li>
          {/* Services Dropdown */}
          <li className="nav-item relative group">
            <a
              href="#"
              className="text-white text-base hover:text-red-400 flex items-center gap-1"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Services
              <span className="ml-1 transition-transform duration-200 group-hover:rotate-180">
                ▼
              </span>
            </a>

            <ul className="absolute left-0 mt-2 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-10 min-w-[180px]">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-nepal-blue hover:text-white"
                >
                  Blue Book Renewal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-nepal-blue hover:text-white"
                >
                  License Renewal
                </a>
              </li>
            </ul>
          </li>

          {/* Spacer to push auth buttons right */}
          <div className="flex-grow"></div>

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <li>
                <a
                  href="/login"
                  className="bg-white text-nepal-blue font-semibold px-4 py-1 rounded hover:bg-gray-200 transition"
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="bg-red-500 text-white font-semibold px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Signup
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a
                  href="/dashboard"
                  className="text-white hover:text-red-400 transition"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-white text-nepal-blue font-semibold px-4 py-1 rounded hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          min-width: 100%;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
}

export default Navbar;
