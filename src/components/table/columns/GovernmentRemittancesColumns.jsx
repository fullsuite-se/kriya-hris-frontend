import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getGovernmentRemittancesColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "government_id_type_id",
    header: "Government Remittance",
    cell: ({ row }) => {
      const governmentRemittance = row.original.government_id_name;
      return <span className="text-xs">{governmentRemittance || "---"}</span>;
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
      const { government_id_type_id, government_id_name } = row.original;

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
            title="Edit Government Remittance"
            description={`Modify details for "${government_id_name}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, government_id_type_id, government_id_name);
              setEditDialogOpen(false);
            }}
          >
            <div className="space-y-2">
              <label className="text-xs font-medium block">
                Government Remittance
              </label>
              <Input
                name="government_id_name"
                defaultValue={government_id_name}
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
            description={`Delete "${government_id_name}"? Employees using this will have no employee type.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() =>
              onDelete(government_id_type_id, government_id_name)
            }
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getGovernmentRemittancesColumns;
