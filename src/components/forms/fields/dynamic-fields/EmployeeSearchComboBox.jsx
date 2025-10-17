import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useEmployeeDropdownAPI } from "@/hooks/useEmployeeAPI";

export default function EmployeeSearchComboBox({
  name,
  control,
  label = "Immediate Supervisor",
  required = false,
  initialValue = null,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const {
    allEmployees,
    loading,
    handleSearchInputChange,
    clearSearch,
    handleImmediateSearch,
  } = useEmployeeDropdownAPI();

  const [selectedObject, setSelectedObject] = useState(null);
  const [localSearch, setLocalSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const rhf = control && name ? useController({ name, control }) : null;
  const field = rhf?.field ?? {
    value: controlledValue,
    onChange: controlledOnChange,
  };
  const error = rhf?.fieldState?.error;

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    handleSearchInputChange(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      handleImmediateSearch(value);
    }, 300);

    setSearchTimeout(newTimeout);
  };

  // Function to get initials from first and last name
  const getInitials = (employee) => {
    if (!employee) return "??";
    const { first_name, last_name } = employee;
    return (
      `${first_name?.[0] || ""}${last_name?.[0] || ""}`.toUpperCase() || "??"
    );
  };

  const employeeOptions = useMemo(() => {
    if (!allEmployees || allEmployees.length === 0) {
      return [];
    }

    const options = allEmployees
      .sort((a, b) => {
        const nameA = `${a.first_name || ""} ${a.middle_name || ""} ${
          a.last_name || ""
        }`.trim();
        const nameB = `${b.first_name || ""} ${b.middle_name || ""} ${
          b.last_name || ""
        }`.trim();
        return nameA.localeCompare(nameB);
      })
      .map((emp) => {
        const option = {
          id: String(emp.user_id),
          email: emp.user_email,
          fname: emp.first_name,
          mname: emp.middle_name,
          lname: emp.last_name,
          jobTitle: emp.job_title,
          // Dynamically add user_pic with fallback to initials
          user_pic: emp.user_pic || `initials:${getInitials(emp)}`,
        };

        return option;
      });

    return options;
  }, [allEmployees]);

  useEffect(() => {
    if (!employeeOptions.length) {
      return;
    }

    const currentValue = field.value ? String(field.value) : null;
    const selectedId = selectedObject ? selectedObject.id : null;

    if (currentValue !== selectedId && field.value) {
      const found = employeeOptions.find((e) => e.id === String(field.value));

      setSelectedObject(found || null);
    }
  }, [field.value, employeeOptions]);

  useEffect(() => {
    if (
      initialValue &&
      employeeOptions.length > 0 &&
      !field.value &&
      !selectedObject
    ) {
      const found = employeeOptions.find((e) => e.id === String(initialValue));
      if (found) {
        setSelectedObject(found);
        field.onChange?.(found.id);
      }
    }
  }, [initialValue, employeeOptions.length]);

  const handleSelectionChange = (selected) => {
    if (selected) {
      setSelectedObject(selected);
      field.onChange?.(selected.id);
      setLocalSearch("");
      clearSearch();
    } else {
      setSelectedObject(null);
      field.onChange?.(null);
    }
  };

  const getOptionSubLabel = (e) => {
    const subLabel = e.jobTitle || "";

    return subLabel;
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={employeeOptions}
        valueKey="id"
        label={label}
        required={required}
        value={selectedObject}
        onChange={handleSelectionChange}
        getSearchable={(e) => {
          const searchable = `${e.fname} ${e.mname || ""} ${e.lname} ${
            e.email
          } ${e.jobTitle}`.toLowerCase();

          return searchable;
        }}
        getOptionLabel={(e) => {
          const label = `${e.fname} ${e.mname ? e.mname[0] + "." : ""} ${
            e.lname
          }`
            .replace(/\s+/g, " ")
            .trim();
          return label;
        }}
        getOptionSubLabel={getOptionSubLabel}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
        searchValue={localSearch}
        onSearchChange={handleSearchChange}
        // Pass user_pic to the combobox for avatar display
        getUserPic={(e) => e.user_pic}
      />
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}