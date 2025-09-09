import { EmployeesFilterProvider } from "./context/EmployeesFilterContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
import AuthHydration from "./utils/permissions/AuthHydration";

function App() {
  return (
    <EmployeesFilterProvider>
      <UserProvider>
        <AuthHydration>
          <AppRoutes />
        </AuthHydration>
      </UserProvider>
    </EmployeesFilterProvider>
  );
}

export default App;
