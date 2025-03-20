// In components/ProtectedRolePage.jsx (New component)
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Component to protect individual route components based on role
const ProtectedRolePage = ({ children, allowedRoles }) => {
  const { roles } = useSelector((state) => state.auth);
  const location = useLocation();

  // Convert roles to array if it's a string
  const requiredRoles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // Check if user has at least one of the required roles
  const hasAccess = roles && requiredRoles.some(role => roles.includes(role));

  if (!hasAccess) {
    // User doesn't have the required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRolePage;