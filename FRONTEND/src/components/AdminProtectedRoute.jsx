import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";
import { useEffect } from "react";

function AdminProtectedRoute({ children }) {
  const { currentUser, isAuthenticated, loading, checkAuth } = useAuth();
  useEffect(() => {
    checkAuth();
  }, []);
  if (loading) {
    return <p className="text-center py-10 text-[#2d6a1f] text-sm animate-pulse">Loading...</p>;
  }
  if (!isAuthenticated || currentUser?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default AdminProtectedRoute;
