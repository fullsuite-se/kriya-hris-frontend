import BriefCaseIcon from "@/assets/icons/BriefcaseIcon";
import EmailIcon from "@/assets/icons/EmailIcon";
import TelephoneIcon from "@/assets/icons/PhoneIcon";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import { useHeader } from "@/context/HeaderContext";
import { useFetchCompanyDetailsAPI } from "@/hooks/useCompanyAPI";
import React, { useContext, useEffect } from "react";
import CompanyProfileTab from "./tabs-contents/company-profile/CompanyProfileTab";
import OfficesTab from "./tabs-contents/OfficesTab";
import DivisionsTab from "./tabs-contents/divisionsTab";
import DepartmentsTab from "./tabs-contents/departmentsTab";
import TeamsTab from "./tabs-contents/TeamsTab";
import { CompanyDetailsContext } from "@/context/CompanyDetailsContext";
import { Skeleton } from "@/components/ui/skeleton"; // <-- import Skeleton
import CompanyEmployersTab from "./tabs-contents/CompanyEmployersTab";

const CompanyInfoPage = () => {
  const { setHeaderConfig } = useHeader();
  const { loading, error } = useFetchCompanyDetailsAPI();
  const {
    companyEmail,
    companyLogo,
    companyName,
    companyPhone,
    companyTradeName,
  } = useContext(CompanyDetailsContext);

  useEffect(() => {
    setHeaderConfig({ title: null, description: null });
  }, []);

  useEffect(() => {
    document.title = "About Company";
  }, []);

  const tabItems = [
    { value: "profile", label: "Profile", content: <CompanyProfileTab /> },
    { value: "employer", label: "Employers", content: <CompanyEmployersTab /> },
    { value: "offices", label: "Offices", content: <OfficesTab /> },
    { value: "divisions", label: "Divisions", content: <DivisionsTab /> },
    { value: "departments", label: "Departments", content: <DepartmentsTab /> },
    { value: "teams", label: "Teams", content: <TeamsTab /> },
  ];

  if (loading) {
    return (
      <div className="relative bg-white shadow-xs rounded-lg p-5 animate-in fade-in duration-200">
        <div className="flex flex-wrap gap-6 sm:gap-10 items-center mb-10">
          <Skeleton className="h-30 w-30 sm:h-40 sm:w-40 rounded-full flex-shrink-0" />

          <div className="flex flex-col gap-4 flex-1">
            <Skeleton className="h-6 sm:h-8 w-40 sm:w-60" />
            <div className="flex flex-col gap-2 text-xs sm:text-sm">
              <Skeleton className="h-4 w-56 sm:w-72" />
              <Skeleton className="h-4 w-48 sm:w-64" />
              <Skeleton className="h-4 w-32 sm:w-40" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-5 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-10 sm:w-28 rounded-md" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-20">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }

  return (
    <div className="relative bg-white shadow-xs rounded-lg p-5">
      <div className="flex flex-wrap gap-6 sm:gap-10 items-center mb-10">
        <div>
          <div className="h-30 w-30 sm:h-40 sm:w-40 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-primary-color flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyTradeName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl sm:text-5xl font-bold text-white">
                {companyTradeName?.[0]}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-extrabold text-lg sm:text-2xl">
            {companyTradeName}
          </h2>
          <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
            <div className="flex flex-row gap-2 items-center">
              <BriefCaseIcon size={16} />
              <p>{companyName}</p>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon size={16} />
              <p>
                {companyEmail ? (
                  <a
                    href={`mailto:${companyEmail}`}
                    className="underline break-words whitespace-normal"
                  >
                    {companyEmail}
                  </a>
                ) : (
                  <span className="text-gray-900 font-semibold">---</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TelephoneIcon size={16} />
              <p>
                {companyPhone ? (
                  <a
                    href={`tel:${companyPhone}`}
                    className="underline break-words whitespace-normal"
                  >
                    {companyPhone}
                  </a>
                ) : (
                  <span className="text-gray-900 font-semibold">---</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DynamicTabs tabs={tabItems} />
    </div>
  );
};

export default CompanyInfoPage;
