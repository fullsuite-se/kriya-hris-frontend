import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const INACTIVITY_LIMIT = 30 * 60 * 1000;

const useAutoLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      logout();
      navigate("/logout");
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
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
    };
  }, []);
};

export default useAutoLogout;
