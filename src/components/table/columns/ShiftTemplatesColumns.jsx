import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getShiftTemplatesColumns = ({
  onEdit,
  onDelete,
  editLoading,
  deleteLoading,
}) => [
  {
    accessorKey: "shift_name",
    header: "Shift",
    cell: ({ row }) => {
      const shiftName = row.original.shift_name;
      return <span className="text-xs">{shiftName || "---"}</span>;
    },
  },
  {
    accessorKey: "day_of_week",
    header: "Day of Week",
    cell: ({ row }) => {
      const dayOfWeek = row.original.day_of_week;
      return <span className="text-xs">{dayOfWeek || "---"}</span>;
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => {
      const startTime = row.original.start_time;
      const formattedDate = formatDate(startTime, "time12");
      return <span className="text-xs">{formattedDate || "---"}</span>;
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => {
      const endTime = row.original.end_time;
      const formattedDate = formatDate(endTime, "time12");
      return <span className="text-xs">{formattedDate || "---"}</span>;
    },
  },
  {
    accessorKey: "break_start_time",
    header: "Break Start Time",
    cell: ({ row }) => {
      const breakStartTime = row.original.break_start_time;
      const formattedDate = formatDate(breakStartTime, "time12");
      return <span className="text-xs">{formattedDate || "---"}</span>;
    },
  },
  {
    accessorKey: "break_end_time",
    header: "Break End Time",
    cell: ({ row }) => {
      const breakEndTime = row.original.break_end_time;
      const formattedDate = formatDate(breakEndTime, "time12");
      return <span className="text-xs">{formattedDate || "---"}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const {
        shift_template_id,
        shift_name,
        day_of_week,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
      } = row.original;

      const [editDialogOpen, setEditDialogOpen] = useState(false);

      // Helper function to format time for input fields (HH:MM)
      const formatTimeForInput = (timeString) => {
        if (!timeString) return "";
        const date = new Date(`2000-01-01T${timeString}`);
        return date.toTimeString().slice(0, 5); // Returns "HH:MM" format
      };

      return (
        <div className="flex justify-end w-full gap-2 sm:gap-5">
          <CustomDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            trigger={
              <button
                className="!cursor-pointer text-muted-foreground hover:text-[#008080] transition-colors"
                title="Edit"
                disabled={editLoading}
              >
                <Pencil size={16} />
              </button>
            }
            title="Edit Shift Template"
            height="lg"
            width="md"
            description={`Modify details for "${shift_name}"`}
            confirmLabel="Save Changes"
            loading={editLoading}
            onConfirm={async (formData) => {
              await onEdit(
                formData,
                shift_template_id,
                shift_name,
                start_time,
                end_time,
                break_start_time,
                break_end_time,
                day_of_week
              );
              setEditDialogOpen(false);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <label
                  className="text-xs font-medium block"
                  htmlFor="shift_name"
                >
                  Shift Name<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="shift_name"
                  defaultValue={shift_name}
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-xs font-medium block"
                  htmlFor="day_of_week"
                >
                  Day of Week<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="day_of_week"
                  defaultValue={day_of_week}
                  type="number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-xs font-medium block"
                  htmlFor="start_time"
                >
                  Start Time<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="start_time"
                  defaultValue={formatTimeForInput(start_time)}
                  type="time"
                  step="60"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium block" htmlFor="end_time">
                  End Time<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="end_time"
                  defaultValue={formatTimeForInput(end_time)}
                  type="time"
                  step="60"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-xs font-medium block"
                  htmlFor="break_start_time"
                >
                  Break Start Time<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="break_start_time"
                  defaultValue={formatTimeForInput(break_start_time)}
                  type="time"
                  step="60"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-xs font-medium block"
                  htmlFor="break_end_time"
                >
                  Break End Time<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="break_end_time"
                  defaultValue={formatTimeForInput(break_end_time)}
                  type="time"
                  step="60"
                  required
                />
              </div>
            </div>
          </CustomDialog>

          <CustomDialog
            trigger={
              <button
                className="!cursor-pointer text-muted-foreground hover:text-red-700 transition-colors"
                title="Delete"
                disabled={deleteLoading}
              >
                <Trash2 size={16} />
              </button>
            }
            title="Confirm Delete"
            description={`Delete "${shift_name}"? Employees using this will have no shift.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            loading={deleteLoading}
            onConfirm={() => onDelete(shift_template_id, shift_name)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getShiftTemplatesColumns;
