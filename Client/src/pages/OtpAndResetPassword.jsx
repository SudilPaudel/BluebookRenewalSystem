import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OtpAndResetPassword() {
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [passwordError, setPasswordError] = useState("");  // <-- new error state

  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }
    const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timerId);
  }, [resendTimer]);

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    // Assume verification success
    setOtpVerified(true);
  };

  const handleResend = () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    // TODO: Resend OTP backend call
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError(""); // reset error

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // TODO: Reset password backend call

    // On success redirect:
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white/80 shadow-2xl rounded-3xl border border-blue-100 backdrop-blur-lg animate-fade-in">
      {!otpVerified ? (
        <>
          <h2 className="text-4xl font-extrabold text-nepal-blue mb-10 text-center tracking-tight animate-slide-down">
            OTP Verification
          </h2>
          <form onSubmit={handleOtpSubmit} className="space-y-8">
            <div className="relative">
              <label className="block font-semibold mb-2 text-left text-gray-700 tracking-wide">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                className="w-full border-2 border-blue-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-nepal-blue/30 transition-all duration-300 text-lg tracking-widest bg-blue-50/60 shadow-sm"
                inputMode="numeric"
                pattern="\d{6}"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-nepal-blue to-blue-500 text-white py-3 font-bold rounded-xl shadow-lg hover:scale-105 hover:from-blue-700 hover:to-nepal-blue transition-all duration-300"
            >
              Verify OTP
            </button>
          </form>

          <div className="text-center mt-6 text-base text-gray-500 animate-fade-in">
            Didn&apos;t get code?{" "}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`font-bold transition-all duration-200 ${
                canResend
                  ? "text-nepal-blue hover:underline hover:text-blue-700 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Resend {canResend ? "" : `(${resendTimer}s)`}
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-extrabold text-nepal-blue mb-10 text-center tracking-tight animate-slide-down">
            Set New Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-8">
            <div className="relative">
              <label className="block font-semibold mb-2 text-left text-gray-700 tracking-wide">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border-2 border-blue-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-nepal-blue/30 transition-all duration-300 text-lg bg-blue-50/60 shadow-sm"
              />
            </div>

            <div className="relative">
              <label className="block font-semibold mb-2 text-left text-gray-700 tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border-2 border-blue-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-nepal-blue/30 transition-all duration-300 text-lg bg-blue-50/60 shadow-sm"
              />
            </div>

            {passwordError && (
              <p className="text-red-600 text-base mb-2 animate-shake">{passwordError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-nepal-blue to-blue-500 text-white py-3 font-bold rounded-xl shadow-lg hover:scale-105 hover:from-blue-700 hover:to-nepal-blue transition-all duration-300"
            >
              Reset Password
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default OtpAndResetPassword;
