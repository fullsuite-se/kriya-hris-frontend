import { useHeader } from "@/context/HeaderContext";
import {
  CheckBadgeIcon,
  FolderPlusIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import DashboardDateTime from "./components/DashboardDateTime";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import LoadingAnimation from "@/components/Loading";
import { useFetchEmployeeCountsAPI } from "@/hooks/useEmployeeAPI";
import MonthlyTrendsHiresResigneesAnalytics from "@/components/analytics/MonthlyTrendsHiresResigneesAnalytics";
import AttritionRateAnalytics from "@/components/analytics/AttritionRateAnalytics";
import { useNavigate } from "react-router-dom";

const statusIcons = {
  Regular: <CheckBadgeIcon width={20} className="text-[#008080]" />,
  Probationary: <FolderPlusIcon width={20} className="text-[#008080]" />,
  Separated: <XCircleIcon width={20} className="text-[#008080]" />,
};

const HrisDashboardPage = () => {
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();

  const handleStatusClick = (statusIds = null) => {
    const state = statusIds
      ? { statusFilter: Array.isArray(statusIds) ? statusIds : [statusIds] }
      : {};
    navigate("/hris/employees", { state });
  };

  useEffect(() => {
    setHeaderConfig({
      title: "HRIS Dashboard",
      description:
        "Monitor performance, track trends, and stay on top of HR operations",
      rightContent: <DashboardDateTime />,
    });
    document.title = "Dashboard";
  }, []);

  const {
    countsByStatus = [],
    activeCount = 0,
    loading,
    error,
  } = useFetchEmployeeCountsAPI();

  const fallbackStatuses = [
    {
      employment_status_id: "es1",
      employment_status: "Probationary",
      count: 0,
      newThisMonth: 0,
    },
    {
      employment_status_id: "es2",
      employment_status: "Regular",
      count: 0,
      newThisMonth: 0,
    },
    {
      employment_status_id: "es3",
      employment_status: "Separated",
      count: 0,
      newThisMonth: 0,
    },
  ];

  const statusWithNew = countsByStatus.length
    ? countsByStatus
    : fallbackStatuses;

  const activeStatusIds = statusWithNew
    .filter(
      (status) =>
        status.employment_status.toLowerCase() === "regular" ||
        status.employment_status.toLowerCase() === "probationary"
    )
    .map((status) => status.employment_status_id);
  return (
    <div className="flex flex-col min-h-screen gap-5">
      {loading && <LoadingAnimation />}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[minmax(100px,auto)]">
        <div className="col-span-1">
          <div
            className="bg-[#008080] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleStatusClick(activeStatusIds)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">
                Active Employees
              </h3>
              <UserGroupIcon width={20} className="text-white" />
            </div>
            <p className="text-6xl font-bold text-white">{activeCount}</p>
          </div>
        </div>

        {statusWithNew.map((status) => (
          <div key={status.employment_status_id} className="col-span-1">
            <div
              className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleStatusClick(status.employment_status_id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {status.employment_status}
                </h3>
                {statusIcons[status.employment_status] || (
                  <UserGroupIcon width={20} className="text-[#008080]" />
                )}
              </div>
              <p className="text-3xl font-bold text-[#008080]">
                {status.count}
              </p>
              <span className="text-sm text-gray-500 mt-2">
                +{status.newThisMonth} this month
              </span>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl shadow-sm p-5 col-span-1 lg:col-span-2 lg:row-span-2">
          <MonthlyTrendsHiresResigneesAnalytics />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 col-span-1 lg:col-span-2 lg:row-span-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Updates</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="border-b pb-2 flex">
              <ExclamationCircleIcon className="w-4 text-[#008080] mr-2" /> An
              update here
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 col-span-1 lg:col-span-2 lg:row-span-2">
          <AttritionRateAnalytics />
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center text-sm italic text-muted-foreground mt-4">
          Failed to load. Please try again later.
        </div>
      )}
    </div>
  );
};

export default HrisDashboardPage;
