import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, roles: userRoles } = useSelector((state) => state.auth);
  const location = useLocation();

  // Convert roles to array if it's a string
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  // Check if the user is authenticated and has at least one of the required roles
  const hasAccess = isAuthenticated && 
    userRoles && requiredRoles.some(role => userRoles.includes(role));

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    // User is authenticated but doesn't have the required role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;