import { Pencil, Trash2 } from "lucide-react";
import formatDate from "@/utils/formatters/dateFormatter";
import CustomDialog from "@/components/dialog/CustomDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const getOfficesColumns = ({
  onEdit,
  onDelete,
  editLoading,
  deleteLoading,
}) => [
  {
    accessorKey: "office_name",
    header: "Office",
    cell: ({ row }) => {
      const officeName = row.original.office_name;
      return <span className="text-xs">{officeName || "---"}</span>;
    },
  },
  {
    accessorKey: "office_address",
    header: "Office Address",
    cell: ({ row }) => {
      const officeAddress = row.original.office_address;
      return <span className="text-xs">{officeAddress || "---"}</span>;
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
      const { office_id, office_name, office_address } = row.original;

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
            height="md"
            title="Edit Office"
            loading={editLoading}
            description={`Modify details for "${office_name}"`}
            confirmLabel="Save Changes"
            onConfirm={async (formData) => {
              await onEdit(formData, office_id, office_name, office_address);
              setEditDialogOpen(false);
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium block">
                  Office<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="office_name"
                  defaultValue={office_name}
                  // className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium block">
                  Address<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="office_address"
                  defaultValue={office_address}
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
            description={`Delete "${office_name}"? Employees using this will have no office.`}
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            onConfirm={() => onDelete(office_id, office_name)}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];

export default getOfficesColumns;
