import { useMemo } from "react";
import ControlledDynamicSelectTextFields from "./ControlledDynamicSelectTextFields";
import { useFetchGovernmentRemittancesAPI } from "@/hooks/useGovernmentRemittancesAPI";
export default function GovernmentRemittancesSection() {
  const { allGovernmentRemittances, isLoading } =
    useFetchGovernmentRemittancesAPI();

  const govOptions = useMemo(() => {
    if (!allGovernmentRemittances) return [];
    return allGovernmentRemittances.map((item) => ({
      label: item.government_id_name,
      value: item.government_id_type_id,
    }));
  }, [allGovernmentRemittances]);

  return (
    <ControlledDynamicSelectTextFields
      name="governmentRemittances"
      label="Government Remittances"
      selectOptions={govOptions}
      selectField="type"
      inputField="acc_number"
      selectPlaceholder={isLoading ? "Loading..." : "Select ID Type"}
      inputPlaceholder="Enter ID number"
      disableSelectedOptions={true}
      maxFields={govOptions.length}
    />
  );
}
