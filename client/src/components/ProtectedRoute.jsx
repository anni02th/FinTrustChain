import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-[60vh]"><Loader /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
