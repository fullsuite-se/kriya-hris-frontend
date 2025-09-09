import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import useFetchAllShiftTemplatesAPI from "@/hooks/useShiftTemplatesAPI";
import formatDate from "@/utils/formatters/dateFormatter";

export default function ShiftTemplateSearchComboBox({
  name,
  control,
  label = "Shift",
  required = false,
  initialValue = null,
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allShiftTemplates, loading } = useFetchAllShiftTemplatesAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const shiftTemplateOptions = useMemo(() => {
    if (!allShiftTemplates) return [];
    return [...allShiftTemplates]
      .sort((a, b) => (a.shift_name || "").localeCompare(b.shift_name || ""))
      .map((shiftTemplate) => ({
        id: shiftTemplate.shift_template_id,
        name: shiftTemplate.shift_name,
        startTime: formatDate(shiftTemplate.start_time, "time12") || "---",
        endTime: formatDate(shiftTemplate.end_time, "time12") || "---",
      }));
  }, [allShiftTemplates]);

  useEffect(() => {
    if (initialValue && shiftTemplateOptions.length) {
      const found =
        shiftTemplateOptions.find((st) => st.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, shiftTemplateOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        name={name}
        options={shiftTemplateOptions}
        valueKey="id"
        label={label}
        required={required}
        value={selectedObject}
        onChange={(selected) => {
          setSelectedObject(selected);
          field.onChange(selected?.id ?? null);
        }}
        getSearchable={(st) =>
          `${st.name} ${st.startTime} ${st.endTime}`.toLowerCase()
        }
        getOptionLabel={(st) => st.name}
        getOptionSubLabel={(st) => `${st.startTime} - ${st.endTime}`}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
