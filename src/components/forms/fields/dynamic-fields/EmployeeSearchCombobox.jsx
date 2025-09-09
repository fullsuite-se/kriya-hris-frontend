import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicCombobox from "./ControlledDynamicCombobox";
import { useFetchAllEmployeesAPI } from "@/hooks/useEmployeeAPI";
import transformUsers from "@/utils/parsers/transformData";

export default function EmployeeSearchCombobox({
  name,
  control,
  label = "Immediate Supervisor",
  required = false,
  initialValue = null, 
  value: controlledValue, 
  onChange: controlledOnChange, 
}) {
  const { allEmployees, loading } = useFetchAllEmployeesAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const rhf = control && name ? useController({ name, control }) : null;
  const field = rhf?.field ?? {
    value: controlledValue,
    onChange: controlledOnChange,
  };
  const error = rhf?.fieldState?.error;

  const employeeOptions = useMemo(() => {
    if (!allEmployees) return [];
    const transformed = transformUsers(allEmployees);

    return [...transformed]
      .sort((a, b) => {
        const nameA = `${a.first_name || ""} ${a.middle_name || ""} ${
          a.last_name || ""
        }`.trim();
        const nameB = `${b.first_name || ""} ${b.middle_name || ""} ${
          b.last_name || ""
        }`.trim();
        return nameA.localeCompare(nameB);
      })
      .map((emp) => ({
        id: String(emp.employee_id),
        email: emp.email,
        fname: emp.first_name,
        mname: emp.middle_name,
        lname: emp.last_name,
        jobTitle: emp.job_title,
      }));
  }, [allEmployees]);

  useEffect(() => {
    if (!employeeOptions.length) return;

    let found =
      employeeOptions.find((e) => e.id === String(field.value)) ||
      (initialValue
        ? employeeOptions.find((e) => e.id === String(initialValue))
        : null);

    setSelectedObject(found || null);
    if (found) field.onChange?.(found.id ?? null);
  }, [employeeOptions, field.value, initialValue]);

  useEffect(() => {
    if (!employeeOptions.length) return;
    if (!field.value) {
      setSelectedObject(null);
      return;
    }
    const found = employeeOptions.find((e) => e.id === String(field.value)) || null;
    setSelectedObject(found);
  }, [field.value, employeeOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicCombobox
        options={employeeOptions}
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
        getSearchable={(e) =>
          `${e.fname} ${e.mname || ""} ${e.mname ? e.mname[0] + "." : ""} ${
            e.lname
          } ${e.email} ${e.jobTitle}`.toLowerCase()
        }
        getOptionLabel={(e) =>
          `${e.fname} ${e.mname ? e.mname[0] + "." : ""} ${e.lname}`
            .replace(/\s+/g, " ")
            .trim()
        }
        getOptionSubLabel={(e) => e.jobTitle}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
