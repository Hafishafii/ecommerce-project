import { useEffect, useState } from "react";
import axios from "axios";

export const useGetOTPType = (token: string | null) => {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Missing token");
      setLoading(false);
      return;
    }

    const fetchOTPType = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/auth/otp-type?token=${token}`);
        setType(res.data.type);
        setMethod(res.data.method);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error verifying token");
      } finally {
        setLoading(false);
      }
    };

    fetchOTPType();
  }, [token]);

  return { type, method, loading, error };
};
