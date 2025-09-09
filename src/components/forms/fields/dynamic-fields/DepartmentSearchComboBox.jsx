import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchDepartmentsAPI } from "@/hooks/useCompanyAPI";

export default function DepartmentSearchComboBox({
  name,
  control,
  label = "Department",
  required = false,
  initialValue = null,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const { allDepartments, loading } = useFetchDepartmentsAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const rhf = control && name ? useController({ name, control }) : null;

  const field = rhf?.field ?? {
    value: controlledValue,
    onChange: controlledOnChange,
  };

  const error = rhf?.fieldState?.error;

  const departmentOptions = useMemo(() => {
    if (!allDepartments) return [];
    return [...allDepartments]
      .sort((a, b) =>
        (a.department_name || "").localeCompare(b.department_name || "")
      )
      .map((dept) => ({
        id: dept.department_id,
        name: dept.department_name,
      }));
  }, [allDepartments]);

  useEffect(() => {
    if (initialValue && departmentOptions.length && rhf) {
      const found =
        departmentOptions.find((d) => d.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, departmentOptions, rhf]);

  useEffect(() => {
    if (field.value && departmentOptions.length) {
      const found = departmentOptions.find((d) => d.id === field.value) || null;
      setSelectedObject(found);
    } else if (!field.value) {
      setSelectedObject(null);
    }
  }, [field.value, departmentOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={departmentOptions}
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
