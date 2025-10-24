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
import { useFetchTenureDistributionAPI } from "@/hooks/useAnalyticsAPI";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TenureDistributionAnalytics() {
  const { data: tenureData, loading, error } = useFetchTenureDistributionAPI();

  const tenureColors = [
    { bg: "#004D4D", hover: "#006666" }, // 0–6 mos - Dark Teal
    { bg: "#006F6F", hover: "#008080" }, // 7 mos–1 yr - Teal
    { bg: "#009999", hover: "#00A3A3" }, // 2–4 yrs - Light Teal
    { bg: "#33B3B3", hover: "#2AA6A6" }, // 5–7 yrs - Soft Teal
    { bg: "#66CCCC", hover: "#55BEBE" }, // 8–10 yrs - Pale Teal
    { bg: "#99E6E6", hover: "#88D9D9" }, // 10+ yrs - Very Light Teal
  ];

  const chartData = tenureData
    ? {
        labels: tenureData.ageBrackets,
        datasets: tenureData.series.map((seriesItem, index) => ({
          label: seriesItem.tenureGroup,
          data: seriesItem.total, // Total percentage for each age bracket
          backgroundColor: tenureColors[index].bg,
          hoverBackgroundColor: tenureColors[index].hover,
          borderRadius: 6,
          barThickness: 22,
        })),
      }
    : null;

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tenure Distribution
      </h3>

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
                    boxWidth: 12,
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(0,0,0,0.8)",
                  bodyFont: { size: 12 },
                  padding: 10,
                  cornerRadius: 6,
                  callbacks: {
                    label: (context) => {
                      const datasetLabel = context.dataset.label;
                      const value = context.raw;
                      const ageBracket =
                        tenureData.ageBrackets[context.dataIndex];
                      const maleValue =
                        tenureData.series.find(
                          (s) => s.tenureGroup === datasetLabel
                        )?.male[context.dataIndex] || 0;
                      const femaleValue =
                        tenureData.series.find(
                          (s) => s.tenureGroup === datasetLabel
                        )?.female[context.dataIndex] || 0;

                      return [
                        `${datasetLabel}: ${value}%`,
                        `Male: ${maleValue}%`,
                        `Female: ${femaleValue}%`,
                      ];
                    },
                    afterLabel: (context) => {
                      const datasetLabel = context.dataset.label;
                      const ageBracket =
                        tenureData.ageBrackets[context.dataIndex];
                      const totalCount =
                        tenureData.counts[ageBracket]?.total || 0;
                      const tenureCount =
                        tenureData.counts[ageBracket]?.[datasetLabel]?.Total ||
                        0;

                      return `Employees: ${tenureCount} of ${totalCount}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  stacked: true,
                  ticks: {
                    color: "#4B5563",
                    callback: (value) => `${value}%`,
                  },
                  grid: { color: "rgba(0,0,0,0.05)" },
                  title: {
                    display: true,
                    text: "Percentage (%)",
                    color: "#4B5563",
                  },
                },
                x: {
                  stacked: true,
                  ticks: { color: "#4B5563" },
                  grid: { display: false },
                  title: {
                    display: true,
                    text: "Age Groups",
                    color: "#4B5563",
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
