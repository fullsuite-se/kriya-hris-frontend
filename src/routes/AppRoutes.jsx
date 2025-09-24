import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import HrisDashboardPage from "@/pages/hris/dashboard/HrisDashboardPage";
import AllEmployeesPage from "@/pages/hris/employees/AllEmployeesPage";
import ConfigurationsPage from "@/pages/hris/configurations/ConfigurationsPage";
import AtsDashboardPage from "@/pages/ats/dashboard/AtsDashboardPage";
import AllApplicantsPage from "@/pages/ats/applicants/AllApplicantsPage";
import LoginPage from "@/pages/hris/auth/LoginPage";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import LogoutPage from "@/pages/hris/auth/LogoutPage";
import RedirectHomeRoute from "@/routes/RedirectHomeRoute";
import AddEmployeePage from "@/pages/hris/employees/AddEmployeePage";
import CompanyInfoPage from "@/pages/hris/company-info/CompanyInfoPage";
// import EditCompanyInfoPage from "@/pages/hris/company-info/EditCompanyInfoPage";
import EmployeeDetailsPage from "@/pages/hris/employees/employee-details-page/EmployeeDetailsPage";
import { EmployeeDetailsProvider } from "@/context/EmployeeDetailsContext";
import {
  CompanyDetailsContext,
  CompanyDetailsProvider,
} from "@/context/CompanyDetailsContext";
import AccessControlPage from "@/pages/hris/access-control/AccessControlPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<RedirectHomeRoute />} />
          {/* HRIS Routes */}
          <Route
            element={<ProtectedRoute service="HRIS" feature="HRIS Dashboard" />}
          >
            <Route path="hris" element={<HrisDashboardPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute service="HRIS" feature="Employee Management" />
            }
          >
            <Route path="hris/employees" element={<AllEmployeesPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute service="HRIS" feature="Employee Details Page" />
            }
          >
            <Route
              path="hris/employees/:employee_id"
              element={
                <EmployeeDetailsProvider>
                  <EmployeeDetailsPage />
                </EmployeeDetailsProvider>
              }
            />
          </Route>

          <Route
            element={<ProtectedRoute service="HRIS" feature="Add Employee" />}
          >
            <Route path="hris/employees/add" element={<AddEmployeePage />} />
          </Route>

          <Route
            element={<ProtectedRoute service="HRIS" feature="Company Info" />}
          >
            <Route
              path="hris/company"
              element={
                <CompanyDetailsProvider>
                  <CompanyInfoPage />
                </CompanyDetailsProvider>
              }
            />
          </Route>
          <Route
            element={
              <ProtectedRoute service="HRIS" feature="HRIS Configurations" />
            }
          >
            <Route
              path="hris/configurations"
              element={<ConfigurationsPage />}
            />
          </Route>

          <Route
            element={<ProtectedRoute service="HRIS" feature="Access Control" />}
          >
            <Route path="hris/access-control" element={<AccessControlPage />} />
          </Route>

        
        </Route>
        <Route
          element={
            <PrivateRoute>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;



//ats

  {/* ATS Routes */}
          // <Route
          //   element={<ProtectedRoute service="ATS" feature="ATS Dashboard" />}
          // >
          //   <Route path="ats" element={<AtsDashboardPage />} />
          // </Route>

          // <Route
          //   element={<ProtectedRoute service="ATS" feature="Applicants" />}
          // >
          //   <Route path="ats/applicants" element={<AllApplicantsPage />} />
          // </Route>