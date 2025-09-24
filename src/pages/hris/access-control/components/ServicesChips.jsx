import React from "react";

// const serviceColors = {
//   suitelifer:"bg-blue-200 text-blue-900",
//   hris: "bg-green-200 text-green-900",
//   payroll: "bg-orange-200 text-orange-900",
//   ats: "bg-purple-200 text-purple-900",
//   default: "bg-gray-200 text-gray-900",
// };


const serviceColors = {
  suitelifer: "bg-[#CCE5E5] text-[#004D4D]",
  hris: "bg-[#99CCCC] text-[#003D3D]",
  payroll: "bg-[#66B2B2] text-[#002E2E]",
  ats: "bg-[#339999] text-white",           
  default: "bg-[#E6F2F2] text-[#004D4D]",     
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
