import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { validateLoginForm } from "../utils/validations";
import api from "../lib/api";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // General state
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Validation state - only show errors after form submission
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Clear validation errors after 3 seconds
  useEffect(() => {
    if (showValidationErrors) {
      const timer = setTimeout(() => {
        setEmailError("");
        setPasswordError("");
        setShowValidationErrors(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showValidationErrors]);

  // Handle email + password login
  const handleEmailPasswordLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Validate form before submission using utility function
    const validation = validateLoginForm(email, password);

    // Show validation errors only after form submission
    setEmailError(validation.emailError);
    setPasswordError(validation.passwordError);
    setShowValidationErrors(true);

    // If validation fails, stop submission
    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });

      // const data = await response.json();
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      if (response.status === 200 && data?.user && data?.accessToken) {
        // Store tokens and user data
        localStorage.setItem("accessToken", data.accessToken);

        console.log("data:", data);
        // Update Redux store
        dispatch(setUser(data.user));

        // Show success message
        setLoginSuccess(true);
        setLoginError("");

        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      setLoginError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (loginError) {
      setLoginError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (loginError) {
      setLoginError("");
    }
  };


  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 py-4"
      style={{ background: "#F4F6F8" }}
    >
      <div
        className="p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-sm sm:max-w-md cursor-pointer mx-auto"
        style={{
          background: "#fff",
          border: "1px solid #F3F3F3",
          boxShadow: "0 2px 8px 0 #F3F3F3",
        }}
      >
        <h2
          className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center"
          style={{ color: "#000" }}
        >
          Sign in
        </h2>

        {/* Email Login Form */}
        <form
          onSubmit={handleEmailPasswordLogin}
          className="space-y-4 sm:space-y-6"
        >
          <div>
            <label
              className="block mb-2 text-sm sm:text-base font-semibold"
              style={{ color: "#000" }}
            >
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base ${
                showValidationErrors && emailError
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
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
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base ${
                showValidationErrors && passwordError
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            {showValidationErrors && passwordError && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>
          {loginError && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{loginError}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading || loginSuccess}
            className="w-full mt-4 sm:mt-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-full border-0 cursor-pointer"
            style={{ background: "#2563EB", color: "#F4F6F8" }}
          >
            {isLoading
              ? "Signing in..."
              : loginSuccess
              ? "Success!"
              : "Sign in"}
          </Button>
        </form>

        <div className="my-4 sm:my-6">
          <hr />
        </div>
        <div className="mb-2 text-center">
          <span
            className="text-sm sm:text-base font-bold"
            style={{ color: "#000" }}
          >
            Don't have an account?
          </span>
          <Link to={'/create-account'}
            className="block w-full mt-2 text-sm sm:text-base underline"
            style={{
              color: "#2563EB",
              background: "none",
              border: "none",
              padding: "8px 0",
            }}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
