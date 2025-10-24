import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import BarChartSkeleton from "./BarChartSkeleton";
import { useFetchAgeDistributionAPI } from "@/hooks/useAnalyticsAPI";
import { ChartColumnStackedIcon } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AgeDistributionAnalytics() {
  const { data: ageData, loading, error } = useFetchAgeDistributionAPI();

  const chartData = ageData
    ? {
        labels: ageData.ageGroups.map((g) => g.label),
        datasets: [
          {
            label: "Male",
            data: ageData.ageGroups.map((g) => g.male),
            backgroundColor: "#CC5500",
            borderRadius: 6,
            barThickness: 22,
          },
          {
            label: "Female",
            data: ageData.ageGroups.map((g) => g.female),
            backgroundColor: "#008080",
            borderRadius: 6,
            barThickness: 22,
          },
        ],
      }
    : null;

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <ChartColumnStackedIcon className="w-5 h-5 text-primary-color" />
        <h5 className=" font-semibold text-gray-800 mb-1"> Age Distribution</h5>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Percentage of employees by age group, split by sex
      </p>
      <div className="p-4 md:p-6 h-[450px]">
        {loading ? (
          <BarChartSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center h-full text-muted-foreground italic">
            Failed to load chart: {error}
          </div>
        ) : chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#4B5563",
                    usePointStyle: true,
                    padding: 30,
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(0,0,0,0.8)",
                  bodyFont: { size: 12 },
                  padding: 10,
                  cornerRadius: 6,
                  callbacks: {
                    label: (ctx) =>
                      `${ctx.dataset.label}: ${ctx.raw} employees`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "#4B5563",
                    callback: (value) => `${value}`,
                  },
                  grid: { color: "rgba(0,0,0,0.05)" },
                },
                x: {
                  ticks: { color: "#4B5563" },
                  grid: { display: false },
                },
              },
            }}
          />
        ) : null}
      </div>
    </>
  );
}
