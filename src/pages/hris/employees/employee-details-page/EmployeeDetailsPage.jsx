import BriefCaseIcon from "@/assets/icons/BriefcaseIcon";
import EmailIcon from "@/assets/icons/EmailIcon";
import TelephoneIcon from "@/assets/icons/PhoneIcon";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import { useHeader } from "@/context/HeaderContext";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchEmployeeDetailsAPI } from "@/hooks/useEmployeeAPI";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import PersonalInfoTab from "./tabs-contents/personal-infos/PersonalInfoTab";
import EmploymentInfoTab from "./tabs-contents/employment-infos/employmentInfoTab";
import EmployeeDocumentsTab from "./tabs-contents/documents/documentsTab";
import EditEmploymentStatusDialog from "./tabs-contents/employment-infos/dialogs/EditEmploymentStatusDialog";
import { PencilIcon } from "lucide-react";
import LoadingAnimation from "@/components/Loading";

const EmployeeDetailsPage = () => {
  const { setHeaderConfig } = useHeader();
  const { employee_id } = useParams();
  const navigate = useNavigate();

  useFetchEmployeeDetailsAPI(employee_id);

  const {
    personalInfo,
    user,
    designations,
    employmentInfo,
    notFound,
    loading,
  } = useContext(EmployeeDetailsContext);

  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    document.title = personalInfo
      ? `${personalInfo.first_name} ${personalInfo.last_name} - Employee Details`
      : "Employee Details";
  }, [personalInfo]);

  useEffect(() => {
    setHeaderConfig({
      title: null,
      description: null,
      isHidden: false,
      backPath: "/hris/employees",
      backLabel: "Back to All Employees",
    });
  }, []);

  const [activeTab, setActiveTab] = useState("employment");

  const tabItems = [
    {
      value: "personal_info",
      label: "Personal Info",
      content: <PersonalInfoTab />,
    },
    {
      value: "employment",
      label: "Employment",
      content: <EmploymentInfoTab />,
    },
    {
      value: "documents",
      label: "Documents",
      content: <EmployeeDocumentsTab />,
    },
  ];

  if (notFound) {
    navigate(-1);
    return;
  }

  if (loading) {
    return (
      // <div className="flex items-center justify-center h-screen">
      //   <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
      // </div>
      <LoadingAnimation />
    );
  }

  return (
    <div ref={topRef} className="relative bg-white shadow-xs rounded-lg p-5">
      <div className="flex flex-wrap justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-6 sm:gap-10 items-center flex-1 min-w-[200px]">
          {/* <div className="h-30 w-30 sm:h-40 sm:w-40 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-primary-color flex-shrink-0">
            <span className="text-4xl sm:text-5xl font-bold text-white">
              {personalInfo?.first_name?.[0]}
              {personalInfo?.last_name?.[0]}
            </span>
          </div> */}

          <div className="relative h-30 w-30 sm:h-40 sm:w-40 rounded-full border-2 border-gray-300  bg-primary-color flex-shrink-0">
            {personalInfo?.user_pic ? (
              <img
                src={personalInfo.user_pic}
                alt="User Profile"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white">
                {personalInfo?.first_name?.[0]?.toUpperCase()}
                {personalInfo?.last_name?.[0]?.toUpperCase()}
              </span>
            )}
            {/* <div className="absolute bottom-1 right-1 sm:bottom-3 sm:right-3 bg-white p-1 rounded-full shadow-md">
              <PencilIcon className="w-4 h-4 text-[#008080]" />
            </div> */}
          </div>

          <div className="flex flex-col gap-4 min-w-[200px]">
            <div>
              <div className="flex items-center gap-1 text-primary-color font-bold text-sm">
                {/* <HashIcon size={14} /> */}
                <p>{user?.user_id}</p>
              </div>
              <h2 className="font-extrabold text-lg sm:text-2xl">
                {personalInfo?.first_name} {personalInfo?.last_name} {personalInfo?.extension_name}
              </h2>
            </div>
            <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BriefCaseIcon size={16} />
                <p>{designations?.CompanyJobTitle?.job_title}</p>
              </div>
              <div className="flex items-center gap-2">
                <EmailIcon size={16} />

                <p>
                  {user?.user_email ? (
                    <a
                      href={`mailto:${user?.user_email}`}
                      className="underline break-words whitespace-normal"
                    >
                      {user?.user_email}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-semibold">---</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TelephoneIcon size={16} />
                <p>
                  {personalInfo?.contact_number ? (
                    <a
                      href={`tel:${personalInfo?.contact_number}`}
                      className="underline break-words whitespace-normal"
                    >
                      {personalInfo?.contact_number}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-semibold">---</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center gap-2 sm:gap-1">
          <div className="bg-[#0080802e] p-3 rounded-sm min-w-[120px] h-fit text-center">
            <p className="text-primary-color text-xs font-semibold italic whitespace-nowrap">
              {employmentInfo?.HrisUserEmploymentStatus?.employment_status?.toUpperCase()}
            </p>
          </div>

          <EditEmploymentStatusDialog
            trigger={
              <p className="cursor-pointer select-none hover:text-[#008080cf]   text-[#008080] text-xs mt-1 no-underline">
                Change Status
              </p>
            }
          />
        </div>
      </div>

      <DynamicTabs
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={(val) => setActiveTab(val)}
      />
    </div>
  );
};

export default EmployeeDetailsPage;
