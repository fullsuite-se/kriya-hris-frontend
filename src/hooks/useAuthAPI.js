import { useState } from "react";
import api from "@/config/api";

export const useLoginUserAPI = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/login", {
        user_email: email,
        password,
        service: "HRIS",
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, data, error, loading };
};
