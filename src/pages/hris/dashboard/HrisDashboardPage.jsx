import { useHeader } from "@/context/HeaderContext";
import {
  CheckBadgeIcon,
  FolderPlusIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import DashboardDateTime from "./components/DashboardDateTime";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import LoadingAnimation from "@/components/Loading";
import { useFetchEmployeeCountsAPI } from "@/hooks/useEmployeeAPI";
import MonthlyTrendsHiresResigneesAnalytics from "../../../components/analytics/MonthlyTrendsHiresResigneesAnalytics";
import AttritionRateAnalytics from "@/components/analytics/AttritionRateAnalytics";

const statusIcons = {
  Regular: <CheckBadgeIcon width={20} className="text-[#008080]" />,
  Probationary: <FolderPlusIcon width={20} className="text-[#008080]" />,
  Separated: <XCircleIcon width={20} className="text-[#008080]" />,
};

const HrisDashboardPage = () => {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: "HRIS Dashboard",
      description: "Monitor performance, track trends, and stay on top of HR operations",
      rightContent: <DashboardDateTime />,
    });
  }, []);

  const { employeeCounts, loading, error } = useFetchEmployeeCountsAPI();

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  if (loading) return <LoadingAnimation />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }

  const { activeCount, countsByStatus = [] } = employeeCounts || {};

  const statusWithNew = countsByStatus.sort((a, b) =>
    a.employment_status.localeCompare(b.employment_status)
  );

  return (
    <div className="flex flex-col min-h-screen gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[minmax(100px,auto)]">
        <div className="col-span-1">
          {/* <Link to="/hris/employees" className="col-span-1"> */}
          <div className="bg-[#008080] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">
                Active Employees
              </h3>
              <UserGroupIcon width={20} className="text-white" />
            </div>
            <p className="text-6xl font-bold text-white">{activeCount}</p>
          </div>
          {/* </Link> */}
        </div>

        {statusWithNew.map((status) => (
          <div key={status.employment_status_id} className="col-span-1">
            {/* <Link to="/hris/employees" key={status.employment_status_id} className="col-span-1"> */}
            <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
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
            {/* </Link> */}
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
          {/* <img src={underConstructionImg} alt="under construction" className="grayscale" /> */}
        </div>

         <div className="bg-white rounded-2xl shadow-sm p-5  col-span-1 lg:col-span-2 lg:row-span-2">
          <AttritionRateAnalytics />
        </div>

        {/* <div className="bg-white rounded-2xl shadow-sm p-5 col-span-1 lg:col-span-2 lg:row-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
          <div className="text-gray-500">Contents here</div>

          <img src={underConstructionImg} alt="under construction" className="grayscale" />
        </div> */}
      </div>
    </div>
  );
};

export default HrisDashboardPage;
