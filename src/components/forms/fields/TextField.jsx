import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useController } from "react-hook-form";

const TextField = ({
  name,
  label,
  control,
  type = "text",
  placeholder,
  required = false,
  ...rest
}) => {
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
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...field}
        {...rest}
        onChange={(e) => {
          if (type === "number") {
            field.onChange(
              e.target.value === "" ? undefined : e.target.valueAsNumber
            );
          } else {
            field.onChange(e.target.value);
          }
        }}
        className={`${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default TextField;
