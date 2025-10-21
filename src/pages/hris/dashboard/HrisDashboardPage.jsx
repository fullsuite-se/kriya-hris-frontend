import { useHeader } from "@/context/HeaderContext";
import {
  CheckBadgeIcon,
  FolderPlusIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardDateTime from "./components/DashboardDateTime";
import { ExclamationCircleIcon, HeartIcon } from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import LoadingAnimation from "@/components/Loading";
import { useFetchEmployeeCountsAPI } from "@/hooks/useEmployeeAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
      description: "Summary or analytics here",
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
  const monthlyTrendsChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Employees",
        data: [5, 12, 8, 15, 20, 18, 25, 22, 30, 28, 35, 40],
        borderColor: "#008080",
        backgroundColor: "rgba(0,128,128,0.2)",
        pointBackgroundColor: "#008080",
        pointBorderColor: "#fff",
        pointRadius: 5,
        fill: true,
      },
      {
        label: "Resigned Employees",
        data: [2, 3, 1, 4, 6, 5, 3, 4, 6, 7, 5, 6],
        borderColor: "#cc5500",
        backgroundColor: "rgba(204,85,0,0.2)",
        pointBackgroundColor: "#cc5500",
        pointBorderColor: "#fff",
        pointRadius: 5,
        fill: true,
      },
    ],
  };

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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
          <div className="text-gray-500">Contents here</div>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Analytics
          </h3>
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ) : (
              <div className="h-[400px]">
                <Line
                  data={monthlyTrendsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          color: "#4B5563",
                        },
                      },
                      tooltip: {
                        mode: "index",
                        intersect: false,
                        backgroundColor: "rgba(0,0,0,0.8)",
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0,0,0,0.05)",
                        },
                        ticks: {
                          color: "#4B5563",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: "#4B5563",
                        },
                      },
                    },
                    elements: {
                      line: {
                        tension: 0.3,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrisDashboardPage;
