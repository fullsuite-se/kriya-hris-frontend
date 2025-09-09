import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFetchAllJobsAPI } from "@/hooks/useJobAPI";

export default function JobPositionSearchComboBox({
  name,
  control,
  label = "Job Position",
  required = false,
  initialValue = null,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const { systemCompanyId } = useAuthStore();
  const { allJobs, loading } = useFetchAllJobsAPI(systemCompanyId);
  const [selectedObject, setSelectedObject] = useState(null);

  const rhf = control && name ? useController({ name, control }) : null;

  const field = rhf?.field ?? {
    value: controlledValue,
    onChange: controlledOnChange,
  };

  const error = rhf?.fieldState?.error;

  const jobOptions = useMemo(() => {
    if (!allJobs) return [];
    return [...allJobs]
      .sort((a, b) => (a.job_title || "").localeCompare(b.job_title || ""))
      .map((job) => ({
        id: job.job_title_id,
        name: job.job_title,
      }));
  }, [allJobs]);

  useEffect(() => {
    if (initialValue && jobOptions.length && rhf) {
      const found = jobOptions.find((j) => j.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, jobOptions, rhf]);

  useEffect(() => {
    if (field.value && jobOptions.length) {
      const found = jobOptions.find((j) => j.id === field.value) || null;
      setSelectedObject(found);
    } else if (!field.value) {
      setSelectedObject(null);
    }
  }, [field.value, jobOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={jobOptions}
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
        getSearchable={(j) => j.name.toLowerCase()}
        getOptionLabel={(j) => j.name}
        getOptionSubLabel={() => ""}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
