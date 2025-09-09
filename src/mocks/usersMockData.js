export const services = ["HRIS", "ATS"];

export const features = [
  { service: "LOGIN", feature: "login", path: "/" },
  { service: "HRIS", feature: "Dashboard", path: "/hris" },
  { service: "HRIS", feature: "Employees", path: "/hris-employees" },
  { service: "HRIS", feature: "Configurations", path: "/hris-configurations" },
  { service: "ATS", feature: "Dashboard", path: "/ats" },
  { service: "ATS", feature: "Configurations", path: "/ats-configurations" },
];

export const users = [
  {
    id: "u1",
    name: "Benz Atencion",
    email: "benz@example.com",
    role: "SUPERADMIN",
    serviceAccess: ["HRIS", "ATS","LOGIN"],
    featureAccess: features.map((f) => f.path), // Full access
  },
  {
    id: "u2",
    name: "Jane User",
    email: "jane@example.com",
    role: "USER",
    serviceAccess: ["HRIS"],
    featureAccess: ["/hris", "/hris-employees"], // Limited access
  },
  {
    id: "u3",
    name: "Jim Doe",
    email: "jim@example.com",
    role: "USER",
    serviceAccess: ["ATS"],
    featureAccess: ["/ats"], // Limited access
  },
];

export const loggedInUser = users[0]; 
