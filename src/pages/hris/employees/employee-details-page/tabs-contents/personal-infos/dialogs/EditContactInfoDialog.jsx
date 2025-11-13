import CustomDialog from "@/components/dialog/CustomDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";

import { useState, useContext, useEffect } from "react";
import TextField from "@/components/forms/fields/TextField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeContactInfoFormSchema,
  employeeFormSchema,
} from "@/components/forms/schemas/employeeSchema";
import DropdownField from "@/components/forms/fields/DropdownField";
import DatepickerField from "@/components/forms/fields/DatePickerField";
import { useEditEmployeeContactInfoAPI } from "@/hooks/useEmployeeAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { glassToast } from "@/components/ui/glass-toast";
import { useEditEmployeePersonalDetailsSuiteliferAPI } from "@/hooks/suitelifer/useEditEmployeePersonalDetailsSuiteliferAPI";

const EditContactInfoDialog = ({ trigger, refetch }) => {
  const [open, setOpen] = useState(false);
  const { personalInfo, user } = useContext(EmployeeDetailsContext);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const { editEmployeeContactInfo, loading, error } =
    useEditEmployeeContactInfoAPI();

  const { editEmployeePersonalDetailsSuitelifer } =
    useEditEmployeePersonalDetailsSuiteliferAPI();

  const form = useForm({
    resolver: zodResolver(employeeContactInfoFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      workEmail: "",
      personalEmail: "",
      phoneNumber: "",
      companyIssuedPhoneNumber: "",
    },
  });

  useEffect(() => {
    if (personalInfo && user) {
      form.setValue("workEmail", user.user_email || "");
      form.setValue("personalEmail", personalInfo.personal_email || "");
      form.setValue("phoneNumber", personalInfo.contact_number || "");
      form.setValue(
        "companyIssuedPhoneNumber",
        personalInfo.company_issued_phone_number || ""
      );
    }
  }, [personalInfo, user, form]);

  const onSaveChanges = async (data) => {
    const user_id = user?.user_id;
    if (!user_id) return alert("User ID not found.");

    try {
      console.log("user_id: ", user_id);
      console.log("Contact Info data (raw): ", data);

      const normalize = (value) => {
        if (value === undefined || value === null) return null;
        if (typeof value === "string") {
          return value.trim().toLowerCase();
        }
        return value;
      };

      const cleanValue = (value) => {
        if (value === undefined || value === null) return null;
        if (typeof value === "string" && value.trim() === "") return null;
        return value;
      };

      const changedFields = {};

      const fieldMap = {
        user_email: data.workEmail,
        personal_email: data.personalEmail,
        contact_number: data.phoneNumber,
        company_issued_phone_number: data.companyIssuedPhoneNumber,
      };

      Object.entries(fieldMap).forEach(([key, value]) => {
        const cleaned = cleanValue(value);

        const current =
          key === "user_email"
            ? user?.[key] ?? null
            : personalInfo?.[key] ?? null;

        if (normalize(cleaned) !== normalize(current)) {
          changedFields[key] = cleaned;
        }
      });

      console.log("Changed fields only: ", changedFields);

      if (Object.keys(changedFields).length === 0) {
        glassToast({
          message: `No changes in Contact Info.`,
          icon: <InformationCircleIcon className="text-gray-500 w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 3000,
        });
        setOpen(false);
        setConfirmSubmitOpen(false);
        form.reset(personalInfo);
        return;
      }
      const updatedUserInfo = await editEmployeeContactInfo(
        user_id,
        changedFields
      );
      await editEmployeePersonalDetailsSuitelifer(user_id, changedFields);
      console.log("Updated Contact Info:", updatedUserInfo);
      setOpen(false);
      setConfirmSubmitOpen(false);
      if (refetch) {
        await refetch();
      }
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Contact Info</span> updated
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    } catch (err) {
      console.log("EROOOOR:", err);
      glassToast({
        message: `Failed to update Contact Info. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const confirmCancel = () => {
    setConfirmCancelOpen(false);
    setOpen(false);
    form.reset(personalInfo);
  };

  return (
    <div>
      <CustomDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            const formValues = form.getValues();

            const normalize = (value) => {
              if (value === undefined || value === null) return "";
              if (typeof value === "string") return value.trim().toLowerCase();
              return String(value).toLowerCase();
            };

            const fieldMap = {
              user_email: formValues.workEmail,
              personal_email: formValues.personalEmail,
              contact_number: formValues.phoneNumber,
              company_issued_phone_number: formValues.companyIssuedPhoneNumber,
            };

            let hasChanges = false;

            Object.entries(fieldMap).forEach(([key, value]) => {
              const current =
                key === "user_email"
                  ? user?.[key] ?? ""
                  : personalInfo?.[key] ?? "";

              if (normalize(value) !== normalize(current)) {
                hasChanges = true;
              }
            });

            if (hasChanges) {
              setConfirmCancelOpen(true);
            } else {
              setOpen(false);
              form.reset({
                workEmail: user?.user_email || "",
                personalEmail: personalInfo?.personal_email || "",
                phoneNumber: personalInfo?.contact_number || "",
                companyIssuedPhoneNumber:
                  personalInfo?.company_issued_phone_number || "",
              });
            }
          } else {
            setOpen(true);
          }
        }}
        trigger={trigger}
        title="Update Contact Info"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="workEmail"
              label="Work Email"
              control={form.control}
              type="email"
              placeholder="you@getfullsuite.com"
              required
            />
            <TextField
              name="personalEmail"
              label="Personal Email"
              control={form.control}
              type="email"
              placeholder="you@gmail.com"
              required
            />{" "}
            <TextField
              name="companyIssuedPhoneNumber"
              label="Company Issued Phone Number"
              control={form.control}
              type="tel"
              placeholder="09XXXXXXXXX"
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              control={form.control}
              type="tel"
              placeholder="09XXXXXXXXX"
              required
            />
          </div>
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

export default EditContactInfoDialog;
