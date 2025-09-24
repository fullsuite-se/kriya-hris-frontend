import { Button } from "@/components/ui/button";
import useFetchCompanyDetailsAPI from "@/hooks/useCompanyAPI";
import { Separator } from "@/components/ui/separator";

// import { Edit3Icon } from "lucide-react";
import {
  PencilIcon,
  BuildingOffice2Icon,
  IdentificationIcon,
  MapPinIcon,
  BriefcaseIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditCompanyProfileDialog from "./dialogs/EditCompanyProfileDialog";
import { CompanyDetailsContext } from "@/context/CompanyDetailsContext";
import LoadingAnimation from "@/components/Loading";

export const CompanyProfileTab = () => {
  const  {loading, error} = useFetchCompanyDetailsAPI();
  const {
    companyEmail,
    companyId,
    industryId,
    industryType,
    businessType,
    companyBrn,
    companyInfoId,
    companyLogo,
    companyName,
    companyPhone,
    companyTin,
    companyTradeName,
    companyAddress,
  } = useContext(CompanyDetailsContext);
  const navigate = useNavigate();

  if (loading) {
     return (
       // <div className="flex items-center justify-center h-screen">
       //   <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
       // </div>
         <LoadingAnimation/>
     );
   }

  return (
    <div className="px-5 pb-10">
      <div className="justify-end items-center flex mb-4">
        <EditCompanyProfileDialog
          trigger={
            <Button
              variant="ghost"
              className="cursor-pointer !text-sm !text-[#008080] hover:!bg-[#0080801a] border-none flex items-center gap-1"
            >
              <PencilIcon className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">Edit</span>
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm p-10 border-1 border-gray-200 rounded-lg">
        {/*  Company Identity */}
        <div className="col-span-full flex items-center gap-2 text-[#008080]  text-xs font-semibold uppercase">
          <BuildingOffice2Icon className="h-4 w-4" />
          Company Identity
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Company Name</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyName || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Trade Name</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyTradeName || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        {/*  Contact Information */}
        <div className="col-span-full flex items-center gap-2 text-[#008080]  text-xs font-semibold uppercase mt-4">
          <EnvelopeIcon className="h-4 w-4" />
          Contact Information
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Company Email</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyEmail || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Company Phone</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyPhone || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        {/* Government Remittances */}
        <div className="col-span-full flex items-center gap-2 text-[#008080]  text-xs font-semibold uppercase mt-4">
          <IdentificationIcon className="h-4 w-4" />
          Government Remittances
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">TIN</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyTin || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">BIR Number</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyBrn || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        {/*  Business Info */}
        <div className="col-span-full flex items-center gap-2 text-[#008080]  text-xs font-semibold uppercase mt-4">
          <BriefcaseIcon className="h-4 w-4" />
          Business Information
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Business Type</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {businessType || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Industry Type</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {industryType || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        {/* <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Status</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyDetails.status || "---"}
          </p>
          <Separator className="my-2" />
        </div> */}

        {/*  Address */}
        <div className="col-span-full flex items-center gap-2 text-[#008080] text-xs font-semibold uppercase mt-4">
          <MapPinIcon className="h-4 w-4" />
          Company Address
        </div>

        <div className="flex flex-col gap-1 col-span-full">
          <p className="text-muted-foreground text-xs">Address</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {companyAddress?.floor_bldg_street}{" "}
            {companyAddress?.barangay},{" "}
            {companyAddress?.city_municipality},{" "}
            {companyAddress?.province_region},{" "}
            {companyAddress?.country}{" "}
            {companyAddress?.postal_code}
          </p>
          <Separator className="my-2" />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileTab;
