import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getEmployeeTypesColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "employment_type",
    header: "Employee Type",
    cell: ({ row }) => {
      const employeeType = row.original.employment_type;
      return <span className="text-xs">{employeeType || "---"}</span>;
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
      const { employment_type_id, employment_type } = row.original;

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
            title="Edit Employee Type"
            description={`Modify details for "${employment_type}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, employment_type_id, employment_type);
              setEditDialogOpen(false);
            }}
          >
            <div className="space-y-2">
              <label className="text-xs font-medium block">Employee Type</label>
              <Input
                name="employment_type"
                defaultValue={employment_type}
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
            description={`Delete "${employment_type}"? Employees using this will have no employee type.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(employment_type_id, employment_type)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getEmployeeTypesColumns;
