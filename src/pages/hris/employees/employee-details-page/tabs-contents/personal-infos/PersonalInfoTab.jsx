import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// import { Edit3Icon } from "lucide-react";
import {
  PencilIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  DocumentTextIcon,
  MapPinIcon,
  BriefcaseIcon,
  AdjustmentsVerticalIcon,
  UserIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";
import { use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import formatDate from "@/utils/formatters/dateFormatter";
import EditPersonalDetailsDialog from "./dialogs/EditPersonalDetailsDialog";
import EditAddressesDialog from "./dialogs/EditAddressesDialog";
import EditContactInfoDialog from "./dialogs/EditContactInfoDialog";
import EditGovernmentRemittancesDialog from "./dialogs/EditGovermentRemittancesDialog";
import EditEmergencyContactsDialog from "./dialogs/EditEmergencyContactsDialog";

export const PersonalInfoTab = () => {
 
  const {
    personalInfo,
    user,
    addresses,
    governmentIds,
    emergencyContacts,
    loading
  } = useContext(EmployeeDetailsContext);


  const getGovIdNumber = (type) => {
    return (
      governmentIds.find(
        (id) =>
          id?.HrisUserGovernmentIdType?.government_id_name?.toLowerCase() ===
          type.toLowerCase()
      )?.government_id_number || "---"
    );
  };

  if (loading) {
    return null;
  }

  return (
    <div className="px-5 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm p-10 border border-gray-200 rounded-lg">
        {/* personal details */}
        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 hidden sm:inline" />
            Personal Details
          </div>

          <EditPersonalDetailsDialog
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
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Full Name</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.first_name} {personalInfo?.middle_name}{" "}
            {personalInfo?.last_name} {personalInfo?.extension_name}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Nickname</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.nickname || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Sex</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.sex || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Gender</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.gender || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Birthdate</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {formatDate(personalInfo?.birthdate, "fullMonth") || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Age</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {formatDate(personalInfo?.birthdate, "age") || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Birthplace</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.birth_place || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Civil Status</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.civil_status || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Height(CM)</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.height_cm || "---"}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Weight(KG)</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.weight_kg || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Nationality</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.nationality || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Blood Type</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {personalInfo?.blood_type || "---"}
          </p>
          <Separator className="my-2" />
        </div>

        {/*  Addresses */}

        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 hidden sm:inline" />
            Addresses
          </div>

          <EditAddressesDialog
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
        {["PERMANENT", "CURRENT"].map((type) => {
          const address = addresses?.find((a) => a.address_type === type);

          const filledAddressParts = [
            address?.building_num,
            address?.street,
            address?.barangay,
            address?.city,
            address?.province,
            address?.region,
            address?.country,
            address?.postal_code,
          ].filter(Boolean);

          return (
            <div className="flex flex-col gap-1 col-span-full" key={type}>
              <p className="text-muted-foreground text-xs">
                {type === "PERMANENT" ? "Permanent Address" : "Current Address"}
              </p>

              <p className="text-gray-900 font-semibold break-words whitespace-normal">
                {filledAddressParts.length > 0
                  ? filledAddressParts.join(", ")
                  : "---"}
              </p>

              <Separator className="my-2" />
            </div>
          );
        })}

        {/* contact Information */}

        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-4 w-4 hidden sm:inline" />
            Contact Information
          </div>

          <EditContactInfoDialog
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

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Work Email</p>
          {user?.user_email ? (
            <a
              href={`mailto:${user.user_email}`}
              className="text-[#008080] font-semibold break-words whitespace-normal"
            >
              {user.user_email}
            </a>
          ) : (
            <span className="text-gray-900 font-semibold">---</span>
          )}
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Personal Email</p>
          {personalInfo?.personal_email ? (
            <a
              href={`mailto:${personalInfo.personal_email}`}
              className="text-[#008080] font-semibold break-words whitespace-normal"
            >
              {personalInfo.personal_email}
            </a>
          ) : (
            <span className="text-gray-900 font-semibold">---</span>
          )}
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">
            Company Issued Phone Number
          </p>
          {personalInfo?.company_issued_phone_number ? (
            <a
              href={`tel:${personalInfo.company_issued_phone_number}`}
              className="text-[#008080] font-semibold break-words whitespace-normal"
            >
              {personalInfo.company_issued_phone_number}
            </a>
          ) : (
            <span className="text-gray-900 font-semibold">---</span>
          )}
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Personal Phone Number</p>
          {personalInfo?.contact_number ? (
            <a
              href={`tel:${personalInfo.contact_number}`}
              className="text-[#008080] font-semibold break-words whitespace-normal"
            >
              {personalInfo.contact_number}
            </a>
          ) : (
            <span className="text-gray-900 font-semibold">---</span>
          )}
          <Separator className="my-2" />
        </div>

        {/* Government Remittances */}

        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase">
          <div className="flex items-center gap-2">
            <IdentificationIcon className="h-4 w-4 hidden sm:inline" />
            Government Remittances
          </div>

          <EditGovernmentRemittancesDialog
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

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">TIN</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {getGovIdNumber("TIN")}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">PHIC</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {getGovIdNumber("PHIC")}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">SSS</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {getGovIdNumber("SSS")}
          </p>
          <Separator className="my-2" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">HDMF</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {getGovIdNumber("HDMF")}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">UnionBank</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {getGovIdNumber("UnionBank")}
          </p>
          <Separator className="my-2" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">PhilCare</p>
          <p className="text-gray-900 font-semibold break-words whitespace-normal">
            {getGovIdNumber("PhilCare")}
          </p>
          <Separator className="my-2" />
        </div>

        {/* Emergency Contacts */}

        <div className="col-span-full flex justify-between items-center text-[#008080] text-xs font-semibold uppercase">
          <div className="flex items-center gap-2">
            <BellAlertIcon className="h-4 w-4 hidden sm:inline" />
            Emergency Contacts
          </div>

          <EditEmergencyContactsDialog
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

        {emergencyContacts?.length > 0 ? (
          emergencyContacts.map((contact, index) => {
            const { full_name, relationship, contact_number } = contact;

            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full col-span-full"
              >
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs">Full Name</p>
                  <p className="text-gray-900 font-semibold break-words whitespace-normal">
                    {full_name || "---"}
                  </p>
                  <Separator className="my-2" />
                </div>

                {/* Relationship */}
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs">Relationship</p>
                  <p className="text-gray-900 font-semibold break-words whitespace-normal">
                    {relationship || "---"}
                  </p>
                  <Separator className="my-2" />
                </div>

                {/* Contact Number */}
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs">
                    Contact Number
                  </p>
                  <p className="text-gray-900 font-semibold break-words whitespace-normal">
                    {contact_number ? (
                      <a
                        href={`tel:${contact_number}`}
                        className="text-[#008080] break-words whitespace-normal"
                      >
                        {contact_number}
                      </a>
                    ) : (
                      <span className="text-gray-900 font-semibold">---</span>
                    )}
                  </p>
                  <Separator className="my-2" />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-xs col-span-full">
            No emergency contacts added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoTab;
