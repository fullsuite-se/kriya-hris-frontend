import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getGovernmentRemittancesColumns from "@/components/table/columns/GovernmentRemittancesColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddGovernmentRemittanceAPI,
  useDeleteGovernmentRemittanceAPI,
  useEditGovernmentRemittanceAPI,
  useFetchGovernmentRemittancesAPI,
} from "@/hooks/useGovernmentRemittancesAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export const GovernmentRemittanceTab = () => {
  const {
    allGovernmentRemittances,
    refetch: refetchAllGovernmentRemittances,
    setAllGovernmentRemittances,
    loading,
    error,
  } = useFetchGovernmentRemittancesAPI();

  const [governmentRemittancesDialogOpen, setGovernmentRemittancesDialogOpen] =
    useState(false);

  const { addGovernmentRemittance, loading: governmentRemittancesLoading } =
    useAddGovernmentRemittanceAPI();
  const { editGovernmentRemittance, loading: editLoading } =
    useEditGovernmentRemittanceAPI();
  const { deleteGovernmentRemittance, loading: deleteLoading } =
    useDeleteGovernmentRemittanceAPI();

  // Local state management functions
  const removeLocalGovernmentRemittance = (government_id_type_id) => {
    const remittanceToRemove = allGovernmentRemittances.find(
      (r) => r.government_id_type_id === government_id_type_id
    );
    setAllGovernmentRemittances((prev) =>
      prev.filter((r) => r.government_id_type_id !== government_id_type_id)
    );
    return remittanceToRemove;
  };

  const restoreLocalGovernmentRemittance = (remittance) => {
    setAllGovernmentRemittances((prev) =>
      [...prev, remittance].sort((a, b) =>
        a.government_id_name.localeCompare(b.government_id_name)
      )
    );
  };

  const updateLocalGovernmentRemittance = (government_id_type_id, newName) => {
    setAllGovernmentRemittances((prev) =>
      prev.map((remittance) =>
        remittance.government_id_type_id === government_id_type_id
          ? { ...remittance, government_id_name: newName }
          : remittance
      )
    );
  };

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

  const handleEditGovernmentRemittances = async (
    formData,
    government_id_type_id,
    government_id_name
  ) => {
    const updatedTitle = formData.get("government_id_name")?.trim();
    const previousTitle = government_id_name?.trim();

    if (
      !updatedTitle ||
      updatedTitle.toLowerCase() === previousTitle.toLowerCase()
    ) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousTitle}</span>.
          </>
        ),
        icon: (
          <InformationCircleIcon className="text-[#636363] w-5 h-5 mt-0.5" />
        ),
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 3000,
      });
      return;
    }

    updateLocalGovernmentRemittance(government_id_type_id, updatedTitle);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          Government Remittance{" "}
          <span style={{ color: "#008080" }}>{previousTitle}</span> updated to{" "}
          <span style={{ color: "#008080" }}>{updatedTitle}</span>
        </>
      ),
      icon: <CheckCircleIcon className="text-[#008080] w-5 h-5 mt-0.5" />,
      textColor: "black",
      bgColor: "rgba(255, 255, 255, 0.2)",
      blur: 12,
      duration: 5000,
      progressDuration: 5000,
      onUndo: () => {
        undoCalled = true;
        updateLocalGovernmentRemittance(government_id_type_id, previousTitle);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        console.log("gov idddddd typee nameee : ", updatedTitle);
        await editGovernmentRemittance({
          government_id_type_id,
          government_id_name: updatedTitle,
        });
        refetchAllGovernmentRemittances();
      } catch (err) {
        console.error("Failed to update government remittance:", err);
        glassToast({
          message: `Failed to update government remittance.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalGovernmentRemittance(government_id_type_id, previousTitle);
      }
    }, 5000);
  };

  const handleDeleteGovernmentRemittances = async (
    government_id_type_id,
    government_id_name
  ) => {
    const deletedRemittance = removeLocalGovernmentRemittance(
      government_id_type_id
    );

    let undoCalled = false;

    glassToast({
      message: (
        <>
          Government Remittance{" "}
          <span style={{ color: "#008080" }}>{government_id_name}</span> deleted
          successfully!
        </>
      ),
      icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
      textColor: "black",
      bgColor: "rgba(255, 255, 255, 0.2)",
      blur: 12,
      duration: 5000,
      progressDuration: 5000,
      onUndo: () => {
        undoCalled = true;
        restoreLocalGovernmentRemittance(deletedRemittance);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteGovernmentRemittance(government_id_type_id);
        refetchAllGovernmentRemittances();
      } catch (err) {
        console.error("Failed to delete government remittance:", err);
        glassToast({
          message: `Failed to delete government remittance "${government_id_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalGovernmentRemittance(deletedRemittance);
      }
    }, 5000);
  };

  const governmentRemittancesColumns = getGovernmentRemittancesColumns({
    onEdit: handleEditGovernmentRemittances,
    onDelete: handleDeleteGovernmentRemittances,
    editLoading: editLoading,
    deleteLoading: deleteLoading,
  });

  if (loading) {
    return <LoadingAnimation />;
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
            <Input name="government_id_name" type="text" required />
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
