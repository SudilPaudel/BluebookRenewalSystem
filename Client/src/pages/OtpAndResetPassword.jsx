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
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-lg">
      {!otpVerified ? (
        <>
          <h2 className="text-3xl font-bold text-nepal-blue mb-8 text-center">
            OTP Verification
          </h2>
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1 text-left">Enter OTP</label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                inputMode="numeric"
                pattern="\d{6}"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-nepal-blue text-white py-3 font-semibold rounded hover:bg-blue-700 transition"
            >
              Verify OTP
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            Didn&apos;t get code?{" "}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`font-semibold ${
                canResend
                  ? "text-nepal-blue hover:underline cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Resend {canResend ? "" : `(${resendTimer}s)`}
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-nepal-blue mb-8 text-center">
            Set New Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1 text-left">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-left">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
              />
            </div>

            {passwordError && (
              <p className="text-red-600 text-sm mb-2">{passwordError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-nepal-blue text-white py-3 font-semibold rounded hover:bg-blue-700 transition"
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
