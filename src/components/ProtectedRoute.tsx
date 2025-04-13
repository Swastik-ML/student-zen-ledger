
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("authenticated") === "true";

  if (!isAuthenticated && location.pathname !== "/login") {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && location.pathname === "/login") {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
