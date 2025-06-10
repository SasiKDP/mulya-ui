// src/hooks/useLogoutOnUnload.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import httpService from "../Services/httpService"; // adjust the path if needed

export default function useLogoutOnUnload() {
  const { userId: reduxUserId } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleUnload = async () => {
      const userId = reduxUserId || localStorage.getItem("userId");
      if (!userId) return;

      try {
        // Using axios PUT instead of navigator.sendBeacon
        await httpService.put(`/users/logout/${userId}`, {});
      } catch (err) {
        console.error("Logout failed during unload:", err);
      }
    };

    // Fires on tab close, refresh, or navigation
    window.addEventListener("unload", handleUnload);

    return () => window.removeEventListener("unload", handleUnload);
  }, [reduxUserId]);
}
