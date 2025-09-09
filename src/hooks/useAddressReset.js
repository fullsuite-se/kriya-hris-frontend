import { useEffect } from "react";

export function useAddressReset({ watch, setValue, prefix, disableReset = false }) {
  useEffect(() => {
    if (disableReset) return;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const regionField = "region" + capitalize(prefix);
    const provinceField = "province" + capitalize(prefix);
    const cityField = "city" + capitalize(prefix);
    const barangayField = "barangay" + capitalize(prefix);

    const subscription = watch((value, { name }) => {
      if (name === regionField) {
        setValue(provinceField, "", { shouldValidate: false });
        setValue(cityField, "", { shouldValidate: false });
        setValue(barangayField, "", { shouldValidate: false });
      }

      if (name === provinceField) {
        setValue(cityField, "", { shouldValidate: false });
        setValue(barangayField, "", { shouldValidate: false });
      }

      if (name === cityField) {
        setValue(barangayField, "", { shouldValidate: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, prefix, disableReset]);
}
