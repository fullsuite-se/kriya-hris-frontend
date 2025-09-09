import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchEmployeeTypesAPI } from "@/hooks/useJobSettingsAPI";

export default function EmployeeTypeSearchComboBox({
  name,
  control,
  label = "Employee Type",
  required = false,
  initialValue = null,
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allEmployeeTypes, loading } = useFetchEmployeeTypesAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const employeeTypeOptions = useMemo(() => {
    if (!allEmployeeTypes) return [];
    return [...allEmployeeTypes]
      .sort((a, b) =>
        (a.employment_type || "").localeCompare(b.employment_type || "")
      )
      .map((type) => ({
        id: type.employment_type_id,
        name: type.employment_type,
      }));
  }, [allEmployeeTypes]);

  useEffect(() => {
    if (initialValue && employeeTypeOptions.length) {
      const found =
        employeeTypeOptions.find((t) => t.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, employeeTypeOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={employeeTypeOptions}
        valueKey="id"
        label={label}
        required={required}
        value={selectedObject}
        onChange={(selected) => {
          setSelectedObject(selected);
          field.onChange(selected?.id ?? null);
        }}
        getSearchable={(t) => t.name.toLowerCase()}
        getOptionLabel={(t) => t.name}
        getOptionSubLabel={() => ""}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
