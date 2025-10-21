import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export const employeeCols = [
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
    header: "Employee",
    cell: ({ row }) => {
      const employee = row.original;
      const fullName = `${employee.last_name}, ${employee.first_name} ${
        employee.middle_name ? employee.middle_name[0] + "." : ""
      }`;

      const initials = `${employee.first_name?.[0] ?? ""}${
        employee.last_name?.[0] ?? ""
      }`.toUpperCase();
      const status = employee?.status;

      return (
        <div className="flex items-center gap-2 mr-10">
          <div
            className={`
    h-10 w-10 rounded-full border border-gray-300 overflow-hidden 
    flex items-center justify-center flex-shrink-0
    ${
      status?.toLowerCase() === "separated" ? "bg-gray-400" : "bg-primary-color"
    }
  `}
          >
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
          {/* removed truncate */}
          <div className="flex flex-col max-w-[120px]">
            <span className="text-xs font-medium">{fullName}</span>
            <span className="text-[10px] text-gray-400">{employee.email}</span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "job_title",
    header: "Job Position",
    cell: ({ row }) => {
      const jobTitle = row.original.job_title;
      return <span className="text-xs">{jobTitle || "---"}</span>;
    },
  },
  {
    accessorKey: "date_hired",
    header: "Date Hired",
    cell: ({ row }) => {
      const dateHired = row.original.date_hired;
      return <span className="text-xs">{dateHired || "---"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "---";
      const firstLetter = status.charAt(0);
      const normalized = firstLetter.toLowerCase();

      const colorClass =
        normalized === "r"
          ? "text-green-700 bg-green-700/10"
          : normalized === "p"
          ? "text-cyan-700 bg-cyan-700/10"
          : normalized === "s"
          ? "text-red-700 bg-red-700/10"
          : "text-gray-700 bg-gray-700/10";

      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`text-xs px-2 py-1 rounded-md font-medium cursor-default ${colorClass}`}
              >
                {firstLetter}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs capitalize">{status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "regularization_date",
    header: "Regularization",
    cell: ({ row }) => {
      const regularizationDate = row.original.regularization_date;
      const detailsUrl = `/hris/employees/${row.original.employee_id}`;

      return (
        <div className="flex justify-end">
          <span className="text-xs mr-5">{regularizationDate || "---"}</span>
          <a
            href={detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowTopRightOnSquareIcon
              className="text-muted-foreground hover:text-[#008080]"
              width={15}
            />
          </a>
        </div>
      );
    },
  },
];
