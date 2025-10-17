import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

const INACTIVITY_LIMIT = 30 * 60 * 1000;
const useAutoLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const timerRef = useRef(null);

  const isTokenExpired = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return true;

      const decoded = jwtDecode(token);
      if (!decoded?.exp) return true;

      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (err) {
      return true;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/logout");
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      handleLogout("inactivity");
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    if (isTokenExpired()) {
      handleLogout("invalid token");
      return;
    }

    const tokenCheckInterval = setInterval(() => {
      if (isTokenExpired()) {
        handleLogout();
      }
    }, 60 * 60 * 1000);

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "click",
      "touchstart",
      "touchmove",
      "pointermove",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef.current);
      clearInterval(tokenCheckInterval);
    };
  }, []);
};

export default useAutoLogout;
