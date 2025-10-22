import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartSkeleton() {
  const data = {
    labels: ["", "", ""],
    datasets: [
      {
        label: "Loading",
        data: [40, 30, 30],
        backgroundColor: [
          "rgba(209, 213, 219, 0.8)",
          "rgba(229, 231, 235, 0.8)",
          "rgba(156, 163, 175, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: { duration: 0 },
  };

  return (
    <div className="relative w-full h-[380px] flex items-center justify-center">
      <div className="w-[75%] h-[75%] animate-loadingPulse opacity-80 pointer-events-none">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
