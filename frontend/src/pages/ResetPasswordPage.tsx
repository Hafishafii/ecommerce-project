import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const ResetPasswordCard = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/request-otp", {
        identifier: emailOrPhone,
        type: "PASSWORD_RESET",
      });

      setMessage("OTP sent. Please check your email or phone.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-sm p-6 sm:p-8">
      {/* Back to login link */}
      <div className="mb-4">
        <Link to="/login" className="text-sm text-blue-600 hover:underline">
          &larr; Back to login
        </Link>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Forget your password?</h2>
      <p className="text-sm text-gray-600 mb-6">
        Don’t worry, it happens. Enter your email or phone below to recover your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Email or Phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          <span className="absolute right-3 top-2 text-sm text-blue-600 cursor-pointer hover:underline">
            Forgot?
          </span>
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>

      {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ResetPasswordCard;
