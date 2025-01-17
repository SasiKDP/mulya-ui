import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpForm from "./components/common/SignUpForm";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";  // Import ToastContainer
import JobForm from "./components/Requirements/JobForm";
import LeaveApplication from "./components/LeaveApplication";
import InterviewForm from "./components/InterviewForm";
import CandidateSubmissionForm from "./components/CandidateSubmissionFrom";
import AttendanceTracker from "./components/AttendanceTracker";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const { roles } = useSelector((state) => state.auth);

  return (
    <Router>
     
     
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

      <Routes>
        {/* Default Route */}
        <Route path="/" element={<SignUpForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/timesheet" element={<AttendanceTracker />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        

        {/* Protected Routes based on roles */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role={["ADMIN", "EMPLOYEE", "SUPERADMIN"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin-dashboard"
          element={
            <ProtectedRoute role="SUPERADMIN">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Other Routes */}
        <Route path="/jobform" element={<JobForm />} />
        <Route path="/leave" element={<LeaveApplication />} />
        <Route path="/interview" element={<InterviewForm />} />
        <Route path="/candidate-submission" element={<CandidateSubmissionForm />} />
      </Routes>
    </Router>
  );
}

export default App;
