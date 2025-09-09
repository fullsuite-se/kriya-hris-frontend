import React from "react";

const serviceColors = {
  hris: "bg-blue-200 text-blue-900",
  payroll: "bg-orange-200 text-orange-900",
  ats: "bg-purple-200 text-purple-900",
  default: "bg-gray-200 text-gray-900",
};

export default function ServiceChips({ services = [] }) {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {services.map((service, idx) => {
        const colorClass =
          serviceColors[service.service_name.toLowerCase()] || serviceColors.default;

        return (
          <div
            key={idx}
            className={`${colorClass} py-1 px-2 rounded-xl !text-xs font-medium`}
          >
            {service.service_name}
          </div>
        );
      })}
    </div>
  );
}
