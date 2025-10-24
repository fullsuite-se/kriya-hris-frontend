import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PieChartSkeleton from "./PieChartSkeleton";
import { useFetchEmployeeCountsAPI } from "@/hooks/useEmployeeAPI";
import { ChartPieIcon } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EmploymentStatusAnalytics() {
  const { countsByStatus, loading, error } = useFetchEmployeeCountsAPI();

  const total = countsByStatus.reduce((sum, status) => sum + status.count, 0);

  const chartData = {
    labels: countsByStatus.map(
      (status) => `${status.employment_status} (${status.count})`
    ),
    datasets: [
      {
        data: countsByStatus.map((status) => status.count),
        backgroundColor: ["#59b3b3", "#008080", "#a5d6d6"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <ChartPieIcon className="w-5 h-5 text-primary-color" />
        <h5 className=" font-semibold text-gray-800 mb-1">Employment Status</h5>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Percentage of employees by employment status
      </p>
      <div className="p-4 md:p-6 h-[380px] flex items-center justify-center">
        {loading ? (
          <PieChartSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center h-full text-muted-foreground italic">
            Failed to load chart: {error}
          </div>
        ) : (
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              // cutout: "60%", // donut
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    usePointStyle: true,
                    padding: 30,
                    color: "#4B5563",
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const status = countsByStatus[ctx.dataIndex];
                      const percent =
                        total > 0
                          ? ((status.count / total) * 100).toFixed(2)
                          : 0;
                      return `${status.employment_status}: ${status.count} employees (${percent}%)`;
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
}
