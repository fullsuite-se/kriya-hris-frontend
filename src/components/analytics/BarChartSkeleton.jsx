import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function BarChartSkeleton() {
  const data = {
    labels: ["", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Loading",
        data: [30, 50, 40, 60, 45, 70, 55], 
        backgroundColor: "rgba(209, 213, 219, 0.8)",
        borderRadius: 6,
        barThickness: 22,
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
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
