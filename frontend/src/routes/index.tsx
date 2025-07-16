import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Cart, CreateAccount, Home, Login } from "../pages";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import OtpEntryPage from "../pages/OtpEntryPage"; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/otp" element={<OtpEntryPage />} /> 

      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
