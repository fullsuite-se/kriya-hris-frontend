import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// import { Edit3Icon } from "lucide-react";
import {
  PencilIcon,
  ArrowTopRightOnSquareIcon,
  Squares2X2Icon,
  QueueListIcon,
} from "@heroicons/react/24/solid";
import {
  Squares2X2Icon as Squares2X2IconOutline,
  QueueListIcon as QueueListIconOutline,
} from "@heroicons/react/24/outline";
import { use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import formatDate from "@/utils/formatters/dateFormatter";
import DriveFolderEmbed from "../../drive-folder/DriveFolderEmbed";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditDocuUrlDialog from "./dialogs/EditDocuUrlDialog";

export const EmployeeDocumentsTab = ({refetch}) => {

  const [isListViewOptionClicked, setIsListViewOptionClicked] = useState(true);
  const [isGridViewOptionClicked, setIsGridViewOptionClicked] = useState(false);

  const {
    personalInfo,
    jobDetails,
    user,
    designations,
    employmentInfo,
    salaryInfo,
    governmentIds,
    emergencyContacts,
    hr201,
  } = useContext(EmployeeDetailsContext);

  const navigate = useNavigate();

  const getGovIdNumber = (type) => {
    return (
      governmentIds.find(
        (id) =>
          id?.HrisUserGovernmentIdType?.government_id_name?.toLowerCase() ===
          type.toLowerCase()
      )?.government_id_number || "---"
    );
  };
  // const folderLink =
  //   "https://drive.google.com/drive/folders/1pdM3kKIuByT-9BEKQoWj5gdp_pQBkr7B";

  // useEffect(() => {
  //   console.log("hr201: ", hr201);
  // }, [hr201]);

  // if (loading) {
  //   return null;
  // }

  return (
    <div className="px-5 pb-10">
      <div className="justify-end items-center flex mb-4">
        <EditDocuUrlDialog
          isNew={!hr201?.hr201_url}
          trigger={
            <Button
              variant="ghost"
              className="cursor-pointer !text-sm !text-[#008080] hover:!bg-[#0080801a] border-none flex items-center gap-1"
            >
              <PencilIcon className="h-3 w-3" />
              <span className=" hidden sm:inline text-xs">
                {hr201?.hr201_url
                  ? "Edit Drive Folder Link"
                  : "Set up Drive Folder Link"}
              </span>
            </Button>
          }
          refetch={refetch}
        />
      </div>

      <div className="p-5 border-1 border-gray-200 rounded-lg">
        <div className="justify-between items-center flex mb-4">
          <div className="flex rounded-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isListViewOptionClicked ? (
                    <Button
                      asChild
                      variant="ghost"
                      className="cursor-pointer !text-xs !text-[#008080] hover:!bg-[#0080801a] border-none"
                    >
                      <QueueListIcon />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="ghost"
                      className="cursor-pointer !text-xs !text-[#008080] hover:!bg-[#0080801a] border-none"
                      onClick={() => {
                        setIsListViewOptionClicked(true);
                        setIsGridViewOptionClicked(false);
                      }}
                    >
                      <QueueListIconOutline />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>List View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isGridViewOptionClicked ? (
                    <Button
                      asChild
                      variant="ghost"
                      className="cursor-pointer !text-xs !text-[#008080] hover:!bg-[#0080801a] border-none"
                    >
                      <Squares2X2Icon />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="ghost"
                      className="cursor-pointer !text-xs !text-[#008080] hover:!bg-[#0080801a] border-none"
                      onClick={() => {
                        setIsGridViewOptionClicked(true);
                        setIsListViewOptionClicked(false);
                      }}
                    >
                      <Squares2X2IconOutline />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            asChild
            variant="ghost"
            className={`!text-xs !text-[#008080] border-none select-none ${
              !hr201?.hr201_url
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:!bg-[#0080801a]"
            }`}
            disabled={!hr201?.hr201_url} // this disables Button if empty
          >
            {hr201?.hr201_url ? (
              <a
                href={hr201.hr201_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="hidden md:block">Open in Google Drive</span>
                <ArrowTopRightOnSquareIcon />
              </a>
            ) : (
              <div className="flex">
                <span className="hidden md:block">Open in Google Drive</span>
                <ArrowTopRightOnSquareIcon />
              </div>
            )}
          </Button>
        </div>
        <DriveFolderEmbed
          folderLink={hr201?.hr201_url}
          isGrid={isGridViewOptionClicked}
        />
      </div>
    </div>
  );
};

export default EmployeeDocumentsTab;
