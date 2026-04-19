import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("studyhub_admin") || "null");
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}