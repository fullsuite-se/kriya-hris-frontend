import { useState } from "react";
import { useController } from "react-hook-form";
import { CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const DatepickerField = ({
  name,
  label,
  control,
  disabledDates,
  required = false,
  allowAllDates = false,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [open, setOpen] = useState(false);

  const defaultDisabled = (date) =>
    date > new Date() || date < new Date("1900-01-01");

  const isDateDisabled = (date) => {
    if (allowAllDates) return false;
    const customDisabled = disabledDates?.(date);
    return defaultDisabled(date) || customDisabled;
  };

  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={name} className="text-xs font-medium gap-0">
        {label}
        {required && <span className="text-primary-color">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            className={`w-full !bg-white border text-xs justify-between font-normal ${
              error ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
            }`}
          >
            {field.value instanceof Date
              ? field.value.toLocaleDateString()
              : "Select date"}
            <CalendarIcon className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value instanceof Date ? field.value : undefined}
            onSelect={(selectedDate) => {
              field.onChange(selectedDate ?? null);
              setOpen(false);
            }}
            captionLayout="dropdown"
            disabled={isDateDisabled}
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default DatepickerField;
