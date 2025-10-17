import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getDivisionsColumns = ({
  onEdit,
  onDelete,
  editLoading,
  deleteLoading,
}) => [
  {
    accessorKey: "division_name",
    header: "Division",
    cell: ({ row }) => {
      const division = row.original.division_name;
      return <span className="text-xs">{division || "---"}</span>;
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
      const { division_id, division_name } = row.original;

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
            title="Edit Division"
            loading={editLoading}
            description={`Modify details for "${division_name}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, division_id, division_name);
              setEditDialogOpen(false);
            }}
          >
            <div className="space-y-2">
              <label className="text-xs font-medium block">Division</label>
              <Input
                name="division_name"
                defaultValue={division_name}
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
            loading={deleteLoading}
            description={`Delete "${division_name}"? Employees using this will have no division.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(division_id, division_name)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getDivisionsColumns;
