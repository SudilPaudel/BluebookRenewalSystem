import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import API from "../api/api";
import Notification from "../components/Notification";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    citizenshipNo: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // OTP states
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size must be less than 2MB.");
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = img;
        const ratio = width / height;

        if (ratio < 0.7 || ratio > 0.8) {
          setImageError("Image must be passport-sized (3:4 aspect ratio).");
          setFormData((prev) => ({ ...prev, image: null }));
          setImagePreview(null);
        } else {
          setImageError("");
          setFormData((prev) => ({ ...prev, image: file }));
          setImagePreview(img.src);
        }
      };
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification({ type: "", message: "" });
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showNotification("error", "Passwords do not match!");
      return;
    }

    // Temporarily commented out for testing
    // if (!formData.image) {
    //   showNotification("error", "Please upload a valid passport-sized image.");
    //   return;
    // }

    setIsLoading(true);
    clearNotification();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("citizenshipNo", formData.citizenshipNo);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await API.post("/auth/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.result) {
        setUserId(response.data.result.userId);
        showNotification("success", response.data.message || "Registration successful! Please check your email for OTP verification.");
        setShowOtpForm(true);
        startResendTimer();
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      showNotification("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      showNotification("error", "Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    clearNotification();

    try {
      const response = await API.post("/auth/verify-email-otp", {
        userId: userId,
        otp: otp,
      });

      if (response.data.result) {
        showNotification("success", response.data.message || "Email verified successfully! You can now login.");
        setTimeout(() => {
    navigate("/login");
        }, 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || "OTP verification failed. Please try again.";
      showNotification("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    clearNotification();

    try {
      const response = await API.post("/auth/resend-otp", {
        userId: userId,
      });

      if (response.data.result) {
        showNotification("success", response.data.message || "OTP resent successfully! Please check your email.");
        startResendTimer();
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      showNotification("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtpForm) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-nepal-blue mb-8 text-center">
          Email Verification
        </h2>

        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />

        <p className="text-gray-600 mb-6 text-center">
          We've sent a 6-digit verification code to <strong>{formData.email}</strong>
        </p>

        <form onSubmit={handleOtpSubmit}>
          <div className="mb-6">
            <label className="block font-medium mb-2 text-left">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue text-center text-xl tracking-widest"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !otp || otp.length !== 6}
            className="w-full bg-nepal-blue text-white py-3 font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
            Verify Email
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendTimer > 0 || isLoading}
            className="text-nepal-blue hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowOtpForm(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-nepal-blue mb-8 text-center">
        User Registration
      </h2>

      <Notification
        type={notification.type}
        message={notification.message}
        onClose={clearNotification}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block font-medium mb-1 text-left">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-left">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
            />
          </div>

          {/* Citizenship No */}
          <div>
            <label className="block font-medium mb-1 text-left">Citizenship No</label>
            <input
              type="text"
              name="citizenshipNo"
              required
              placeholder="Enter your citizenship number"
              value={formData.citizenshipNo}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block font-medium mb-1 text-left">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Enter a strong password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full border px-4 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
            />
            <span
              className="absolute top-[38px] right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block font-medium mb-1 text-left">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full border px-4 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
            />
            <span
              className="absolute top-[38px] right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block font-medium mb-1 text-left">Passport-sized Photo</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
            {imageError && (
              <p className="text-red-600 text-sm mt-1">{imageError}</p>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-[120px] h-[160px] mt-3 object-cover border rounded"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-nepal-blue text-white py-3 font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
              Register
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-nepal-blue hover:text-blue-700 font-medium"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
