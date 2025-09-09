import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicCombobox from "./ControlledDynamicCombobox";
import { useFetchOfficesAPI } from "@/hooks/useCompanyAPI";

export default function OfficeSearchCombobox({
  name,
  control,
  label = "Office",
  required = false,
  initialValue = null,
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allOffices, loading } = useFetchOfficesAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const officeOptions = useMemo(() => {
    if (!allOffices) return [];
    return [...allOffices]
      .sort((a, b) => (a.office_name || "").localeCompare(b.office_name || ""))
      .map((office) => ({
        id: office.office_id,
        name: office.office_name,
        address: office.office_address || "---",
      }));
  }, [allOffices]);

  useEffect(() => {
    if (initialValue && officeOptions.length) {
      const found = officeOptions.find((o) => o.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, officeOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicCombobox
        name={name}
        options={officeOptions}
        valueKey="id"
        label={label}
        required={required}
        value={selectedObject}
        onChange={(selected) => {
          setSelectedObject(selected);
          field.onChange(selected?.id ?? null);
        }}
        getSearchable={(o) => `${o.name} ${o.address}`.toLowerCase()}
        getOptionLabel={(o) => o.name}
        getOptionSubLabel={(o) => o.address}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
