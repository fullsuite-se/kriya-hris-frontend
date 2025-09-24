import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getEmployeeTypesColumns from "@/components/table/columns/EmployeeTypesColumns";
import getEmploymentStatusColumns from "@/components/table/columns/EmploymentStatusColumns";
import getGovernmentRemittancesColumns from "@/components/table/columns/GovernmentRemittancesColumns";
import getJobLevelsColumns from "@/components/table/columns/JobLevelsColumns";
import getJobPositionColumns from "@/components/table/columns/JobPositionsColumns";
import getSalaryTypesColumns from "@/components/table/columns/SalaryTypesColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddGovernmentRemittanceAPI,
  useFetchGovernmentRemittancesAPI,
} from "@/hooks/useGovernmentRemittancesAPI";
import {
  useAddJobAPI,
  useDeleteJobAPI,
  useEditJobAPI,
  useFetchAllJobsAPI,
} from "@/hooks/useJobAPI";
import {
  useAddEmployeeTypeAPI,
  useAddEmploymentStatusAPI,
  useAddJobLevelAPI,
  useAddSalaryTypeAPI,
  useFetchEmployeeTypesAPI,
  useFetchEmploymentStatusAPI,
  useFetchJobLevelsAPI,
  useFetchSalaryTypesAPI,
} from "@/hooks/useJobSettingsAPI";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GovernmentRemittanceTab = () => {
  const { allGovernmentRemittances, refetch: refetchAllGovernmentRemittances, loading, error } =
    useFetchGovernmentRemittancesAPI();
  const [governmentRemittancesDialogOpen, setGovernmentRemittancesDialogOpen] =
    useState(false);
  const { addGovernmentRemittance, loading: governmentRemittancesLoading } =
    useAddGovernmentRemittanceAPI();

  const handleSaveGovernmentRemittances = async (formData) => {
    const governmentRemittance = formData.get("government_id_name");
    try {
      await addGovernmentRemittance(governmentRemittance);
      setGovernmentRemittancesDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{governmentRemittance}</span>{" "}
            added successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllGovernmentRemittances();
    } catch (error) {
      glassToast({
        message: `Failed to add government remittance. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditGovernmentRemittances = async () => {};

  const handleDeleteGovernmentRemittances = async () => {};

  const governmentRemittancesColumns = getGovernmentRemittancesColumns({
    onEdit: handleEditGovernmentRemittances,
    onDelete: handleDeleteGovernmentRemittances,
  });

 if (loading) {
    return (
      // <div className="flex items-center justify-center h-screen">
      //   <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
      // </div>
        <LoadingAnimation/>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }
  return (
    <div className=" bg-white shadow-xs rounded-lg p-5">
      <div className="justify-between items-center flex mb-8">
        <div>
          <h2 className="text-lg font-semibold">Government Remittances</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
            </Button>
          }
          title="Add New Government Remittance"
          confirmLabel="Save Government Remittance"
          description="Enter the details for the new government remittance"
          onConfirm={handleSaveGovernmentRemittances}
          loading={governmentRemittancesLoading}
          open={governmentRemittancesDialogOpen}
          onOpenChange={setGovernmentRemittancesDialogOpen}
        >
          <div className="space-y-2">
            <label
              className="text-xs font-medium block"
              htmlFor="government_id_name"
            >
              Government Remittance
            </label>
            <Input
              name="government_id_name"
              type="text"
              // className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={governmentRemittancesColumns}
        data={allGovernmentRemittances}
        searchKeys={["government_id_name"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default GovernmentRemittanceTab;
