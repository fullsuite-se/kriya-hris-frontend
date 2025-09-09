import BarsIcon from "@/assets/icons/BarsIcon";
import { useEffect, useRef, useState } from "react";

export default function DrawerToggle({ onClick }) {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    setIsVisible(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  useEffect(() => {
    const events = ["scroll", "touchstart", "mousemove", "keydown"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`fixed top-4 left-4 z-50 sm:hidden bg-white rounded-full shadow p-2 cursor-pointer transition-all duration-500 ease-in-out
  ${
    isVisible
      ? "opacity-100 translate-x-0"
      : "opacity-0 -translate-x-2 pointer-events-none"
  }`}
      onClick={onClick}
    >
      <BarsIcon className="text-[#008080]" />
    </div>
  );
}
