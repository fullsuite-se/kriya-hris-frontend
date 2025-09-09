import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useAuthStore } from "@/stores/useAuthStore";
import useFetchLoggedInUserDetailsAPI from "@/hooks/useEmployeeAPI";
import useAutoLogout from "@/hooks/useAutoLogout";

const MainLayout = () => {
  const { loading } = useContext(UserContext);

  const { systemUserId } = useAuthStore();
  useFetchLoggedInUserDetailsAPI(systemUserId);
  useAutoLogout();
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 pb-0">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-10 w-10 border-t-5 border-b-5 border-primary-color mr-2 inline-block"></div>
            </div>
          ) : (
            <div>
              <Header />
              <Outlet />
              <div className="py-5"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
