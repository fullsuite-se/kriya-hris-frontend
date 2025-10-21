import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getJobLevelsColumns = ({
  onEdit,
  onDelete,
  editLoading,
  deleteLoading,
}) => [
  {
    accessorKey: "job_level_name",
    header: "Job Level",
    cell: ({ row }) => {
      const jobLevel = row.original.job_level_name;
      return <span className="text-xs">{jobLevel || "---"}</span>;
    },
  },
  {
    accessorKey: "job_level_description",
    header: "Description",
    cell: ({ row }) => {
      const jobLevelDescription = row.original.job_level_description;
      return <span className="text-xs">{jobLevelDescription || "---"}</span>;
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
    // header: () => <div className="text-right mr-1 sm:mr-3">Actions</div>,
    cell: ({ row }) => {
      const { job_level_id, job_level_name, job_level_description } =
        row.original;

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
            loading={editLoading}
            title="Edit Job Level"
            height="md"
            description={`Modify details for "${job_level_name}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, job_level_id, job_level_name, job_level_description);
              setEditDialogOpen(false);
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium block">
                  Job Level<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="job_level_name"
                  defaultValue={job_level_name}
                  // className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium block">Description</label>
                <Input
                  name="job_level_description"
                  defaultValue={job_level_description}
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
            loading={deleteLoading}
            title="Confirm Delete"
            description={`Delete "${job_level_name}"? Employees using this will have no job level.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(job_level_id, job_level_name)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getJobLevelsColumns;
