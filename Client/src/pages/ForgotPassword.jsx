import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would typically call your backend API to send reset link
    console.log("Password reset requested for:", email);

    // For demo purpose, just show a success message
    setMessage(`If an account with email ${email} exists, a reset link has been sent.`);
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-10 bg-white/80 shadow-2xl rounded-3xl border border-gray-100 backdrop-blur-lg animate-fade-in">
      <h2 className="text-4xl font-extrabold text-nepal-blue mb-8 text-center tracking-tight animate-slide-down">
        Forgot Password
      </h2>

      <p className="mb-8 text-center text-gray-600 text-lg animate-fade-in delay-100">
        Enter your registered email address and we will send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-7 animate-fade-in delay-200">
        <div>
          <label className="block font-semibold mb-2 text-left text-gray-800 tracking-wide">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-5 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-nepal-blue/30 transition-all duration-200 bg-gray-50 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-nepal-blue to-blue-500 text-white py-3 font-bold rounded-xl shadow-lg hover:scale-105 hover:from-blue-600 hover:to-nepal-blue transition-all duration-200 active:scale-95"
        >
          Send Reset Link
        </button>
      </form>

      {message && (
        <p className="mt-8 text-center text-green-600 font-semibold animate-fade-in-up">
          {message}
        </p>
      )}

      {/* Animations */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.8s ease both;
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.7s cubic-bezier(.39,.575,.565,1.000) both;
          }
          .animate-slide-down {
            animation: slideDown 0.7s cubic-bezier(.39,.575,.565,1.000) both;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

export default ForgotPassword;
