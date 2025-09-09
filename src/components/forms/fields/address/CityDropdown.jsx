import ControlledDynamicComboBox from "../dynamic-fields/ControlledDynamicComboBox";
import { useAddress } from "@/hooks/useAddress";

export default function CityDropdown({
  provinceCode,
  value,
  onChange,
  disabled,
  error,
}) {
  const { cities, loading } = useAddress({ provinceCode });

  return (
    <ControlledDynamicComboBox
      options={cities}
      value={value}
      onChange={onChange}
      getSearchable={(c) => c.name}
      getOptionLabel={(c) => c.name}
      getOptionSubLabel={() => null}
      valueKey="code"
      placeholder={
        loading.cities ? "Loading cities..." : "Select City/Municipality"
      }
      disabled={!provinceCode || disabled || loading.cities}
      error={error?.message}
    />
  );
}
