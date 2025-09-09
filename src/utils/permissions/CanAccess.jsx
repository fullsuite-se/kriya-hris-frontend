import { useAuthStore } from "@/stores/useAuthStore";

const CanAccess = ({ feature, children }) => {
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessPermissions = useAuthStore((state) => state.accessPermissions);

  if (!hydrated) return null;

  const allowed = accessPermissions.map((f) => f.toLowerCase());

  return allowed.includes(feature.toLowerCase()) ? children : null;
};

export default CanAccess;
