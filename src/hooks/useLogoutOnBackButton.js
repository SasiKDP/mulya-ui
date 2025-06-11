// src/hooks/useLogoutOnBackButton.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import httpService from "../Services/httpService";

// Define your app's internal route prefixes
const appRoutePrefixes = ["/dashboard", "/login", "/access", "/unauthorized"];

export default function useLogoutOnBackButton() {
  const { userId: reduxUserId } = useSelector((state) => state.auth);

  useEffect(() => {
    const logout = async () => {
      const userId = reduxUserId || localStorage.getItem("userId");
      if (!userId) return;

      try {
        await httpService.put(`/users/logout/${userId}`, {});
        console.log("Logged out via back button");
      } catch (error) {
        console.warn("Logout failed on back button");
      }
    };

    const handlePopState = () => {
      const currentPath = window.location.pathname;

      const isInsideApp = appRoutePrefixes.some((prefix) =>
        currentPath.startsWith(prefix)
      );

      if (!isInsideApp) {
        logout();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [reduxUserId]);
}
