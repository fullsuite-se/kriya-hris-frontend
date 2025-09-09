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
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const { allTeams, loading } = useFetchTeamsAPI();
  const [selectedObject, setSelectedObject] = useState(null);

  const teamOptions = useMemo(() => {
    if (!allTeams) return [];
    return [...allTeams]
      .sort((a, b) => (a.team_name || "").localeCompare(b.team_name || ""))
      .map((team) => ({
        id: team.team_id,
        name: team.team_name,
      }));
  }, [allTeams]);

  useEffect(() => {
    if (initialValue && teamOptions.length) {
      const found = teamOptions.find((t) => t.id === initialValue) || null;
      setSelectedObject(found);
      field.onChange(found?.id ?? null);
    }
  }, [initialValue, teamOptions]);

  return (
    <div className="space-y-1">
      <ControlledDynamicComboBox
        options={teamOptions}
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
