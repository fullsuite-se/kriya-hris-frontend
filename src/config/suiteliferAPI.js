import axios from "axios";

const suiteliferAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL_SL,
  withCredentials: true,
});

// suiteliferAPI.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
// suiteliferAPI.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
export default suiteliferAPI;
