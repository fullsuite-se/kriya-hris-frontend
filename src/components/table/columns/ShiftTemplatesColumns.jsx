import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getShiftTemplatesColumns = ({ onEdit, onDelete }) => [
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
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => {
      const endTime = row.original.end_time;
      const formattedDate = formatDate(endTime, "time12");
      return <span className="text-xs">{formattedDate || "---"}</span>;
    },
  },
  {
    id: "actions",
    // header: () => <div className="text-right mr-1 sm:mr-3">Actions</div>,
    cell: ({ row }) => {
      const { shift_template_id, shift_name, day_of_week } = row.original;

      const [editDialogOpen, setEditDialogOpen] = useState(false);

      return (
        <div className="flex justify-end w-full gap-2 sm:gap-5">
          <CustomDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            trigger={
              <button
                className="!cursor-pointer text-muted-foreground hover:text-[#008080] transition-colors"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
            }
            title="Edit Shift Template"
            description={`Modify details for "${shift_name}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, shift_template_id, shift_name);
              setEditDialogOpen(false);
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium block">
                  Shift Template<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="shift_name"
                  defaultValue={shift_name}
                  // className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium block">Day of Week</label>
                <Input
                  name="day_of_week"
                  defaultValue={day_of_week}
                  // className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>
          </CustomDialog>

          <CustomDialog
            trigger={
              <button
                className="!cursor-pointer text-muted-foreground hover:text-red-700 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            }
            title="Confirm Delete"
            description={`Delete "${shift_name}"? Employees using this will have no shift.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(shift_template_id, shift_name)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getShiftTemplatesColumns;
