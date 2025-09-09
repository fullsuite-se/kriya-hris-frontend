import ControlledDynamicCombobox from "../dynamic-fields/ControlledDynamicComboBox";
import { useAddress } from "@/hooks/useAddress";

export default function RegionDropdown({ value, onChange, disabled, error }) {
  const { regions, loading } = useAddress({});

  return (
    <ControlledDynamicCombobox
      options={regions}
      value={value}
      onChange={onChange}
      getSearchable={(r) => `${r.regionName} (${r.name})`}
      getOptionLabel={(r) => r.name}
      getOptionSubLabel={() => null}
      valueKey="code"
      placeholder={loading.regions ? "Loading regions..." : "Select Region"}
      disabled={disabled || loading.regions}
      error={error?.message}
    />
  );
}
