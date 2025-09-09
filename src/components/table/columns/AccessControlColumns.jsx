import CustomDialog from "@/components/dialog/CustomDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ServiceChips from "@/pages/hris/access-control/components/ServicesChips";
import ViewUserAccessDialog from "@/pages/hris/access-control/dialogs/ViewUserAccessDialog";
import { ArrowTopRightOnSquareIcon, PencilIcon } from "@heroicons/react/24/solid";
import {
  EyeIcon,
  Pencil,
  ToggleLeftIcon,
  ToggleRight,
  ToggleRightIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { id } from "zod/v4/locales";

export const accessControlColumns = [
  {
    accessorKey: "employee_id",
    header: "ID",
    cell: ({ row }) => {
      const employeeId = row.original.employee_id;
      return <span className="text-xs">{employeeId || "---"}</span>;
    },
  },
  {
    // accessorKey: "employee",
    accessorFn: (row) =>
      `${row.last_name}, ${row.first_name} ${
        row.middle_name ? row.middle_name[0] + "." : ""
      }`,
    header: "User",
    cell: ({ row }) => {
      const employee = row.original;
      const fullName = `${employee.last_name}, ${employee.first_name} ${
        employee.middle_name ? employee.middle_name[0] + "." : ""
      }`;

      const initials = `${employee.first_name?.[0] ?? ""}${
        employee.last_name?.[0] ?? ""
      }`.toUpperCase();

      return (
        <div className="flex items-center gap-2 mr-10">
          <div className="h-10 w-10 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-primary-color flex-shrink-0">
            {employee.user_pic ? (
              <img
                src={employee.user_pic}
                alt="Profile"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span className="text-xs font-bold text-white">{initials}</span>
            )}
          </div>

          <div className="flex flex-col max-w-[120px]">
            <span className="text-xs font-medium truncate">{fullName}</span>
            <span className="text-[10px] text-gray-400 truncate">
              {employee.email}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    id:"services",
    // accessorKey: "is_deactivated",
    header: "Service Access",
    cell: ({ row }) => {
      const user = row.original.user;
      const services = user.Services
      return (
        <ServiceChips services={services}/>
      );
    },
  },

  {
    id: "actions",
    // header: () => <div className="text-right mr-1 sm:mr-3">Actions</div>,
    cell: ({ row }) => {
      const userAccessDetails = row.original.user;
      return (
        <div className="flex justify-end">
            <ViewUserAccessDialog
            trigger={
              <button
                className="!cursor-pointer text-muted-foreground hover:text-[#008080] transition-colors"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
            }
            userAccessDetails={userAccessDetails}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];
