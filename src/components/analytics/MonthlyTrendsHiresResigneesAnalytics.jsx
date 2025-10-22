import React, { useState } from "react";
import { Line } from "react-chartjs-2";
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
import LineChartSkeleton from "./LineChartSkeleton";
import {
  useFetchAvailableYearsAPI,
  useFetchMonthlyTrendsAPI,
} from "@/hooks/useAnalyticsAPI";

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

const NewHiresResigneesLineChart = ({
  monthlyTrends,
  trendsLoading,
  trendsError,
}) => {
  if (trendsLoading) return <LineChartSkeleton />;

  if (trendsError) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground italic">
        Failed to load analytics: {trendsError}
      </div>
    );
  }

  if (!monthlyTrends) return null;

  return (
    <div className="h-[400px]">
      <Line
        data={monthlyTrends}
        options={{
          responsive: true,
          maintainAspectRatio: false,
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
              grid: { color: "rgba(0,0,0,0.05)" },
              ticks: { color: "#4B5563" },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#4B5563" },
            },
          },
          elements: {
            line: { tension: 0.3 },
          },
        }}
      />
    </div>
  );
};

const MonthlyTrendsHiresResigneesAnalytics = ({ title = "Monthly Trends" }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { years: availableYears, loading: yearsLoading } =
    useFetchAvailableYearsAPI();

  const {
    data: monthlyTrends,
    loading: trendsLoading,
    error: trendsError,
  } = useFetchMonthlyTrendsAPI(selectedYear);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        {!yearsLoading && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="p-4 md:p-6">
        <NewHiresResigneesLineChart
          monthlyTrends={monthlyTrends}
          trendsLoading={trendsLoading}
          trendsError={trendsError}
        />
      </div>
    </>
  );
};

export default MonthlyTrendsHiresResigneesAnalytics;
