import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getDivisionsColumns from "@/components/table/columns/DivisionsColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddDivisionAPI,
  useDeleteDivisionAPI,
  useEditDivisionAPI,
  // useAddDivisionAPI,
  // useDeleteDivisionAPI,
  // useEditDivisionAPI,
  useFetchDivisionsAPI,
} from "@/hooks/useCompanyAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";

export const DivisionsTab = () => {
  const {
    allDivisions,
    refetch: refetchAllDivisions,
    setAllDivisions,
    loading,
    error,
  } = useFetchDivisionsAPI();
  const [divisionsDialogOpen, setDivisionsDialogOpen] = useState(false);
  const { addDivision} = useAddDivisionAPI();
  const { deleteDivision } =
    useDeleteDivisionAPI();
  const { editDivision } = useEditDivisionAPI();

  const removeLocalDivision = (division_id) => {
    const divisionToRemove = allDivisions.find(
      (j) => j.division_id === division_id
    );
    setAllDivisions((prev) =>
      prev.filter((j) => j.division_id !== division_id)
    );
    return divisionToRemove; // store this for undo
  };

  const restoreLocalDivision = (division) => {
    setAllDivisions((prev) =>
      [...prev, division].sort((a, b) =>
        a.division_name.localeCompare(b.division_name)
      )
    );
  };

  const updateLocalDivision = (division_id, division_name) => {
    setAllDivisions((prevDivisions) =>
      prevDivisions.map((division) =>
        division.division_id === division_id
          ? { ...division, division_name }
          : division
      )
    );
  };

  const handleSaveDivision = async (formData) => {
    const division = formData.get("division_name");

    try {
      await addDivision(division);
      setDivisionsDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{division}</span> added
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllDivisions();
    } catch (error) {
      glassToast({
        message: `Failed to add division. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditDivision = async (formData, division_id, division_name) => {
    const updatedDivisionName = formData.get("division_name")?.trim();
    const previousDivisionName = division_name?.trim();

    if (
      !updatedDivisionName ||
      updatedDivisionName.toLowerCase() === previousDivisionName.toLowerCase()
    ) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousDivisionName}</span>.
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

    updateLocalDivision(division_id, updatedDivisionName);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{previousDivisionName}</span>{" "}
          updated to{" "}
          <span style={{ color: "#008080" }}>{updatedDivisionName}</span>
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
        updateLocalDivision(division_id, previousDivisionName);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editDivision(division_id, updatedDivisionName);
        refetchAllDivisions();
      } catch (err) {
        console.error("Failed to update division:", err);
        glassToast({
          message: `Failed to update division.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalDivision(division_id, previousDivisionName);
      }
    }, 5000);
  };

  const handleDeleteDivision = async (division_id, division_name) => {
    const deletedDivision = removeLocalDivision(division_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{division_name}</span> deleted
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
        restoreLocalDivision(deletedDivision);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteDivision(division_id);
        refetchAllDivisions();
      } catch (err) {
        console.error("Failed to delete division:", err);
        glassToast({
          message: `Failed to delete "${division_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalDivision(deletedDivision);
      }
    }, 5000);
  };

  const divisionsColumns = getDivisionsColumns({
    onEdit: handleEditDivision,
    onDelete: handleDeleteDivision,
  });


   if (loading) {
    return (
      // <div className="flex items-center justify-center h-screen">
      //   <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
      // </div>
        <LoadingAnimation/>
    );
  }
  return (
    <div className=" p-5">
      <div className="justify-between items-center flex mb-8">
        <div>
          <h2 className="text-lg font-semibold">Divisions</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
            </Button>
          }
          title="Add New Division"
          confirmLabel="Save Division"
          description="Enter the details for the new division"
          onConfirm={handleSaveDivision}
          open={divisionsDialogOpen}
          onOpenChange={setDivisionsDialogOpen}
        >
          <div className="space-y-2">
            <label
              className="text-xs font-medium block"
              htmlFor="division_name"
            >
              Division<span className="text-primary-color">*</span>
            </label>
            <Input name="division_name" type="text" required />
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={divisionsColumns}
        data={allDivisions}
        searchKeys={["division_name"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default DivisionsTab;
