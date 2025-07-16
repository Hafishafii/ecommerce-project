import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetOTPType } from "../hooks/useGetOTPType";
import OtpInput from "../components/otp/OtpInput";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const OtpEntryPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { type, method, loading, error } = useGetOTPType(token);
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    try {
      if (!token) {
        setSubmitError("Token missing.");
        return;
      }

      if (!otp) {
        setSubmitError("OTP is required.");
        return;
      }

      if (type === "PASSWORD_RESET") {
        if (!newPassword) {
          setSubmitError("New password is required.");
          return;
        }

        const res = await axios.post(`http://localhost:3000/api/auth/reset-password?token=${token}`, {
          otp,
          newPassword,
        });

        setSuccessMessage(res.data.message || "Password reset successful.");
      } else {
        const res = await axios.post(`http://localhost:3000/api/auth/verify-otp?token=${token}`, {
          otp,
        });

        setSuccessMessage(res.data.message || "OTP verified successfully.");
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (!loading && type) {
      switch (type) {
        case "PASSWORD_RESET":
          setContent(
            <div>
              <p className="mb-4">
                Please reset your password using the OTP sent via{" "}
                {method === "OTP_EMAIL" ? "Email" : "Phone"}.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <OtpInput value={otp} onChange={setOtp} />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </form>
            </div>
          );
          break;

        case "LOGIN":
        case "CREATE_ACCOUNT":
        case "VERIFY_EMAIL":
          setContent(
            <div>
              <p className="mb-4">
                Please verify OTP sent via {method === "OTP_EMAIL" ? "Email" : "Phone"}.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <OtpInput value={otp} onChange={setOtp} />
                <Button type="submit" className="w-full" variant="secondary">
                  Verify OTP
                </Button>
              </form>
            </div>
          );
          break;

        default:
          setContent(<div>Unknown verification type.</div>);
      }
    }
  }, [type, method, loading, otp, newPassword]);

  if (loading) return <div className="text-center mt-10">Checking your token...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">OTP Verification</h1>
        {submitError && <div className="text-red-500 mb-2">{submitError}</div>}
        {successMessage && <div className="text-green-600 mb-2">{successMessage}</div>}
        {content}
      </div>
    </div>
  );
};

export default OtpEntryPage;
