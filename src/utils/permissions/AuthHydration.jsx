import { useAuthStore } from "@/stores/useAuthStore";

const AuthHydration = ({ children }) => {
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) return null;

  return children;
};

export default AuthHydration;
