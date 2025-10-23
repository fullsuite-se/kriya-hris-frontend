import React, { useState } from "react";
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
import { useFetchAvailableYearsAPI } from "@/hooks/useAnalyticsAPI";
import { useFetchAttritionRateAPI } from "@/hooks/useAnalyticsAPI";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AttritionRateAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { years: availableYears, loading: yearsLoading } =
    useFetchAvailableYearsAPI();
  const {
    data: attritionData,
    loading: attritionLoading,
    error: attritionError,
  } = useFetchAttritionRateAPI(selectedYear);

  const chartData = attritionData
    ? {
        labels: attritionData.labels,
        datasets: [
          {
            label: "Attrition Rate (%)",
            data: attritionData.data.map((item) => item.attritionRate),
            backgroundColor: "#cc5500",
            borderRadius: 6,
            barThickness: 22,
          },
        ],
      }
    : null;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Attrition Rate</h3>

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

      <div className="p-4 md:p-6 h-[450px]">
        {attritionLoading ? (
          <BarChartSkeleton />
        ) : attritionError ? (
          <div className="flex items-center justify-center h-full text-muted-foreground italic">
            Failed to load chart: {attritionError}
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
                    label: (ctx) => {
                      const monthData = attritionData.data[ctx.dataIndex];
                      return [
                        `Attrition Rate: ${monthData.attritionRate}%`,
                        `Average Employees: ${monthData.avgEmployees}`,
                        `Separations: ${monthData.separations}`,
                      ];
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "#4B5563",
                    callback: (value) => `${value}%`,
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
};

export default AttritionRateAnalytics;
