import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useController } from "react-hook-form";
import { Eye as ShowEyeIcon, EyeOff as HideEyeIcon } from "lucide-react";

const colorMap = {
  red: {
    border: "border-red-500 focus-visible:ring-red-500",
    text: "text-red-500",
  },
  white: {
    border: "border-white focus-visible:ring-white",
    text: "text-white",
  },
  teal: {
    border: "border-teal-500 focus-visible:ring-teal-500",
    text: "text-teal-500",
  },
  gray: {
    border: "border-gray-500 focus-visible:ring-gray-500",
    text: "text-gray-500",
  },
};

export default function PasswordField({
  name,
  label,
  control,
  value,
  onValueChange,
  errorMessage = "",
  placeholder = "",
  required = false,
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
  requiredAsteriskClassName = "text-primary-color",
  errorColorClass = "red",
  iconColorClass = "gray",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const isError = error || errorMessage;

  const errorTheme = colorMap[errorColorClass] || colorMap.red;
  const iconTheme = isError
    ? errorTheme.text
    : colorMap[iconColorClass]?.text || colorMap.gray.text;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <Label
        htmlFor={name}
        className={`text-xs font-medium gap-0 ${labelClassName}`}
      >
        {label}
        {required && <span className={`${requiredAsteriskClassName}`}>*</span>}
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
            isError ? errorTheme.border : ""
          } ${inputClassName}`}
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <HideEyeIcon className={`cursor-pointer ${iconTheme}`} size={18} />
          ) : (
            <ShowEyeIcon className={`cursor-pointer ${iconTheme}`} size={18} />
          )}
        </button>
      </div>

      {isError && (
        <p
          className={`${errorTheme.text} !text-xs !italic !font-light ${errorClassName}`}
        >
          *{error?.message || errorMessage}
        </p>
      )}
    </div>
  );
}
