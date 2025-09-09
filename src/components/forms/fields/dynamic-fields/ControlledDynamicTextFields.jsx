import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ControlledDynamicTextFields({
  name = "items",
  label = "",
  fieldConfigs = [],
  maxFields,
  initialValues = [],
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove, replace } = useFieldArray({ name, control });
  const hasReachedMax =
    typeof maxFields === "number" && fields.length >= maxFields;

  useEffect(() => {
    if (initialValues.length > 0) {
      replace(initialValues);
    }
  }, [initialValues, replace]);

  const arrayError = errors?.[name]?.message;

  return (
    <div className="space-y-4">
      {label && <h2 className="text-sm font-semibold">{label}</h2>}

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <div className="grid grid-cols-1 gap-2 w-full sm:flex">
            {fieldConfigs.map((cfg) => {
              const fieldError = errors?.[name]?.[index]?.[cfg.name];
              return (
                <div key={cfg.name} className="flex-1 space-y-1">
                  <Input
                    {...register(`${name}.${index}.${cfg.name}`)}
                    defaultValue={field[cfg.name] || ""}
                    placeholder={cfg.placeholder}
                    className={`${
                      fieldError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  {fieldError && (
                    <p className="text-red-500 text-xs">{fieldError.message}</p>
                  )}
                </div>
              );
            })}
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
      ))}

      {arrayError && <p className="text-red-500 text-xs">{arrayError}</p>}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() =>
            append(Object.fromEntries(fieldConfigs.map((f) => [f.name, ""])))
          }
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
