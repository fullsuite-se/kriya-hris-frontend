import { useState, useEffect } from "react";

const DashboardDateTime = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const weekday = date.toLocaleString("en-US", { weekday: "short" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${weekday}, ${month} ${day}, ${year}`;

  // Split into time and AM/PM
  const [timePart, meridiem] = date
    .toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .split(" ");

  return (
    <div className="flex flex-col text-right md:text-right whitespace-nowrap select-none">
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#008080]">
        {timePart}{" "}
        <span className="text-black font-semibold">{meridiem}</span>
      </p>
      <p className="text-sm text-muted-foreground">
        {formattedDate} • PH Time
      </p>
    </div>
  );
};

export default DashboardDateTime;
