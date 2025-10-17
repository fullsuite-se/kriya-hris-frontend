import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchDivisionsAPI } from "@/hooks/useCompanyAPI";

export default function DivisionSearchComboBox({
  name,
  control,
  label = "Division",
  required = false,
  initialValue = null,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const { allDivisions, loading } = useFetchDivisionsAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  // Handles both react-hook-form or standalone controlled component
  const rhf = control && name ? useController({ name, control }) : null;

  const field = rhf?.field ?? {
    value: controlledValue,
    onChange: controlledOnChange,
  };

  const error = rhf?.fieldState?.error;

  // Prepare dropdown options
  const divisionOptions = useMemo(() => {
    if (!allDivisions) return [];
    return [...allDivisions]
      .sort((a, b) =>
        (a.division_name || "").localeCompare(b.division_name || "")
      )
      .map((division) => ({
        id: division.division_id,
        name: division.division_name,
      }));
  }, [allDivisions]);

  // Handle preloaded initialValue
  useEffect(() => {
    if (initialValue && divisionOptions.length && rhf) {
      const found = divisionOptions.find((d) => d.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, divisionOptions, rhf]);

  // Keep selectedObject in sync with field value
  useEffect(() => {
    if (field.value && divisionOptions.length) {
      const found = divisionOptions.find((d) => d.id === field.value) || null;
      setSelectedObject(found);
    } else if (!field.value) {
      setSelectedObject(null);
    }
  }, [field.value, divisionOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={divisionOptions}
        valueKey="id"
        label={label}
        required={required}
        value={selectedObject}
        onChange={(selected) => {
          if (selected?.id === selectedObject?.id) {
            setSelectedObject(null);
            field.onChange?.(null);
          } else {
            setSelectedObject(selected);
            field.onChange?.(selected?.id ?? null);
          }
        }}
        getSearchable={(d) => d.name.toLowerCase()}
        getOptionLabel={(d) => d.name}
        getOptionSubLabel={() => ""}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
