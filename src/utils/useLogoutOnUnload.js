import { useEffect } from "react";
import axios from "axios";
import BASE_URL from "../redux/config";
import { useSelector } from "react-redux";

const UseLogoutOnUnload = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user;

  useEffect(() => {
    const handleUnload = async () => {
      try {
        await axios.put(`${BASE_URL}/users/logout/${userId}`, {}, { withCredentials: true });
      } catch (error) {
        console.error("Logout failed on unload:", error);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId]);

  return null;
};

export default UseLogoutOnUnload;
