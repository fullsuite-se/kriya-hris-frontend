import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useFetchSexDistributionAPI } from "@/hooks/useAnalyticsAPI";
import PieChartSkeleton from "./PieChartSkeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SexDistributionAnalytics() {
  const { data: sexData, loading, error } = useFetchSexDistributionAPI();

  const chartData = sexData
    ? {
        labels: sexData.labels.map((label, i) => {
          const count = sexData.counts[i];
          return `${label} (${count})`;
        }),
        datasets: [
          {
            data: sexData.percentages,
            backgroundColor: ["#008080", "#CC5500"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sex Distribution
      </h3>

      <div className="p-4 md:p-6 h-[380px] flex items-center justify-center">
        {loading ? (
          <PieChartSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center h-full text-muted-foreground italic">
            Failed to load chart: {error}
          </div>
        ) : chartData ? (
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "60%",
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
                      const percent = sexData.percentages[ctx.dataIndex];
                      return ` ${percent}%`;
                    },
                  },
                },
              },
            }}
          />
        ) : null}
      </div>
    </>
  );
}
