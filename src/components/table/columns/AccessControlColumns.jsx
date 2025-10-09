import { Pencil } from "lucide-react";
import ServiceChips from "@/pages/hris/access-control/components/ServicesChips";
import ViewUserAccessDialog from "@/pages/hris/access-control/dialogs/ViewUserAccessDialog";

export const getAccessControlColumns = (refetch) => [
  {
    accessorKey: "user_id",
    header: "ID",
    cell: ({ row }) => {
      const userId = row.original.user_id;
      return <span className="text-xs">{userId || "---"}</span>;
    },
  },
  {
    accessorFn: (row) =>
      `${row.HrisUserInfo.last_name}, ${row.HrisUserInfo.first_name} ${
        row.HrisUserInfo.middle_name
          ? row.HrisUserInfo.middle_name[0] + "."
          : ""
      }`,
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const { HrisUserInfo } = user;
      const fullName = `${HrisUserInfo.last_name}, ${HrisUserInfo.first_name} ${
        HrisUserInfo.middle_name ? HrisUserInfo.middle_name[0] + "." : ""
      }`;

      const initials = `${HrisUserInfo.first_name?.[0] ?? ""}${
        HrisUserInfo.last_name?.[0] ?? ""
      }`.toUpperCase();

      const user_pic = user?.HrisUserInfo?.user_pic;

      return (
        <div className="flex items-center gap-2 mr-10">
          <div className="h-10 w-10 rounded-full border-1 border-gray-300 overflow-hidden flex items-center justify-center bg-primary-color flex-shrink-0">
            {user_pic ? (
              <img
                src={user_pic}
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
              {user.user_email}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    id: "services",
    header: "Service Access",
    cell: ({ row }) => {
      const user = row.original;
      // Map HrisUserServicePermissions to array of Service objects
      const services =
        user.HrisUserServicePermissions?.map((usp) => usp.Service) || [];
      return <ServiceChips services={services} />;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const userAccessDetails = row.original;
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
            method="edit"
            refetchUsers={refetch}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];
