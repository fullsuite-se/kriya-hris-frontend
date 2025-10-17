import CustomDialog from "@/components/dialog/CustomDialog";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { glassToast } from "@/components/ui/glass-toast";
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { sanitizeData } from "@/utils/parsers/sanitizeData";
import  {
  useEditCompanyDetailsAPI,
} from "@/hooks/useCompanyAPI";
import TextField from "@/components/forms/fields/TextField";
import { companyFormSchema } from "@/components/forms/schemas/companySchema";
import { CompanyDetailsContext } from "@/context/CompanyDetailsContext";
import DropdownField from "@/components/forms/fields/DropdownField";

const EditCompanyProfileDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  const { editCompanyDetails, loading } = useEditCompanyDetailsAPI();
  

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

  const form = useForm({
    resolver: zodResolver(companyFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      company_name: "",
      company_trade_name: "",
      company_email: "",
      company_phone: "",
      company_brn: "",
      company_tin: "",
      business_type: "",
      industry_type: "",
      floor_bldg_street: "",
      barangay: "",
      city_municipality: "",
      province_region: "",
      country: "",
      postal_code: "",
    },
  });

  // Reset form with current company data when dialog opens or company data changes
  useEffect(() => {
    if (open) {
      form.reset({
        company_name: companyName || "",
        company_trade_name: companyTradeName || "",
        company_email: companyEmail || "",
        company_phone: companyPhone || "",
        company_brn: companyBrn || "",
        company_tin: companyTin || "",
        business_type: businessType || "",
        industry_type: industryType || "",
        floor_bldg_street: companyAddress?.floor_bldg_street || "",
        barangay: companyAddress?.barangay || "",
        city_municipality: companyAddress?.city_municipality || "",
        province_region: companyAddress?.province_region || "",
        country: companyAddress?.country || "",
        postal_code: companyAddress?.postal_code || "",
      });
    }
  }, [
    open, 
    companyName,
    companyTradeName,
    companyEmail,
    companyPhone,
    companyBrn,
    companyTin,
    businessType,
    industryType,
    companyAddress
  ]);

  const onSaveChanges = async (data) => {
    try {
      const normalize = (value) => {
        if (value === undefined || value === null) return null;
        if (typeof value === "string") return value.trim().toLowerCase();
        return value;
      };

      const cleanValue = (value) => {
        if (value === undefined || value === null) return null;
        if (typeof value === "string" && value.trim() === "") return null;
        return value;
      };

      const changedFields = {};
      const fieldMap = {
        company_name: companyName,
        company_trade_name: companyTradeName,
        company_email: companyEmail,
        company_phone: companyPhone,
        company_brn: companyBrn,
        company_tin: companyTin,
        business_type: businessType,
        industry_type: industryType,
      };

      Object.entries(fieldMap).forEach(([key, currentValue]) => {
        const cleaned = cleanValue(data[key]);
        if (normalize(cleaned) !== normalize(currentValue)) {
          changedFields[key] = cleaned;
        }
      });

      const addressFields = [
        "floor_bldg_street",
        "barangay",
        "city_municipality",
        "province_region",
        "country",
        "postal_code",
      ];
      addressFields.forEach((field) => {
        const cleaned = cleanValue(data[field]);
        const current = companyAddress?.[field] ?? null;

        if (normalize(cleaned) !== normalize(current)) {
          changedFields[field] = cleaned;
        }
      });

      if (Object.keys(changedFields).length === 0) {
        glassToast({
          message: `No changes in Company Profile.`,
          icon: <InformationCircleIcon className="text-gray-500 w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 3000,
        });
        setOpen(false);
        setConfirmSubmitOpen(false);
        return;
      }

      const cleanData = sanitizeData(changedFields);

      const updatedCompany = await editCompanyDetails(cleanData);



      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Company Profile</span> updated
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });

      setOpen(false);
      setConfirmSubmitOpen(false);
      console.log("Updated Company Profile:", updatedCompany);
    } catch (error) {
      glassToast({
        message: `Failed to update Company Profile. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      console.error("Failed to update Company Profile:", error);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      if (form.formState.isDirty) {
        setConfirmCancelOpen(true);
      } else {
        setOpen(false);
        form.reset();
      }
    } else {
      setOpen(true);
    }
  };

  const confirmCancel = () => {
    setConfirmCancelOpen(false);
    setOpen(false);
    form.reset();
  };

  return (
    <div>
      <CustomDialog
        open={open}
        onOpenChange={handleOpenChange}
        trigger={trigger}
        title="Update Company Profile"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
        loading={loading}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-full flex items-center gap-2 text-[#008080] text-xs font-semibold uppercase">
            <BuildingOffice2Icon className="h-4 w-4" />
            Company Identity
          </div>
          <TextField
            name="company_name"
            label="Company Name"
            control={form.control}
            required
          />
          <TextField
            name="company_trade_name"
            label="Trade Name"
            control={form.control}
            required
          />
          
          <div className="col-span-full flex items-center gap-2 text-[#008080] text-xs font-semibold uppercase mt-4">
            <EnvelopeIcon className="h-4 w-4" />
            Contact Information
          </div>
          <TextField
            type="email"
            name="company_email"
            label="Company Email"
            control={form.control}
            required
          />
          <TextField
            name="company_phone"
            label="Company Phone"
            control={form.control}
            required
          />
          
          <div className="col-span-full flex items-center gap-2 text-[#008080] text-xs font-semibold uppercase mt-4">
            <IdentificationIcon className="h-4 w-4" />
            Government Remittances
          </div>
          <TextField
            name="company_tin"
            label="TIN"
            control={form.control}
            required
          />
          <TextField
            name="company_brn"
            label="BIR Number"
            control={form.control}
            required
          />
          
          <div className="col-span-full flex items-center gap-2 text-[#008080] text-xs font-semibold uppercase mt-4">
            <BriefcaseIcon className="h-4 w-4" />
            Business Information
          </div>
          <DropdownField
            name="business_type"
            label="Business Type"
            control={form.control}
            options={[
              "SOLE PROPRIETORSHIP",
              "PARTNERSHIP",
              "CORPORATION",
              "ONE PERSON CORPORATION (OPC)",
            ]}
          />
          <TextField
            name="industry_type"
            label="Industry Type"
            control={form.control}
            required
          />
          
          <div className="col-span-full flex items-center gap-2 text-[#008080] text-xs font-semibold uppercase mt-4">
            <MapPinIcon className="h-4 w-4" />
            Company Address
          </div>
          <TextField
            name="floor_bldg_street"
            label="Building/House No., Street"
            control={form.control}
            required
          />
          <TextField
            name="barangay"
            label="Barangay"
            control={form.control}
            required
          />
          <TextField
            name="city_municipality"
            label="City/Municipality"
            control={form.control}
            required
          />
          <TextField
            name="province_region"
            label="Province"
            control={form.control}
            required
          />
          <TextField
            name="country"
            label="Country"
            control={form.control}
            required
          />
          <TextField
            name="postal_code"
            label="Postal Code"
            control={form.control}
            required
          />
        </div>
      </CustomDialog>
      
      <CustomDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        title="Discard Changes?"
        description="Are you sure you want to cancel? Any unsaved changes will be lost."
        confirmLabel="Yes, Discard"
        cancelLabel="Go Back"
        onConfirm={confirmCancel}
        isShownCloseButton={false}
        allowOutsideInteraction={true}
      />
      
      <CustomDialog
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        title="Save Changes?"
        description="Are you sure you want to save the changes you made?"
        confirmLabel="Yes, Save changes"
        cancelLabel="Go Back"
        loading={loading}
        onConfirm={form.handleSubmit(onSaveChanges)}
        onCancel={() => setConfirmSubmitOpen(false)}
        isShownCloseButton={false}
        allowOutsideInteraction={true}
      />
    </div>
  );
};

export default EditCompanyProfileDialog;