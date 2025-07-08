import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const  Unauthorized= () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="display-1 fw-bold text-danger"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
      >
        403
      </motion.h1>

      <motion.h4
        className="mb-3 text-secondary"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Unauthorized Access
      </motion.h4>

      <motion.p
        className="text-muted mb-4"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        You do not have permission to view this page.
      </motion.p>

      <motion.div
        className="d-flex flex-wrap justify-content-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={() => navigate("/")}
          className="btn btn-outline-warning px-4 py-2"
        >
          Login
        </button>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-dark px-4 py-2"
        >
          Go Back
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Unauthorized;
