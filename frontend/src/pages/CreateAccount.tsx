import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateRegistrationForm } from "../utils/validations";
import api from "../lib/api";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("IN +91");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validation state - only show errors after form submission
  const [mobileError, setMobileError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Clear validation errors after 3 seconds
  useEffect(() => {
    if (showValidationErrors) {
      const timer = setTimeout(() => {
        setMobileError("");
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setShowValidationErrors(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showValidationErrors]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields using utility function
    const validation = validateRegistrationForm(
      mobile,
      name,
      email,
      password,
      countryCode
    );

    // Show validation errors only after form submission
    setMobileError(validation.mobileError);
    setNameError(validation.nameError);
    setEmailError(validation.emailError);
    setPasswordError(validation.passwordError);
    setShowValidationErrors(true);

    // If validation fails, stop submission
    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Extract phone number - backend expects 10 digits starting with 6-9
      let phoneNumber = mobile.replace(/\D/g, ""); // Remove non-digits

      // Ensure it's exactly 10 digits for Indian numbers
      if (countryCode === "IN +91") {
        // Remove country code if present
        if (phoneNumber.startsWith("91")) {
          phoneNumber = phoneNumber.substring(2);
        }
        // Ensure it's 10 digits
        if (phoneNumber.length !== 10) {
          setError("Phone number must be exactly 10 digits");
          setIsLoading(false);
          return;
        }
        // Ensure it starts with 6-9
        if (!/^[6-9]/.test(phoneNumber)) {
          setError("Phone number must start with 6, 7, 8, or 9");
          setIsLoading(false);
          return;
        }
      }

      const requestData = {
        phone: phoneNumber,
        name,
        email,
        password,
      };

      console.log("📝 Create Account Form Data:", {
        countryCode,
        mobile,
        name,
        email,
        password: "***hidden***",
      });
      console.log("📤 Sending to backend:", {
        ...requestData,
        password: "***hidden***",
      });

      // const response = await fetch('/api/auth/send-otp?type=CREATE_ACCOUNT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(requestData)
      // });

      // const data = await response.json();
      const response = await api.post(
        "/auth/send-otp?type=CREATE_ACCOUNT",
        requestData
      );
      const data = response.data;
      console.log(" OTP Response Data:", data);
      console.log("Token received:", data.token);

      if (response.status === 200) {
        setSuccess(true);
        setError("");

        // Navigate to OTP verification route with token
        setTimeout(() => {
          console.log("Navigating to verify-otp with token:", data.token);
          navigate("/verify-otp", {
            state: {
              token: data.token,
              phone: phoneNumber,
              type: "CREATE_ACCOUNT",
            },
          });
        }, 20000);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Network error details:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError(
          "Cannot connect to server. Please check if the backend is running."
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    const field = e.target.name;

    switch (field) {
      case "mobile":
        setMobile(value);
        break;
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "countryCode":
        setCountryCode(value);
        break;
    }

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 py-4"
      style={{ background: "#F4F6F8" }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-sm sm:max-w-md cursor-pointer mx-auto"
        style={{
          background: "#fff",
          border: "1px solid #F3F3F3",
          boxShadow: "0 2px 8px 0 #F3F3F3",
        }}
      >
        <h2
          className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
          style={{ color: "#000" }}
        >
          Create Account
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label
              className="block mb-2 text-sm sm:text-base font-semibold"
              style={{ color: "#000" }}
            >
              Mobile number
            </label>
            <div className="flex">
              <select
                name="countryCode"
                value={countryCode}
                onChange={handleInputChange}
                className="rounded-l px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 bg-gray-100 text-sm sm:text-base"
                style={{ minWidth: 90, color: "#000", borderColor: "#F3F3F3" }}
              >
                <option value="IN +91">IN +91</option>
                <option value="US +1">US +1</option>
                <option value="UK +44">UK +44</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                name="mobile"
                type="tel"
                placeholder="Mobile number"
                value={mobile}
                onChange={handleInputChange}
                className={`flex-1 rounded-r px-3 py-2 sm:py-3 border-t border-b border-r border-gray-300 focus:outline-none text-sm sm:text-base ${
                  showValidationErrors && mobileError
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                style={{
                  background: "#fff",
                  color: "#000",
                  borderColor:
                    showValidationErrors && mobileError ? "#EF4444" : "#F3F3F3",
                }}
              />
            </div>
            {showValidationErrors && mobileError && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {mobileError}
              </p>
            )}
          </div>
          <div>
            <label
              className="block mb-2 text-sm sm:text-base font-semibold"
              style={{ color: "#000" }}
            >
              Your name
            </label>
            <input
              name="name"
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:py-3 rounded border border-gray-300 focus:outline-none text-sm sm:text-base ${
                showValidationErrors && nameError
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
              style={{
                background: "#fff",
                color: "#000",
                borderColor:
                  showValidationErrors && nameError ? "#EF4444" : "#F3F3F3",
              }}
            />
            {showValidationErrors && nameError && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {nameError}
              </p>
            )}
          </div>
          <div>
            <label
              className="block mb-2 text-sm sm:text-base font-semibold"
              style={{ color: "#000" }}
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:py-3 rounded border border-gray-300 focus:outline-none text-sm sm:text-base ${
                showValidationErrors && emailError
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
              style={{
                background: "#fff",
                color: "#000",
                borderColor:
                  showValidationErrors && emailError ? "#EF4444" : "#F3F3F3",
              }}
            />
            {showValidationErrors && emailError && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {emailError}
              </p>
            )}
          </div>
          <div>
            <label
              className="block mb-2 text-sm sm:text-base font-semibold"
              style={{ color: "#000" }}
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder=""
              value={password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:py-3 rounded border border-gray-300 focus:outline-none text-sm sm:text-base ${
                showValidationErrors && passwordError
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
              style={{
                background: "#fff",
                color: "#000",
                borderColor:
                  showValidationErrors && passwordError ? "#EF4444" : "#F3F3F3",
              }}
            />
            {showValidationErrors && passwordError && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-xl" style={{ color: "#2563EB" }}></span>
            <span className="text-xs" style={{ color: "#2563EB" }}>
              Password must be at least 6 characters with one uppercase, one
              lowercase, and one digit.
            </span>
          </div>
          <div className="text-xs sm:text-sm" style={{ color: "#000" }}>
            To verify your number, we will send you a text message with a
            temporary code. Message and data rates may apply.
          </div>
          {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-xs sm:text-sm">
              {" "}
              OTP sent successfully!
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-5 text-sm sm:text-base font-semibold rounded-full border-0"
            style={{
              background: "#2563EB",
              color: "#F4F6F8",
              fontWeight: "bold",
            }}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
        <div className="my-4 sm:my-6">
          <hr />
        </div>
        <div className="mb-2 text-center">
          <span
            className="text-sm sm:text-base font-bold"
            style={{ color: "#000" }}
          >
            Already a customer?
          </span>
          <button
            type="button"
            className="block w-full mt-2 text-sm sm:text-base underline"
            style={{
              color: "#2563EB",
              background: "none",
              border: "none",
              padding: "8px 0",
            }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
