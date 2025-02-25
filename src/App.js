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
import PreventNavigation from "./components/common/PreventNavigation";
import SignUpFormMain from "./components/Registration/SignUpFormMain";
import UseLogoutOnUnload from "./utils/useLogoutOnUnload";
import SignInMain from "./components/Registration/SignInMain";




function App() {
  const { roles } = useSelector((state) => state.auth);

  return (
    <Router>
     
     <PreventNavigation />
     <UseLogoutOnUnload />
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
        style={{ marginTop: '5%' }} 
      />

      <Routes>
        {/* Default Route */}
        <Route path="/" element={<SignInMain />} />
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

      
        
      </Routes>
    </Router>
  );
}

export default App;
