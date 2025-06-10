// hooks/useLogoutOnReload.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; // not logoutAsync
import httpService from "../Services/httpService";

export default function useLogoutOnReload() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // ✅ Dispatch immediate local logout so UI reflects it
      dispatch(logout());

      // ✅ Then notify backend (no await needed)
      httpService.put(`/users/logout/${userId}`, null, {
        withCredentials: true,
      }).catch((err) => {
        console.error("Logout on reload failed", err);
      });
    }
  }, [dispatch]);
}
