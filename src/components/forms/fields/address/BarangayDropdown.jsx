import ControlledDynamicComboBox from "../dynamic-fields/ControlledDynamicComboBox";
import { useAddress } from "@/hooks/useAddress";

export default function BarangayDropdown({
  cityCode,
  value,
  onChange,
  disabled,
  error,
}) {
  const { barangays, loading } = useAddress({ cityCode });

  return (
    <ControlledDynamicComboBox
      options={barangays}
      value={value}
      onChange={onChange}
      getSearchable={(b) => b.name}
      getOptionLabel={(b) => b.name}
      getOptionSubLabel={() => null}
      valueKey="code"
      placeholder={
        loading.barangays ? "Loading barangays..." : "Select Barangay"
      }
      disabled={!cityCode || disabled || loading.barangays}
      error={error?.message}
    />
  );
}
