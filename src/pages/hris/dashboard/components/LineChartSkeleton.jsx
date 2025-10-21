import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function LineChartSkeleton() {
  const data = {
    labels: ["", "", "", "", "", "", ""], // blank labels
    datasets: [
      {
        label: "Loading",
        data: [30, 50, 40, 60, 45, 70, 55], // placeholder curve
        borderColor: "rgba(156, 163, 175, 0.9)", // gray-400
        backgroundColor: "rgba(229, 231, 235, 0.5)", // gray-200
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "rgba(156, 163, 175, 0.9)", // gray-400
        pointBorderColor: "rgba(156, 163, 175, 1)",
        pointHoverRadius: 0,
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
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { display: false },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { display: false },
      },
    },
    interaction: { mode: null },
    animation: { duration: 0 },
  };

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <div className="w-[92%] h-[85%] animate-loadingPulse pointer-events-none opacity-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
