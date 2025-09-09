import api from "@/config/api";

export const loginUserAPI = async ({ email, password }) => {
  const response = await api.post("/api/auth/login", {
    user_email: email,
    password,
    service: "HRIS",
  });

  return response.data;
};
