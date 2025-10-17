import { useMemo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ControlledDynamicComboBox from "./ControlledDynamicComboBox";
import { useFetchTeamsAPI } from "@/hooks/useCompanyAPI";

export default function TeamSearchComboBox({
  name,
  control,
  label = "Team",
  required = false,
  initialValue = null,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const { allTeams, loading } = useFetchTeamsAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  // Handles both RHF and controlled usage
  const rhf = control && name ? useController({ name, control }) : null;

  const field = rhf?.field ?? {
    value: controlledValue,
    onChange: controlledOnChange,
  };

  const error = rhf?.fieldState?.error;

  // Prepare dropdown options
  const teamOptions = useMemo(() => {
    if (!allTeams) return [];
    return [...allTeams]
      .sort((a, b) => (a.team_name || "").localeCompare(b.team_name || ""))
      .map((team) => ({
        id: team.team_id,
        name: team.team_name,
      }));
  }, [allTeams]);

  // Apply initial value when available
  useEffect(() => {
    if (initialValue && teamOptions.length && rhf) {
      const found = teamOptions.find((t) => t.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, teamOptions, rhf]);

  // Keep selectedObject in sync with field value
  useEffect(() => {
    if (field.value && teamOptions.length) {
      const found = teamOptions.find((t) => t.id === field.value) || null;
      setSelectedObject(found);
    } else if (!field.value) {
      setSelectedObject(null);
    }
  }, [field.value, teamOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={teamOptions}
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
