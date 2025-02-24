import React, { useEffect, useState } from "react";
import { Avatar, Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/features/employeesSlice";

const UserAvatar = ({ size = 40, border = true }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Fetch user and employees data from Redux
  const { user } = useSelector((state) => state.auth);
  const { employeesList } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  // Get current user from employees list
  const currentUser =
    employeesList.find((emp) => emp.employeeId === user) || user || {};

  // Extract initials from the user name
  const getInitials = () => {
    if (currentUser.userName) {
      const nameParts = currentUser.userName.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return currentUser.userName[0].toUpperCase();
    }
    return "U";
  };

  // Generate avatar background color dynamically
  const getAvatarColor = () => {
    const colors = [
      "#3f51b5", "#f44336", "#009688", "#673ab7", "#ff9800",
      "#2196f3", "#e91e63", "#4caf50", "#ffeb3b", "#9c27b0",
      "#795548", "#607d8b", "#ff5722", "#8bc34a", "#cddc39"
    ];
    const index = currentUser.userName
      ? currentUser.userName.charCodeAt(0) % colors.length
      : 0;
    return colors[index];
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <CircularProgress size={size / 2} />
      ) : (
        <Avatar
          src={currentUser.profileImage || ""}
          sx={{
            width: size,
            height: size,
            bgcolor: currentUser.profileImage ? "transparent" : getAvatarColor(),
            color: currentUser.profileImage ? "inherit" : "white",
            fontWeight: "500",
            border: border ? `2px solid ${getAvatarColor()}` : "none",
          }}
        >
          {!currentUser.profileImage && getInitials()}
        </Avatar>
      )}
    </Box>
  );
};

export default UserAvatar;
