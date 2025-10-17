import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FILTER_TYPES } from "./types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import DepartmentSearchComboBox from "../forms/fields/dynamic-fields/DepartmentSearchComboBox";
import EmployeeSearchComboBox from "../forms/fields/dynamic-fields/EmployeeSearchComboBox";
import JobPositionSearchComboBox from "../forms/fields/dynamic-fields/JobPositionSearchComboBox";
import OfficeSearchComboBox from "../forms/fields/dynamic-fields/OfficeSearchComboBox";
import CompanyEmployerSearchComboBox from "../forms/fields/dynamic-fields/CompanyEmployerSearchComboBox";

export function FilterSection({ filter, values, onChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={`space-y-2 ${
        !isOpen ? "border-b border-gray-200" : ""
      }  pb-2 select-none`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleOpen}
      >
        <h4
          className={`text-xs font-semibold ${isOpen ? "text-[#008080]" : ""}`}
        >
          {filter.label}
        </h4>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </div>

      {isOpen && (
        <>
          {filter.type === FILTER_TYPES.CHECKBOX &&
            filter.options.map((option) => (
              <div key={option.value} className="flex items-center gap-2 ">
                <Checkbox
                  id={option.value}
                  checked={values.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...values, option.value]);
                    } else {
                      onChange(values.filter((v) => v !== option.value));
                    }
                  }}
                />
                <Label
                  htmlFor={option.value}
                  className="text-sm !font-normal !cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}

          {filter.type === FILTER_TYPES.RANGE && (
            <>
              <Slider
                value={values}
                onValueChange={onChange}
                min={filter.min}
                max={filter.max}
                step={filter.step || 1}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {values[0]} – {values[1]}
              </div>
            </>
          )}

          {filter.type === FILTER_TYPES.DATE_RANGE && (
            <>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full !bg-transparent !border-gray-200 !text-xs justify-between font-normal"
                    >
                      {values[0]
                        ? new Date(values[0]).toLocaleDateString()
                        : "Select start date"}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={values[0] ? new Date(values[0]) : undefined}
                      captionLayout="dropdown"
                      onSelect={(selectedDate) => {
                        if (!values[1] || selectedDate <= new Date(values[1])) {
                          onChange([selectedDate, values[1]]);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() ||
                        (values[1] && date > new Date(values[1]))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full !bg-transparent !border-gray-200 !text-xs justify-between font-normal"
                    >
                      {values[1]
                        ? new Date(values[1]).toLocaleDateString()
                        : "Select end date"}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={values[1] ? new Date(values[1]) : undefined}
                      captionLayout="dropdown"
                      onSelect={(selectedDate) => {
                        if (!values[0] || selectedDate >= new Date(values[0])) {
                          onChange([values[0], selectedDate]);
                        }
                      }}
                      disabled={(date) =>
                        values[0] && date < new Date(values[0])
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          {filter.type === FILTER_TYPES.DROPDOWN && filter.key === "office" && (
            <OfficeSearchComboBox
              value={values || null}
              onChange={onChange}
              label={""}
              required={false}
            />
          )}

          {filter.type === FILTER_TYPES.DROPDOWN &&
            filter.key === "department" && (
              <DepartmentSearchComboBox
                value={values || null}
                onChange={onChange}
                label={""}
                required={false}
              />
            )}

          {filter.type === FILTER_TYPES.DROPDOWN &&
            filter.key === "employer" && (
              <CompanyEmployerSearchComboBox
                value={values || null}
                onChange={onChange}
                label={""}
                required={false}
              />
            )}

          {filter.type === FILTER_TYPES.DROPDOWN &&
            filter.key === "supervisor" && (
              <EmployeeSearchComboBox
                value={values || null}
                onChange={onChange}
                label={""}
                required={false}
              />
            )}

          {filter.type === FILTER_TYPES.DROPDOWN &&
            filter.key === "job_position" && (
              <JobPositionSearchComboBox
                value={values || null}
                onChange={onChange}
                label={""}
                required={false}
              />
            )}
        </>
      )}
    </div>
  );
}
