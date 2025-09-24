// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "@/stores/useAuthStore";

// const RedirectHomeRoute = () => {
//   const { servicePermissions } = useAuthStore();

//   const lowered = servicePermissions.map((s) => s.toLowerCase());

//   if (lowered.includes("hris")) return <Navigate to="/hris" replace />;
//   if (lowered.includes("ats")) return <Navigate to="/ats" replace />;

//   return <Navigate to="/not-found" replace />;
// };

// export default RedirectHomeRoute;



import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate } from "react-router-dom";

const RedirectHomeRoute = () => {
  const { servicePermissions, accessPermissions } = useAuthStore();

  // Define a prioritized map of features → routes
  const featureToRoute = [
    { service: "HRIS", feature: "HRIS Dashboard", path: "/hris" },
    { service: "HRIS", feature: "Employee Management", path: "/hris/employees" },
    { service: "HRIS", feature: "Company Info", path: "/hris/company" },
    { service: "HRIS", feature: "HRIS Configurations", path: "/hris/configurations" },
    { service: "HRIS", feature: "Access Control", path: "/hris/access-control" },
    // You can add ATS, Payroll, etc. here later
  ];

  // Find the first route the user is allowed to access
  const allowedRoute = featureToRoute.find(
    (r) =>
      servicePermissions.includes(r.service) &&
      accessPermissions.includes(r.feature)
  );

  if (allowedRoute) {
    return <Navigate to={allowedRoute.path} replace />;
  }

  // If user has no valid route, send to NotFound
  return <Navigate to="/not-found" replace />;
};

export default RedirectHomeRoute;
