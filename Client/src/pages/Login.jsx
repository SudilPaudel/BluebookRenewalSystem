import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Notification from "../components/Notification";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setNotification({ type: "", message: "" }); // Clear notification on input change
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearNotification();

    try {
      const response = await API.post("/auth/login", formData);
      const data = response.data;

      if (data.success) {
        // Save tokens in localStorage
      localStorage.setItem("accessToken", data.result.tokens.accessToken);
      localStorage.setItem("refreshToken", data.result.tokens.refreshToken);
      localStorage.setItem("userDetail", JSON.stringify(data.result.detail));

        showNotification("success", "Login successful! Redirecting...");

        // Trigger storage event to update Navbar
        window.dispatchEvent(new Event('storage'));

      // Redirect based on user role
        setTimeout(() => {
      if (data.result.detail.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
        }, 1500);
      }else{
        showNotification("error", "Login Failed. Please try again with other credentials");
        return;
      }

    } catch (error) {
  console.error("Login error:", error); // for dev visibility
  try {
    const message =
      error?.response?.data?.message?.toString() || "Login failed. Please try again.";
    showNotification("error", message);
  } catch {
    showNotification("error", "Something went wrong during login.");
  }
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="w-full max-w-md mx-auto p-10 bg-white/90 shadow-2xl rounded-3xl border border-blue-100 backdrop-blur-md animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-nepal-blue mb-10 text-center tracking-tight drop-shadow animate-fade-in">
          User Login
        </h2>

        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />

        <form onSubmit={handleSubmit} className="animate-fade-in delay-100">
          <div className="space-y-8">
            {/* Email */}
            <div className="relative group">
              <label className="block font-semibold mb-2 text-left text-gray-700 group-hover:text-nepal-blue transition">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 px-5 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-nepal-blue focus:border-nepal-blue transition bg-gray-50 group-hover:bg-blue-50"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="block font-semibold mb-2 text-left text-gray-700 group-hover:text-nepal-blue transition">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-200 px-5 py-3 pr-12 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-nepal-blue focus:border-nepal-blue transition bg-gray-50 group-hover:bg-blue-50"
                disabled={loading}
              />
              <span
                className="absolute top-10 right-4 text-gray-400 hover:text-nepal-blue cursor-pointer transition"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? <FaEye className="animate-fade-in" /> : <FaEyeSlash className="animate-fade-in" />}
              </span>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-nepal-blue hover:underline hover:text-blue-700 transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-nepal-blue to-blue-500 text-white py-3 font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : null}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center animate-fade-in delay-200">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-nepal-blue hover:text-blue-700 font-semibold underline underline-offset-2 transition"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.9s cubic-bezier(.4,0,.2,1) both;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

export default Login;
