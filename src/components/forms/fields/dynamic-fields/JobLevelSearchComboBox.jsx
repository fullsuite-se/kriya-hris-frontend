import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchJobLevelsAPI } from "@/hooks/useJobSettingsAPI";

export default function JobLevelSearchComboBox({
  name,
  control,
  label = "Job Level",
  required = false,
  initialValue = null,
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allJobLevels, loading } = useFetchJobLevelsAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const jobLevelOptions = useMemo(() => {
    if (!allJobLevels) return [];
    return [...allJobLevels]
      .sort((a, b) =>
        (a.job_level_name || "").localeCompare(b.job_level_name || "")
      )
      .map((level) => ({
        id: level.job_level_id,
        name: level.job_level_name,
      }));
  }, [allJobLevels]);

  useEffect(() => {
    if (initialValue && jobLevelOptions.length) {
      const found = jobLevelOptions.find((l) => l.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, jobLevelOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={jobLevelOptions}
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
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
