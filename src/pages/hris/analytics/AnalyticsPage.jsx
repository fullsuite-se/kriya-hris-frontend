import { useHeader } from "@/context/HeaderContext";
import { useEffect } from "react";
import MonthlyTrendsHiresResigneesAnalytics from "@/components/analytics/MonthlyTrendsHiresResigneesAnalytics";
import AttritionRateAnalytics from "@/components/analytics/AttritionRateAnalytics";
import SexDistributionAnalytics from "@/components/analytics/SexDistributionAnalytics";
import AgeDistributionAnalytics from "@/components/analytics/AgeDistributionAnalytics";
import EmploymentStatusAnalytics from "@/components/analytics/EmploymentStatusAnalytics";
import TenureDistributionAnalytics from "@/components/analytics/TenureDistributionAnalytics";

export default function AnalyticsPage() {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: "Analytics",
      description:
        "Discover trends, spot issues, and make data-backed HR decisions",
    });
    document.title = "Analytics";
  }, []);

  return (
    <div className="space-y-6">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 h-24 flex items-center justify-center text-gray-500">
          KPI 1
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 h-24 flex items-center justify-center text-gray-500">
          KPI 2
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 h-24 flex items-center justify-center text-gray-500">
          KPI 3
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 h-24 flex items-center justify-center text-gray-500">
          KPI 4
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 ">
          <MonthlyTrendsHiresResigneesAnalytics title="Monthly Trends" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 ">
          <TenureDistributionAnalytics />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 ">
          <AttritionRateAnalytics />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 ">
          <EmploymentStatusAnalytics />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 ">
          <SexDistributionAnalytics />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 ">
          <AgeDistributionAnalytics />
        </div>
      </div>
    </div>
  );
}
