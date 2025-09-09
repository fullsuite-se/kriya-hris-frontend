import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const SERVICE_COLORS = {
  HRIS: "data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900",
  Payroll:
    "data-[state=checked]:bg-orange-900 data-[state=checked]:border-orange-900",
  ATS: "data-[state=checked]:bg-purple-900 data-[state=checked]:border-purple-900",
  Default:
    "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900",
};
const SERVICE_BORDER_COLORS = {
  HRIS: "border-blue-900",
  Payroll: "border-orange-900",
  ATS: "border-purple-900",
  Default: "border-gray-900",
};

const PermissionCheckbox = ({
  feature,
  checked,
  onChange,
  serviceName,
  expanded,
  onToggleExpand,
}) => {
  const colorClass = SERVICE_COLORS[serviceName] || SERVICE_COLORS.Default;
  const colorBorderClass =
    SERVICE_BORDER_COLORS[serviceName] || SERVICE_BORDER_COLORS.Default;

  return (
    <div
      className={`
        group relative flex flex-col p-4 rounded-2xl transition-all border
        ${checked ? colorBorderClass : "bg-white  border-gray-200"}
        hover:shadow-md/5 select-none
      `}
    >
      <div className="flex items-start w-full">
        <Checkbox
          id={`feature-${feature.service_feature_id}`}
          checked={checked}
          onCheckedChange={onChange}
          className={`mr-3 mt-1 h-4 w-4 border rounded ${colorClass}`}
        />

        <div className="flex-1 text-sm">
          <label
            htmlFor={`feature-${feature.service_feature_id}`}
            className="text-xs  text-black cursor-pointer"
          >
            {feature.feature_name}
          </label>
        </div>

        {feature.description && (
          <button
            type="button"
            onClick={() => onToggleExpand(feature.service_feature_id)}
            className="ml-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            {expanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${expanded ? "max-h-40 mt-3" : "max-h-0 mt-0"}
        `}
      >
        <div className="text-xs text-muted-foreground border-t border-gray-200 pt-3">
          {feature.description}
        </div>
      </div>
    </div>
  );
};

export default PermissionCheckbox;
