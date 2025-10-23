import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function WorkEmailTextField({
  control,
  name = "workEmail",
  label = "Work Email",
  placeholder = "you@getfullsuite.com",
  required = false,
  availabilityState,
  onAvailabilityCheck,
}) {
  const [typedValue, setTypedValue] = useState("");

  useEffect(() => {
    if (!typedValue) return;

    const timer = setTimeout(() => {
      onAvailabilityCheck?.(typedValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [typedValue]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "Work email is required" : false,
      }}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          {label && (
            <Label htmlFor={name} className="text-xs font-medium">
              {label}
              {required && <span className="text-primary-color">*</span>}
            </Label>
          )}

          <Input
            id={name}
            type="email"
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) => {
              field.onChange(e.target.value);
              setTypedValue(e.target.value);
            }}
            className={
              fieldState.error || availabilityState?.available === false
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />

          {fieldState.error && (
            <p className="text-red-500 text-xs">{fieldState.error.message}</p>
          )}

          {!fieldState.error && availabilityState && (
            <div className="flex items-center gap-1 text-xs mt-1">
              {availabilityState.loading && (
                <>
                  <Loader2 className="animate-spin w-3 h-3" />
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
