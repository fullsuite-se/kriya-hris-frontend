import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getShiftTemplatesColumns from "@/components/table/columns/ShiftTemplatesColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import useFetchAllShiftTemplatesAPI, {
  useAddShiftTemplateAPI,
  useEditShiftTemplateAPI,
  useDeleteShiftTemplateAPI,
} from "@/hooks/useShiftTemplatesAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export const ShiftTemplatesTab = () => {
  const { allShiftTemplates, refetch, setAllShiftTemplates, loading, error } =
    useFetchAllShiftTemplatesAPI();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addShiftTemplate, loading: addLoading } = useAddShiftTemplateAPI();
  const { editShiftTemplate, loading: editLoading } = useEditShiftTemplateAPI();
  const { deleteShiftTemplate, loading: deleteLoading } =
    useDeleteShiftTemplateAPI();

  const removeLocalShiftTemplate = (shift_template_id) => {
    const shiftTemplateToRemove = allShiftTemplates.find(
      (j) => j.shift_template_id === shift_template_id
    );
    setAllShiftTemplates((prev) =>
      prev.filter((j) => j.shift_template_id !== shift_template_id)
    );
    return shiftTemplateToRemove;
  };

  const restoreLocalShiftTemplate = (shiftTemplate) => {
    setAllShiftTemplates((prev) =>
      [...prev, shiftTemplate].sort((a, b) =>
        a.shift_name.localeCompare(b.shift_name)
      )
    );
  };

  const updateLocalShiftTemplate = (shift_template_id, newData) => {
    setAllShiftTemplates((prevShiftTemplates) =>
      prevShiftTemplates.map((shiftTemplate) =>
        shiftTemplate.shift_template_id === shift_template_id
          ? { ...shiftTemplate, ...newData }
          : shiftTemplate
      )
    );
  };

  const handleSave = async (formData) => {
    const {
      shift_name,
      start_time,
      end_time,
      break_start_time,
      break_end_time,
      day_of_week,
    } = Object.fromEntries(formData.entries());
    try {
      await addShiftTemplate({
        shift_name,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        day_of_week,
      });
      setDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{shift_name}</span> added
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
        message: `Failed to add shift template. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEdit = async (
    formData,
    shift_template_id,
    shift_name,
    start_time,
    end_time,
    break_start_time,
    break_end_time,
    day_of_week
  ) => {
    const {
      shift_name: updatedShiftName,
      start_time: updatedStartTime,
      end_time: updatedEndTime,
      break_start_time: updatedBreakStartTime,
      break_end_time: updatedBreakEndTime,
      day_of_week: updatedDayOfWeek,
    } = Object.fromEntries(formData.entries());

    const normalizeTime = (timeString) => {
      if (!timeString) return "";
      if (timeString.includes(":")) {
        const parts = timeString.split(":");
        return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
      }
      return timeString;
    };
    const previousData = {
      shift_name: shift_name?.trim(),
      start_time: normalizeTime(start_time),
      end_time: normalizeTime(end_time),
      break_start_time: normalizeTime(break_start_time),
      break_end_time: normalizeTime(break_end_time),
      day_of_week: day_of_week?.toString().trim(),
    };

    const newData = {
      shift_name: updatedShiftName?.trim(),
      start_time: normalizeTime(updatedStartTime),
      end_time: normalizeTime(updatedEndTime),
      break_start_time: normalizeTime(updatedBreakStartTime),
      break_end_time: normalizeTime(updatedBreakEndTime),
      day_of_week: updatedDayOfWeek?.toString().trim(),
    };

    console.log("Previous Data:", previousData);
    console.log("New Data:", newData);

    const hasChanges =
      newData.shift_name !== previousData.shift_name ||
      newData.start_time !== previousData.start_time ||
      newData.end_time !== previousData.end_time ||
      newData.break_start_time !== previousData.break_start_time ||
      newData.break_end_time !== previousData.break_end_time ||
      newData.day_of_week !== previousData.day_of_week;

    console.log("Has changes:", hasChanges);

    if (!hasChanges) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{shift_name}</span>.
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

    updateLocalShiftTemplate(shift_template_id, newData);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{shift_name}</span> updated
          {updatedShiftName !== shift_name && (
            <>
              {" "}
              to <span style={{ color: "#008080" }}>{updatedShiftName}</span>
            </>
          )}{" "}
          successfully!
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
        updateLocalShiftTemplate(shift_template_id, previousData);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editShiftTemplate({
          shift_template_id,
          ...newData,
        });
        refetch();
      } catch (err) {
        console.error("Failed to update shift template:", err);
        glassToast({
          message: `Failed to update shift template.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalShiftTemplate(shift_template_id, previousData);
      }
    }, 5000);
  };

  const handleDelete = async (shift_template_id, shift_name) => {
    const deletedShiftTemplate = removeLocalShiftTemplate(shift_template_id);

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
        restoreLocalShiftTemplate(deletedShiftTemplate);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteShiftTemplate(shift_template_id);
        refetch();
      } catch (err) {
        console.error("Failed to delete shift template:", err);
        glassToast({
          message: `Failed to delete shift template "${shift_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalShiftTemplate(deletedShiftTemplate);
      }
    }, 5000);
  };

  const shiftTemplatesColumns = getShiftTemplatesColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
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
          height="lg"
          width="md"
          confirmLabel="Save Shift Template"
          description="Enter the details for the new job position"
          onConfirm={handleSave}
          loading={addLoading}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-2">
              <label className="text-xs font-medium block" htmlFor="shift_name">
                Shift Name
              </label>
              <Input name="shift_name" type="text" required />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="day_of_week"
              >
                Day of Week
              </label>
              <Input name="day_of_week" type="number" required />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium block" htmlFor="start_time">
                Start Time
              </label>
              <Input name="start_time" type="time" step="60" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium block" htmlFor="end_time">
                End Time
              </label>
              <Input name="end_time" type="time" step="60" required />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="break_start_time"
              >
                Break Start Time
              </label>
              <Input name="break_start_time" type="time" step="60" required />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="break_end_time"
              >
                Break End Time
              </label>
              <Input name="break_end_time" type="time" step="60" required />
            </div>
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
