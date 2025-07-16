import React from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, placeholder = "Enter OTP" }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
    />
  );
};

export default OtpInput;
