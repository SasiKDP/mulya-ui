// hooks/useAutoRefreshToken.js
// hooks/useAutoRefreshToken.js
import { useEffect } from "react";
import { refreshToken } from "../utils/refreshToken"; // ✅ adjust path if needed

const TOKEN_LIFESPAN_MS = 30 * 60 * 1000;
const REFRESH_BEFORE_MS = 5 * 60 * 1000;

export const useAutoRefreshToken = () => {
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshToken()
        .catch(err => {
          console.error("❌ Failed to refresh token:", err);
          // Optional: trigger logout or redirect to login
        });
    }, TOKEN_LIFESPAN_MS - REFRESH_BEFORE_MS); // Refresh every 25 minutes

    return () => clearInterval(refreshInterval);
  }, []);
};
