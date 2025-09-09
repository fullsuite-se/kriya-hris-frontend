import { useHeader } from "@/context/HeaderContext";
import React, { useEffect } from "react";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import JobPositionsTab from "./tabs-contents/JobPositionsTab";
import JobSettingsTab from "./tabs-contents/JobSettingsTab";
import GovernmentRemittanceTab from "./tabs-contents/GovernmentRemittancesTab";
import ShiftTemplatesTab from "./tabs-contents/shiftTemplatesTab";
const ConfigurationsPage = () => {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: "HRIS Configurations",
      description:
        "Manage reference tables like jobs, statuses, shifts, and remittances",
    });
  }, []);


    useEffect(() => {
      document.title =  "Configurations";
    }, []);
  const tabItems = [
    {
      value: "job_positions",
      label: "Job Positions",
      content: <JobPositionsTab />,
    },
    {
      value: "job_settings",
      label: "Job Settings",
      content: <JobSettingsTab />,
    },
    {
      value: "shift_templates",
      label: "Shift Templates",
      content: <ShiftTemplatesTab />,
    }, {
      value: "government_remittances",
      label: "Government Remittances",
      content: <GovernmentRemittanceTab />,
    },
  ];

  return (
    <div>
      <DynamicTabs tabs={tabItems} />
    </div>
  );
};

export default ConfigurationsPage;
