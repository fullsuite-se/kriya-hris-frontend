import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getTeamsColumns = ({
  onEdit,
  onDelete,
  editLoading,
  deleteLoading,
}) => [
  {
    accessorKey: "team_name",
    header: "Team",
    cell: ({ row }) => {
      const teamName = row.original.team_name;
      return <span className="text-xs">{teamName || "---"}</span>;
    },
  },
  {
    accessorKey: "team_description",
    header: "Team Description",
    cell: ({ row }) => {
      const teamDescription = row.original.team_description;
      return <span className="text-xs">{teamDescription || "---"}</span>;
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
      const { team_id, team_name, team_description } = row.original;

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
            title="Edit Team"
            height="md"
            loading={editLoading}
            description={`Modify details for "${team_name}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, team_id, team_name, team_description);
              setEditDialogOpen(false);
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium block">
                  Team<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="team_name"
                  defaultValue={team_name}
                  // className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium block">
                  Description<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="team_description"
                  defaultValue={team_description}
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
            loading={deleteLoading}
            description={`Delete "${team_name}"? Employees using this will have no team.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(team_id, team_name)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getTeamsColumns;
