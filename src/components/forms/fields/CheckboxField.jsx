import { useController } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const CheckboxField = ({ name, label, control, onCheckedChange }) => {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control });

  const handleChange = (checked) => {
    onChange(checked);
    if (onCheckedChange) {
      onCheckedChange(checked);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        ref={ref}
        checked={value}
        onCheckedChange={handleChange}
        className="data-[state=checked]:bg-[#008080] data-[state=checked]:border-[#008080]"
      />
      <Label className="!text-xs text-muted-foreground italic font-light">
        {label}
      </Label>
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default CheckboxField;
