import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// import { Edit3Icon } from "lucide-react";
import {
  PencilIcon,
  MapPinIcon,
  BanknotesIcon,
  CalendarDateRangeIcon,
} from "@heroicons/react/24/solid";
import { use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import formatDate from "@/utils/formatters/dateFormatter";
import DriveFolderEmbed from "../../drive-folder/DriveFolderEmbed";
import EditDesignationDialog from "./dialogs/EditDesignationDialog";
import EditSalaryDialog from "./dialogs/EditSalaryDialog";
import EditEmploymentTimelineDialog from "./dialogs/EditEmploymentTimelineDialog";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  isToday,
  isPast,
  parseISO,
  startOfDay,
} from "date-fns";
export const EmploymentInfoTab = ({ refetch }) => {
  const { designations, employmentInfo, salaryInfo } = useContext(
    EmployeeDetailsContext
  );

  const dateString = employmentInfo?.date_regularization;

  const renderCountdown = (date) => {
    if (!date) return "";

    const targetDate = parseISO(date);
    const now = new Date();

    if (isPast(targetDate) && !isToday(targetDate)) return "";

    if (isToday(targetDate)) return "(Today)";

    const daysDiff = differenceInDays(startOfDay(targetDate), startOfDay(now));

    if (daysDiff >= 30) {
      const monthsDiff = differenceInMonths(targetDate, now);
      return `(${monthsDiff} month${monthsDiff > 1 ? "s" : ""} left)`;
    }

    if (daysDiff >= 1) {
      return `(${daysDiff} day${daysDiff > 1 ? "s" : ""} left)`;
    }

    const hoursDiff = differenceInHours(targetDate, now);
    if (hoursDiff > 0) {
      return `(${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} left)`;
    }

    return "";
  };

  return (
    <div className="px-5 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm p-10 border-1 border-gray-200 rounded-lg">
        {/* designation */}
        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 hidden sm:inline" />
            Designation
          </div>

          <EditDesignationDialog
            trigger={
              <Button
                variant="ghost"
                className="cursor-pointer !text-sm !text-[#008080] hover:!bg-[#0080801a] border-none flex items-center gap-1"
              >
                <PencilIcon className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Edit</span>
              </Button>
            }
            refetch={refetch}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Employer</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {designations?.CompanyEmployer?.company_employer_name ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>{" "}
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Office</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {designations?.CompanyOffice?.office_name ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Division</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {designations?.CompanyDivision?.division_name ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Department</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {designations?.CompanyDepartment?.department_name ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Team</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {designations?.CompanyTeam?.team_name ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Job Position</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {designations?.CompanyJobTitle?.job_title ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Job Level</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {employmentInfo?.HrisUserJobLevel?.job_level_name ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Employee Type</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {employmentInfo?.HrisUserEmploymentType?.employment_type ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Shift</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {`${
              employmentInfo?.HrisUserShiftsTemplate?.shift_name
            } (${formatDate(
              employmentInfo?.HrisUserShiftsTemplate?.start_time,
              "time12"
            )} - ${formatDate(
              employmentInfo?.HrisUserShiftsTemplate?.end_time,
              "time12"
            )})` ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Immediate Supervisor</p>

          <p className="text-primary-color hover:text-[#008080e6] font-semibold break-words whitespace-normal">
            <a
              href={"/hris/employees/" + designations?.upline_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`${designations?.upline?.HrisUserInfo?.first_name} ${designations?.upline?.HrisUserInfo?.last_name}` ??
                "---"}
            </a>
          </p>

          <Separator className="my-2" />
        </div>
        {/* salary */}
        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase mt-10">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="h-4 w-4 hidden sm:inline" />
            Salary Information
          </div>

          <EditSalaryDialog
            trigger={
              <Button
                variant="ghost"
                className="cursor-pointer !text-sm !text-[#008080] hover:!bg-[#0080801a] border-none flex items-center gap-1"
              >
                <PencilIcon className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Edit</span>
              </Button>
            }
            refetch={refetch}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Base Pay (PHP)</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {salaryInfo?.base_pay
              ? Number(salaryInfo.base_pay).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Type</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {salaryInfo?.HrisUserSalaryAdjustmentType?.salary_adjustment_type ||
              "---"}
          </p>
          <Separator className="my-2" />
        </div>
        {/* Employment timeline */}
        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase mt-10">
          <div className="flex items-center gap-2">
            <CalendarDateRangeIcon className="h-4 w-4 hidden sm:inline" />
            Employment Timeline
          </div>

          <EditEmploymentTimelineDialog
            trigger={
              <Button
                variant="ghost"
                className="cursor-pointer !text-sm !text-[#008080] hover:!bg-[#0080801a] border-none flex items-center gap-1"
              >
                <PencilIcon className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Edit</span>
              </Button>
            }
            refetch={refetch}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Date Hired</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {formatDate(employmentInfo?.date_hired, "fullMonth") ?? "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Date Regularized</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {dateString ? (
              <>
                {formatDate(dateString, "fullMonth")}{" "}
                <span className="text-xs text-muted-foreground font-medium italic">
                  {renderCountdown(dateString)}
                </span>
              </>
            ) : (
              "---"
            )}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Date Offboarded</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {employmentInfo?.date_offboarding
              ? formatDate(employmentInfo?.date_offboarding, "fullMonth")
              : "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Date Separated</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {employmentInfo?.date_separated
              ? formatDate(employmentInfo?.date_separated, "fullMonth")
              : "---"}
          </p>
          <Separator className="my-2" />
        </div>
      </div>
    </div>
  );
};

export default EmploymentInfoTab;
