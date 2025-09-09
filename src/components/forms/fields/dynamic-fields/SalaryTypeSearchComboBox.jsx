import { useMemo, useState, useEffect } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchSalaryTypesAPI } from "@/hooks/useJobSettingsAPI";

export default function SalaryTypeSearchComboBox({
  name,
  control,
  label = "Salary Type",
  required = false,
  initialValue = null,
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allSalaryTypes, loading } = useFetchSalaryTypesAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const salaryTypeOptions = useMemo(() => {
    if (!allSalaryTypes) return [];
    return [...allSalaryTypes]
      .sort((a, b) =>
        (a.salary_adjustment_type || "").localeCompare(
          b.salary_adjustment_type || ""
        )
      )
      .map((type) => ({
        id: type.salary_adjustment_type_id,
        name: type.salary_adjustment_type,
      }));
  }, [allSalaryTypes]);

  useEffect(() => {
    if (initialValue && salaryTypeOptions.length) {
      const found =
        salaryTypeOptions.find((o) => o.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, salaryTypeOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        name={name}
        options={salaryTypeOptions}
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
