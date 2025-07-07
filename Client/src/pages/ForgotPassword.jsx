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
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-nepal-blue mb-6 text-center">
        Forgot Password
      </h2>

      <p className="mb-6 text-center text-gray-700">
        Enter your registered email address and we will send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1 text-left">Email Address</label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-nepal-blue"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-nepal-blue text-white py-3 font-semibold rounded hover:bg-blue-700 transition"
        >
          Send Reset Link
        </button>
      </form>

      {message && (
        <p className="mt-6 text-center text-green-600 font-semibold">{message}</p>
      )}
    </div>
  );
}

export default ForgotPassword;
