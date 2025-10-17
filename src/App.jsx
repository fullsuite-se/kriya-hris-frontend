import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeesFilterProvider } from "./context/EmployeesFilterContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
import AuthHydration from "./utils/permissions/AuthHydration";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EmployeesFilterProvider>
        <UserProvider>
          <AuthHydration>
            <AppRoutes />
          </AuthHydration>
        </UserProvider>
      </EmployeesFilterProvider>
    </QueryClientProvider>
  );
}

export default App;
