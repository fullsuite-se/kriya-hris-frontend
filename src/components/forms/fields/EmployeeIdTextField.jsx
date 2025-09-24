import { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function EmployeeIdTextField({
  name = "employeeId",
  control,
  label = "Employee ID",
  placeholder = "Enter employee ID (e.g., TEE-0239)",
  required = false,
  availabilityState,
  onAvailabilityCheck,
  pattern = /^[A-Za-z]+-\d+$/, // Updated pattern to accept any letters followed by dash and numbers
  patternMessage = "Must be in format: PREFIX-NUMBERS (e.g., TEE-0239)",
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = (value) => {
    setIsFocused(false);

    // Trigger availability check for any valid prefix followed by numbers
    const trimmed = value.trim();
    if (pattern.test(trimmed) && onAvailabilityCheck) {
      onAvailabilityCheck(trimmed);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        required: required ? "Employee ID is required" : false,
        pattern: {
          value: pattern,
          message: patternMessage,
        },
      }}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          {label && (
            <Label htmlFor={name} className="text-xs font-medium gap-0">
              {label}{required && <span className="text-primary-color">*</span>}
            </Label>
          )}

          <Input
            id={name}
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={(e) => {
              field.onBlur();
              handleBlur(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            className={
              fieldState.error || availabilityState?.available === false
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />

          {fieldState.error && (
            <p className="text-red-500 text-xs">{fieldState.error.message}</p>
          )}

          {!fieldState.error && availabilityState && !isFocused && (
            <div className="flex items-center gap-1 text-xs">
              {availabilityState.loading && (
                <>
                  <Loader2 className="animate-spin w-3 h-3 text-gray-500" />
                  <span>Checking...</span>
                </>
              )}
              {!availabilityState.loading &&
                availabilityState.available === true && (
                  <>
                    <CheckCircle className="w-3 h-3 text-[#008080]" />
                    <span className="text-[#008080]">Available</span>
                  </>
                )}
              {!availabilityState.loading &&
                availabilityState.available === false && (
                  <>
                    <XCircle className="w-3 h-3 text-red-500" />
                    <span className="text-red-500">Taken</span>
                  </>
                )}
            </div>
          )}
        </div>
      )}
    />
  );
}