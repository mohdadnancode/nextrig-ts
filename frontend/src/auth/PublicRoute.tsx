import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth/useAuth";
import type { ReactNode } from "react";

type PublicRouteProps = {
  children: ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
