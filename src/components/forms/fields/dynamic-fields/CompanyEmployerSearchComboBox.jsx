import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchCompanyEmployersAPI } from "@/hooks/useCompanyAPI";

export default function CompanyEmployerSearchComboBox({
  name,
  control,
  label = "Employer",
  required = false,
  initialValue = null,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const { allCompanyEmployers, loading } = useFetchCompanyEmployersAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  // handle both RHF-controlled and standalone modes
  const rhf = control && name ? useController({ name, control }) : null;

  const field = rhf?.field ?? {
    value: controlledValue,
    onChange: controlledOnChange,
  };

  const error = rhf?.fieldState?.error;

  // prepare options
  const companyEmployerOptions = useMemo(() => {
    if (!allCompanyEmployers) return [];
    return [...allCompanyEmployers]
      .sort((a, b) =>
        (a.company_employer_name || "").localeCompare(b.company_employer_name || "")
      )
      .map((companyEmployer) => ({
        id: companyEmployer.company_employer_id,
        name: companyEmployer.company_employer_name,
      }));
  }, [allCompanyEmployers]);

  // handle initialValue
  useEffect(() => {
    if (initialValue && companyEmployerOptions.length && rhf) {
      const found =
        companyEmployerOptions.find((o) => o.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, companyEmployerOptions, rhf]);

  // sync field value with selected object
  useEffect(() => {
    if (field.value && companyEmployerOptions.length) {
      const found =
        companyEmployerOptions.find((o) => o.id === field.value) || null;
      setSelectedObject(found);
    } else if (!field.value) {
      setSelectedObject(null);
    }
  }, [field.value, companyEmployerOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={companyEmployerOptions}
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
        getSearchable={(o) => o.name.toLowerCase()}
        getOptionLabel={(o) => o.name}
        placeholder={loading ? "Loading..." : "Select"}
        error={error?.message}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
