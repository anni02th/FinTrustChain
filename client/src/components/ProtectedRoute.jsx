import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

// ProtectedRoute supports both: wrapping a single element as children,
// and grouping nested child routes by rendering an <Outlet /> when no children provided.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-[60vh]"><Loader /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children ? children : <Outlet />;
}
