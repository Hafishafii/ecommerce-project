import { Navigate, Outlet } from "react-router-dom";
import { useAuthCheck } from "../hooks/useAuthCheck";

const ProtectedRoute = () => {
  const { user, loading, checked } = useAuthCheck();

  if (!checked || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
