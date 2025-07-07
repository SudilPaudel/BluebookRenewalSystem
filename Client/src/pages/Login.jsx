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
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-nepal-blue mb-8 text-center">
        User Login
      </h2>

      <Notification
        type={notification.type}
        message={notification.message}
        onClose={clearNotification}
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-left">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block font-medium mb-1 text-left">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-4 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
              disabled={loading}
            />
            <span
              className="absolute top-[38px] right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-nepal-blue hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-nepal-blue text-white py-3 font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-nepal-blue hover:text-blue-700 font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
