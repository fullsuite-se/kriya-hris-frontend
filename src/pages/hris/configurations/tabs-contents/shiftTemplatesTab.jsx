import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getJobPositionColumns from "@/components/table/columns/JobPositionsColumns";
import getShiftTemplatesColumns from "@/components/table/columns/ShiftTemplatesColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddJobAPI,
  useDeleteJobAPI,
  useEditJobAPI,
  useFetchAllJobsAPI,
} from "@/hooks/useJobAPI";
import useFetchAllShiftTemplatesAPI from "@/hooks/useShiftTemplatesAPI";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ShiftTemplatesTab = () => {
  const { systemCompanyId } = useAuthStore();
  const { allShiftTemplates, refetch, setAllShiftTemplates, loading, error } =
    useFetchAllShiftTemplatesAPI();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addJob, loading: addLoading } = useAddJobAPI();
  const { deleteJob, loading: deleteLoading } = useDeleteJobAPI();
  const { editJob, loading: editLoading } = useEditJobAPI();

  const removeLocalJob = (shift_template_id) => {
    const shiftTemplateToRemove = allShiftTemplates.find(
      (j) => j.shift_template_id === shift_template_id
    );
    setAllShiftTemplates((prev) =>
      prev.filter((j) => j.shift_template_id !== shift_template_id)
    );
    return shiftTemplateToRemove;
  };

  const restoreLocalJob = (job) => {
    setAllShiftTemplates((prev) =>
      [...prev, job].sort((a, b) => a.shift_name.localeCompare(b.shift_name))
    );
  };

  const updateLocalJobTitle = (shift_template_id, newTitle) => {
    setAllShiftTemplates((prevJobs) =>
      prevJobs.map((job) =>
        job.shift_template_id === shift_template_id
          ? { ...job, shift_name: newTitle }
          : job
      )
    );
  };

  const handleSave = async (formData) => {
    const jobTitle = formData.get("shift_name");

    try {
      await addJob({ company_id: systemCompanyId, shift_name: jobTitle });
      setDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{jobTitle}</span> added
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetch();
    } catch (error) {
      glassToast({
        message: `Failed to add job. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEdit = async (formData, shift_template_id, shift_name) => {
    const updatedTitle = formData.get("shift_name")?.trim();
    const previousTitle = shift_name?.trim();

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

    updateLocalJobTitle(shift_template_id, updatedTitle);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          Shift Template{" "}
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
        updateLocalJobTitle(shift_template_id, previousTitle);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editJob({
          company_id: systemCompanyId,
          shift_template_id,
          new_shift_name: updatedTitle,
        });
        refetch();
      } catch (err) {
        console.error("Failed to update job:", err);
        glassToast({
          message: `Failed to update job title.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalJobTitle(shift_template_id, previousTitle);
      }
    }, 5000);
  };

  const handleDelete = async (shift_template_id, shift_name) => {
    const deletedJob = removeLocalJob(shift_template_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          Shift Template <span style={{ color: "#008080" }}>{shift_name}</span>{" "}
          deleted successfully!
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
        restoreLocalJob(deletedJob);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteJob({ company_id: systemCompanyId, shift_template_id });
        refetch();
      } catch (err) {
        console.error("Failed to delete job:", err);
        glassToast({
          message: `Failed to delete job "${shift_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalJob(deletedJob);
      }
    }, 5000);
  };

  const shiftTemplatesColumns = getShiftTemplatesColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
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
          <h2 className="text-lg font-semibold">Shift Templates</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +
              <span className=" hidden sm:inline text-xs">
                &nbsp;Add New Shift
              </span>
            </Button>
          }
          title="Add New Shift Template"
          confirmLabel="Save Shift Template"
          description="Enter the details for the new job position"
          onConfirm={handleSave}
          loading={addLoading}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <div className="space-y-2">
            <label className="text-xs font-medium block" htmlFor="shift_name">
              Shift Template
            </label>
            <Input
              name="shift_name"
              type="text"
              //   className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={shiftTemplatesColumns}
        data={allShiftTemplates}
        searchKeys={["shift_name"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default ShiftTemplatesTab;
