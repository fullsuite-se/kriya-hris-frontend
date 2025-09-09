import ControlledDynamicComboBox from "../dynamic-fields/ControlledDynamicComboBox";
import { useAddress } from "@/hooks/useAddress";

export default function ProvinceDropdown({
  regionCode,
  value,
  onChange,
  disabled,
  error,
}) {
  const { provinces, loading } = useAddress({ regionCode });

  return (
    <ControlledDynamicComboBox
      options={provinces}
      value={value}
      onChange={onChange}
      getSearchable={(p) => p.name}
      getOptionLabel={(p) => p.name}
      getOptionSubLabel={() => null}
      valueKey="code"
      placeholder={
        loading.provinces ? "Loading provinces..." : "Select Province"
      }
      disabled={!regionCode || disabled || loading.provinces}
      error={error?.message}
    />
  );
}
