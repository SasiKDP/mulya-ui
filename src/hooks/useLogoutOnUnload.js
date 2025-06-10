// src/hooks/useLogoutOnUnload.js
import { useEffect } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:8081"; // Adjust for prod

export default function useLogoutOnUnload() {
  const { userId: reduxUserId } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const userId = reduxUserId || localStorage.getItem("userId");
      if (!userId) return;

      const url = `${API_BASE_URL}/users/logout/${userId}`;
      const blob = new Blob([], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [reduxUserId]);
}
