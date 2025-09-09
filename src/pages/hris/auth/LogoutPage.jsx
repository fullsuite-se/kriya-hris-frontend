import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const LogoutPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout(); 
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return null;
};

export default LogoutPage;
