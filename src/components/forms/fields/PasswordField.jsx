import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useController } from "react-hook-form";
import { Eye as ShowEyeIcon, EyeOff as HideEyeIcon } from "lucide-react";

export default function PasswordField({
  name,
  label,
  control,
  value,
  onValueChange,
  errorMessage = "",
  placeholder = "••••••••",
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-xs font-medium gap-0">
        {label}
        {required && <span className="text-primary-color">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...field}
          value={value}
          onChange={(e) => {
            field.onChange(e.target.value);
            onValueChange?.(e.target.value); 
          }}
          className={`pr-10 ${
            error || errorMessage
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <HideEyeIcon className="cursor-pointer" size={18} />
          ) : (
            <ShowEyeIcon className="cursor-pointer" size={18} />
          )}
        </button>
      </div>

      {(error || errorMessage) && (
        <p className="text-red-500 text-xs">{error?.message || errorMessage}</p>
      )}
    </div>
  );
}
