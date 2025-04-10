import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NotFound.css"; // 🔄 custom styles here

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container d-flex justify-content-center align-items-center vh-100">
      <div className="notfound-card position-relative p-5 bg-white rounded shadow text-center">
        <div className="animated-border"></div> {/* 🔄 Animated border */}
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h4 className="text-secondary mb-3">Oops! Page not found</h4>
        <p className="text-muted mb-4">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button onClick={() => navigate("/dashboard")} className="btn btn-outline-success px-4 py-2">
            Dashboard
          </button>
          <button onClick={() => navigate("/")} className="btn btn-outline-secondary px-4 py-2">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
