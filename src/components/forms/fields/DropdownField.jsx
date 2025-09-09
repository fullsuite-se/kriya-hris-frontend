import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useController } from "react-hook-form";

const DropdownField = ({
  name,
  label,
  control,
  options = [],
  required = false,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={name} className="text-xs font-medium gap-0">
        {label}
        {required && <span className="text-primary-color">*</span>}
      </Label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id={name}
            variant="outline"
            className={`w-full !bg-white text-xs justify-start font-normal ${
              error ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
            }`}
          >
            {field.value || "Select"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuRadioGroup
            value={field.value}
            onValueChange={field.onChange}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default DropdownField;
