import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ControlledDynamicSelectTextFields({
  name = "items",
  label = "",
  selectOptions = [],
  selectField = "type",
  inputField = "acc_number",
  selectPlaceholder = "Select",
  inputPlaceholder = "Enter value",
  disableSelectedOptions = false,
  maxFields,
}) {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({ name, control });
  const values = watch(name) || [];

  const handleChange = (index, field, value) => {
    const updated = [...values];
    updated[index][field] = value;
    setValue(name, updated);
  };

  const getDisabledValues = (currentIndex) => {
    if (!disableSelectedOptions) return [];
    return values
      .map((v, i) => (i !== currentIndex ? v?.[selectField] : null))
      .filter(Boolean);
  };

  const hasReachedMax =
    typeof maxFields === "number" && fields.length >= maxFields;

  const arrayErrors = errors?.[name] || [];

  return (
    <div className="flex flex-col space-y-4">
      {label && <h2 className="text-sm font-semibold mb-4">{label}</h2>}

      {fields.map((item, index) => {
        const selectedValues = getDisabledValues(index);
        const selectError = arrayErrors?.[index]?.[selectField];
        const inputError = arrayErrors?.[index]?.[inputField];

        return (
          <div key={item.id} className="flex items-start gap-2 w-full">
            <div className="flex-1 space-y-1">
              <Select
                value={values[index]?.[selectField]}
                onValueChange={(val) => handleChange(index, selectField, val)}
              >
                <SelectTrigger
                  className={`w-full ${
                    selectError ? "!border-red-500 !ring-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder={selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      disabled={selectedValues.includes(opt.value)}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectError && (
                <p className="text-red-500 text-xs">{selectError.message}</p>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <Input
                placeholder={inputPlaceholder}
                {...register(`${name}.${index}.${inputField}`)}
                className={`w-full ${
                  inputError ? "!border-red-500 !ring-red-500" : ""
                }`}
              />
              {inputError && (
                <p className="text-red-500 text-xs">{inputError.message}</p>
              )}
            </div>

            {fields.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                –
              </Button>
            )}
          </div>
        );
      })}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => append({ [selectField]: "", [inputField]: "" })}
          variant="secondary"
          className="text-xs mt-2 w-20"
          disabled={hasReachedMax}
        >
          + Add
        </Button>
      </div>
    </div>
  );
}
