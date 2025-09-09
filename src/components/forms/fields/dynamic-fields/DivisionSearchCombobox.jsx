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
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allDivisions, loading } = useFetchDivisionsAPI();
  const [selectedObject, setSelectedObject] = useState(null);

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

  useEffect(() => {
    if (initialValue && divisionOptions.length) {
      const found = divisionOptions.find((d) => d.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, divisionOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={divisionOptions}
        valueKey="id"
        label={label}
        required={required}
        value={selectedObject}
        onChange={(selected) => {
          setSelectedObject(selected);
          field.onChange(selected?.id ?? null);
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
