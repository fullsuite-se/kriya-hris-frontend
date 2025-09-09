import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchEmploymentStatusAPI } from "@/hooks/useJobSettingsAPI";

export default function EmploymentStatusSearchComboBox({
  name,
  control,
  label = "Employment Status",
  required = false,
  initialValue = null,
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allEmploymentStatuses, loading } = useFetchEmploymentStatusAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const employmentStatusOptions = useMemo(() => {
    if (!allEmploymentStatuses) return [];
    return [...allEmploymentStatuses]
      .sort((a, b) =>
        (a.employment_status || "").localeCompare(b.employment_status || "")
      )
      .map((status) => ({
        id: status.employment_status_id,
        name: status.employment_status,
      }));
  }, [allEmploymentStatuses]);

  useEffect(() => {
    if (initialValue && employmentStatusOptions.length) {
      const found =
        employmentStatusOptions.find((s) => s.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, employmentStatusOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={employmentStatusOptions}
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
