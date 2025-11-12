import { useEffect } from "react";
import ControlledDynamicComboBox from "../dynamic-fields/ControlledDynamicComboBox";
import { useAddress } from "@/hooks/useAddress";

export default function CityDropdown({
  provinceCode,
  regionCode,
  isNCR = false,
  value,
  onChange,
  disabled,
  error,
}) {
  const { cities, fetchCitiesForNCR, loading } = useAddress({
    provinceCode: isNCR ? null : provinceCode,
  });

  useEffect(() => {
    if (isNCR && regionCode) {
      fetchCitiesForNCR(regionCode);
    }
  }, [isNCR, regionCode, fetchCitiesForNCR]);

  return (
    <ControlledDynamicComboBox
      options={cities || []}
      value={value}
      onChange={onChange}
      getSearchable={(c) => c.name}
      getOptionLabel={(c) => c.name}
      getOptionSubLabel={() => null}
      valueKey="code"
      placeholder={loading.cities ? "Loading cities..." : "Select City/Municipality"}
      disabled={
        (!provinceCode && !isNCR) ||
        disabled ||
        loading.cities
      }
      error={error?.message}
    />
  );
}
