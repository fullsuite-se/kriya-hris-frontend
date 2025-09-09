import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getJobPositionColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "job_title",
    header: "Job Position",
    cell: ({ row }) => {
      const jobTitle = row.original.job_title;
      return <span className="text-xs">{jobTitle || "---"}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => {
      const dateCreated = row.original.created_at;
      const formattedDate = formatDate(dateCreated, "fullWithTime");
      return <span className="text-xs">{formattedDate || "---"}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Date Updated",
    cell: ({ row }) => {
      const dateUpdated = row.original.updated_at;
      const formattedDate = formatDate(dateUpdated, "fullWithTime");
      return <span className="text-xs">{formattedDate || "---"}</span>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right mr-1 sm:mr-3">Actions</div>,
    cell: ({ row }) => {
      const { job_title_id, job_title } = row.original;

      const [editDialogOpen, setEditDialogOpen] = useState(false);

      return (
        <div className="flex justify-start w-full gap-2 sm:gap-5">
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
            title="Edit Job"
            description={`Modify details for "${job_title}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, job_title_id, job_title);
              setEditDialogOpen(false);
            }}
          >
            <div className="space-y-2">
              <label className="text-xs font-medium block">Job Position</label>
              <Input
                name="job_title"
                defaultValue={job_title}
                // className="border rounded px-2 py-1 w-full"
              />
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
            description={`Delete "${job_title}"? Employees using this will have no job position.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(job_title_id, job_title)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getJobPositionColumns;
