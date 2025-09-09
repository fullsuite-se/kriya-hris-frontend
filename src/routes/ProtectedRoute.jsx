import { useAuthStore } from "@/stores/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ service, feature }) => {
  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  const servicePermissionNames = decoded.servicePermissions.map(
    (p) => p.service_name
  );
  const accessPermissionNames = decoded.accessPermissions.map(
    (p) => p.feature_name
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const hasService = servicePermissionNames
    .map((s) => s.toLowerCase())
    .includes(service.toLowerCase());

  const hasFeature = accessPermissionNames
    .map((f) => f.toLowerCase())
    .includes(feature.toLowerCase());

  if (!hasService || !hasFeature) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
