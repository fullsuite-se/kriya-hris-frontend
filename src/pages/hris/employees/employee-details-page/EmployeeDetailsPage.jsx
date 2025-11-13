import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "@/context/HeaderContext";
import { useFetchEmployeeDetailsAPI } from "@/hooks/useEmployeeAPI";
import { useFetchIncompleteProfilesAPI } from "@/hooks/useAnalyticsAPI";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import PersonalInfoTab from "./tabs-contents/personal-infos/PersonalInfoTab";
import EmploymentInfoTab from "./tabs-contents/employment-infos/employmentInfoTab";
import EmployeeDocumentsTab from "./tabs-contents/documents/documentsTab";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import LoadingAnimation from "@/components/Loading";
import {
  ChevronRightIcon,
  IdentificationIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import BriefCaseIcon from "@/assets/icons/BriefcaseIcon";
import EmailIcon from "@/assets/icons/EmailIcon";
import TelephoneIcon from "@/assets/icons/PhoneIcon";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import CompletionDonut, {
  CompletionCircle2,
} from "./EmployeeDetailsPage-CompletionDonut";

const EmployeeDetailsPage = () => {
  const { setHeaderConfig } = useHeader();
  const { employee_id } = useParams();
  const navigate = useNavigate();

  useFetchEmployeeDetailsAPI(employee_id);

  const {
    data,
    loading: incompleteProfilesLoading,
    error,
    refetch,
  } = useFetchIncompleteProfilesAPI(employee_id);

  const userIncompleteArray = Array.isArray(data?.data) ? data.data : [];
  const userIncomplete = userIncompleteArray?.[0] ?? {};

  const {
    personalInfo,
    user,
    designations,
    employmentInfo,
    notFound,
    loading,
  } = useContext(EmployeeDetailsContext);

  const [showCompletionPanel, setShowCompletionPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isProfileComplete =
    !userIncomplete?.user_id ||
    !userIncomplete.missingFields ||
    userIncomplete.missingFields.length === 0;

  useEffect(() => {
    if (isProfileComplete) {
      setShowCompletionPanel(false);
    }
  }, [isProfileComplete]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const mainWidth = showCompletionPanel && !isMobile ? "w-3/4" : "w-full";
  const sideWidth = showCompletionPanel && !isMobile ? "w-1/4" : "w-0";

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
      content: <PersonalInfoTab refetch={refetch} />,
    },
    {
      value: "employment",
      label: "Employment",
      content: <EmploymentInfoTab refetch={refetch} />,
    },
    {
      value: "documents",
      label: "Documents",
      content: <EmployeeDocumentsTab refetch={refetch} />,
    },
  ];

  if (notFound) {
    navigate(-1);
    return null;
  }

  if (loading) {
    return <LoadingAnimation />;
  }

  const completionColor =
    userIncomplete.completionPercentage >= 80
      ? "#008080"
      : userIncomplete.completionPercentage >= 50
      ? "#f59e0b"
      : "#dc2626";

  const CompletionPanelContent = () => (
    <>
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center gap-2">
          <IdentificationIcon className="w-5 h-5 text-primary-color" />
          <h3 className="font-semibold text-gray-800 text-sm">
            Profile Completion
          </h3>
        </div>
        <XMarkIcon
          className="w-4 h-4 text-gray-700 hover:text-[#008080] cursor-pointer"
          onClick={() => setShowCompletionPanel(false)}
        />
      </div>

      <CompletionDonut
        userIncomplete={userIncomplete}
        completionColor={completionColor}
      />

      <div className="space-y-4 text-xs text-gray-700">
        <div>
          <p className=" uppercase text-gray-400 text-[10px] mb-1">
            PERSONAL INFO
          </p>
          <ul className="space-y-1">
            {[
              "personal_email",
              "contact_number",
              "permanent_address",
              "current_address",
              "emergency_contact",
            ].map((field) => (
              <li key={field} className="flex items-center justify-between">
                <span className="capitalize">{field.replace(/_/g, " ")}</span>
                {userIncomplete.missingFields?.includes(field) ? (
                  <CheckCircleIcon className="w-4 h-4 text-gray-200" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4 text-[#008080]" />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className=" uppercase text-gray-400 text-[10px] mb-1">
            EMPLOYMENT
          </p>
          <ul className="space-y-1">
            {[
              "hr201_url",
              "base_pay",
              "employer",
              "office",
              "division",
              "department",
              "team",
            ].map((field) => (
              <li key={field} className="flex items-center justify-between">
                <span className="capitalize">{field.replace(/_/g, " ")}</span>
                {userIncomplete.missingFields?.includes(field) ? (
                  <CheckCircleIcon className="w-4 h-4 text-gray-200" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4 text-[#008080]" />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className=" uppercase text-gray-400 text-[10px] mb-1">
            REMITTANCES
          </p>
          <ul className="space-y-1">
            {[
              "TIN",
              "PHIC",
              "SSS",
              "HDMF",
              "UnionBank",
              ...(userIncomplete.allRequiredFields?.includes("PhilCare")
                ? ["PhilCare"]
                : []),
            ].map((field) => (
              <li key={field} className="flex items-center justify-between">
                <span className="capitalize">{field.replace(/_/g, " ")}</span>
                {userIncomplete.missingFields?.includes(field) ? (
                  <CheckCircleIcon className="w-4 h-4 text-gray-200" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4 text-[#008080]" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex gap-4 items-start">
      <div
        className={`${mainWidth} transition-all duration-300 bg-white shadow-xs rounded-lg p-5`}
      >
        {incompleteProfilesLoading ? (
          <div className="group ml-auto max-w-xs mb-6 rounded-lg flex items-center justify-between cursor-pointer transition-shadow duration-200 animate-pulse">
            {" "}
            <div className="flex items-center space-x-3">
              {" "}
              <div className="relative w-14 h-14 flex items-center justify-center">
                {" "}
                <svg className="w-full h-full -rotate-90">
                  {" "}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="20"
                    stroke="#d1d5db"
                    strokeWidth="4"
                    fill="none"
                  />{" "}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="20"
                    stroke="#9ca3af"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="100"
                    strokeDashoffset={50}
                    strokeLinecap="round"
                  />{" "}
                </svg>{" "}
                <span className="absolute text-[10px] font-semibold text-gray-500">
                  {" "}
                  %{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col space-y-1">
                {" "}
                <div className="text-sm font-medium w-30 rounded-full h-5 bg-gray-300"></div>{" "}
                <div className="text-sm font-medium w-40 rounded-full h-3 bg-gray-200"></div>{" "}
                <p className="text-xs text-gray-400"></p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="text-gray-400">
              {" "}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />{" "}
              </svg>{" "}
            </div>{" "}
          </div>
        ) : userIncomplete?.user_id &&
          !isProfileComplete &&
          !showCompletionPanel ? (
          <div
            className="group ml-auto max-w-xs bg-white mb-6 rounded-lg flex items-center justify-between cursor-pointer transition-shadow duration-200"
            onClick={() => setShowCompletionPanel(true)}
          >
            <div className="flex items-center space-x-3">
              <CompletionCircle2 user={userIncomplete} />

              <div className="flex flex-col">
                <p className="text-sm font-medium group-hover:text-[#008080] text-gray-800">
                  Profile Completion
                </p>
                <p className="text-xs text-gray-400">
                  {userIncomplete.missingFields?.length || 0} important detail
                  {userIncomplete.missingFields?.length > 1 ? "s" : ""} not yet
                  provided
                </p>
              </div>
            </div>
            <ChevronRightIcon className="text-gray-400 group-hover:text-[#008080] w-5 h-5" />
          </div>
        ) : null}

        {/* Rest of your content */}
        <div className="flex flex-wrap justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-6 sm:gap-10 items-center flex-1 min-w-[200px]">
            <div className="relative h-30 w-30 sm:h-40 sm:w-40 rounded-full border border-gray-300 bg-primary-color flex-shrink-0">
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
            </div>

            <div className="flex flex-col gap-4 min-w-[200px]">
              <div>
                <div className="flex items-center gap-1 text-primary-color font-bold text-sm">
                  <p>{user?.user_id}</p>
                </div>
                <h2 className="font-extrabold text-lg sm:text-2xl">
                  {personalInfo?.first_name} {personalInfo?.last_name}{" "}
                  {personalInfo?.extension_name}
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

          <div className="flex sm:flex-col items-end gap-2 sm:gap-1">
            {(() => {
              const status =
                employmentInfo?.HrisUserEmploymentStatus?.employment_status ||
                "---";
              const normalized = status.charAt(0).toLowerCase();
              const colorClass =
                normalized === "r"
                  ? "text-green-700 bg-green-700/10"
                  : normalized === "p"
                  ? "text-cyan-700 bg-cyan-700/10"
                  : normalized === "s"
                  ? "text-red-700 bg-red-700/10"
                  : "text-gray-700 bg-gray-700/10";
              return (
                <div
                  className={`p-3 rounded-sm min-w-[120px] h-fit text-center ${colorClass}`}
                >
                  <p className="text-xs font-semibold italic whitespace-nowrap">
                    {status.toUpperCase()}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        <DynamicTabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={(val) => setActiveTab(val)}
        />
      </div>

      {showCompletionPanel && !isProfileComplete && (
        <>
          {!isMobile ? (
            <div
              className={`${sideWidth} transition-all duration-300 bg-white shadow-xs rounded-lg p-5 self-start sticky top-0`}
            >
              <CompletionPanelContent />
            </div>
          ) : (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-5">
                  <CompletionPanelContent />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeDetailsPage;
