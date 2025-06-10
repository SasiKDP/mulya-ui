// utils/refreshToken.js
import httpService from "../Services/httpService";

export const refreshToken = async () => {
  try {
    await httpService.post("/users/refresh-token");

    console.log("✅ Token refreshed successfully at", new Date().toLocaleTimeString());
    return true;
  } catch (err) {
    console.error("❌ Token refresh failed:", err?.response?.data || err.message);
    return false;
  }
};
