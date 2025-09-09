import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getDepartmentsColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "department_name",
    header: "Department",
    cell: ({ row }) => {
      const departmentName = row.original.department_name;
      return <span className="text-xs">{departmentName || "---"}</span>;
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
      const { department_id, department_name, department_address } = row.original;

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
            title="Edit Department"
            description={`Modify details for "${department_name}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, department_id, department_name);
              setEditDialogOpen(false);
            }}
          >
              <div className="space-y-2">
                <label className="text-xs font-medium block">
                  Department<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="department_name"
                  defaultValue={department_name}
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
            description={`Delete "${department_name}"? Employees using this will have no department.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(department_id, department_name)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getDepartmentsColumns;
