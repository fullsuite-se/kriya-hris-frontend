import CustomDialog from "@/components/dialog/CustomDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";

import { useState, useContext, useEffect } from "react";
import TextField from "@/components/forms/fields/TextField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DropdownField from "@/components/forms/fields/DropdownField";
import DatepickerField from "@/components/forms/fields/DatePickerField";
import { employeePersonalDetailsFormSchema } from "@/components/forms/schemas/employeeSchema";
import { useEditEmployeePersonalDetailsAPI } from "@/hooks/useEmployeeAPI";
import { glassToast } from "@/components/ui/glass-toast";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { sanitizeData } from "@/utils/parsers/sanitizeData";
import { toYMDLocal } from "@/utils/formatters/dateFormatter";

const EditPersonalDetailsDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const { personalInfo, user } = useContext(EmployeeDetailsContext);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const { editEmployeePersonalDetails, loading, error } =
    useEditEmployeePersonalDetailsAPI();

  const form = useForm({
    resolver: zodResolver(employeePersonalDetailsFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      nickname: "",
      extensionName: "",
      sex: "",
      gender: null,
      birthdate: null,
      birthplace: "",
      nationality: "",
      civilStatus: "",
      heightCm: 0,
      weightKg: 0,
      bloodType: "",
    },
  });

  useEffect(() => {
    if (personalInfo) {
      console.log(" personalInfo.birthdate: ", personalInfo.birthdate);
      form.reset({
        firstName: personalInfo.first_name || "",
        middleName: personalInfo.middle_name || "",
        lastName: personalInfo.last_name || "",
        nickname: personalInfo.nickname || "",
        extensionName: personalInfo.extension_name || "",
        sex: personalInfo.sex || "",
        gender: personalInfo.gender || "",
        birthdate: personalInfo.birthdate
          ? new Date(personalInfo.birthdate)
          : null,
        birthplace: personalInfo.birth_place || "",
        nationality: personalInfo.nationality || "",
        civilStatus: personalInfo.civil_status || "",
        heightCm: personalInfo.height_cm || 0,
        weightKg: personalInfo.weight_kg || 0,
        bloodType: personalInfo.blood_type || "",
      });
    }
  }, [personalInfo, form]);

  const onSaveChanges = async (data) => {
    const user_id = user?.user_id;
    if (!user_id) return alert("User ID not found.");

    try {
      console.log("user_id: ", user_id);
      console.log("personal details data (raw): ", data);

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
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        nickname: data.nickname,
        extension_name: data.extensionName,
        sex: data.sex,
        gender: data.gender,
        birthdate: toYMDLocal(data?.birthdate),
        birth_place: data.birthplace,
        nationality: data.nationality,
        civil_status: data.civilStatus,
        height_cm: data.heightCm,
        weight_kg: data.weightKg,
        blood_type: data.bloodType,
      };

      Object.entries(fieldMap).forEach(([key, value]) => {
        const cleaned = cleanValue(value);
        const current = personalInfo?.[key] ?? null;

        if (normalize(cleaned) !== normalize(current)) {
          changedFields[key] = cleaned;
        }
      });

      console.log("Changed fields only: ", changedFields);

      if (Object.keys(changedFields).length === 0) {
        glassToast({
          message: `No changes in Personal Details.`,
          icon: <InformationCircleIcon className="text-gray-500 w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 3000,
        });
        setOpen(false);
        setConfirmSubmitOpen(false);
        form.reset();
        return;
      }
      const cleanData = sanitizeData(changedFields);
      const updatedUserInfo = await editEmployeePersonalDetails(
        user_id,
        cleanData
      );

      console.log("Updated Personal Details:", updatedUserInfo);
      setOpen(false);
      setConfirmSubmitOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Personal Details</span> updated
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
      glassToast({
        message: `Failed to update Personal Details. Please try again.`,
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
    form.reset();
  };
  return (
    <div>
      <CustomDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            const formValues = form.getValues();

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

            const fieldMap = {
              first_name: formValues.firstName,
              middle_name: formValues.middleName,
              last_name: formValues.lastName,
              nickname: formValues.nickname,
              extension_name: formValues.extensionName,
              sex: formValues.sex,
              gender: formValues.gender,
              birthdate: formValues.birthdate
                ? new Date(formValues.birthdate).toISOString().split("T")[0]
                : null,
              birth_place: formValues.birthplace,
              nationality: formValues.nationality,
              civil_status: formValues.civilStatus,
              height_cm: formValues.heightCm,
              weight_kg: formValues.weightKg,
              blood_type: formValues.bloodType,
            };

            let hasChanges = false;

            Object.entries(fieldMap).forEach(([key, value]) => {
              const cleaned = cleanValue(value);
              const current = personalInfo?.[key] ?? null;
              if (normalize(cleaned) !== normalize(current)) {
                hasChanges = true;
              }
            });

            if (hasChanges) {
              setConfirmCancelOpen(true);
            } else {
              setOpen(false);
              form.reset();
            }
          } else {
            setOpen(true);
          }
        }}
        trigger={trigger}
        title="Update Personal Details"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            name="firstName"
            label="First Name"
            control={form.control}
            required
          />
          <TextField
            name="middleName"
            label="Middle Name"
            control={form.control}
          />
          <TextField
            name="lastName"
            label="Last Name"
            control={form.control}
            required
          />
          <TextField
            name="extensionName"
            label="Extension Name (e.g. 'Jr.','II')"
            control={form.control}
          />
          <TextField name="nickname" label="Nickname" control={form.control} />
          <DropdownField
            name="sex"
            label="Sex"
            control={form.control}
            options={["Male", "Female"]}
            required
          />
          <DropdownField
            name="gender"
            label="Gender"
            control={form.control}
            options={[
              "Cisgender",
              "Transgender",
              "Non-binary",
              "Genderqueer",
              "Agender",
              "Genderfluid",
              "Intersex",
              "Bigender",
              "Pangender",
              "Gender non-conforming",
            ]}
          />
          <DropdownField
            name="civilStatus"
            label="Civil Status"
            control={form.control}
            options={[
              "Single",
              "Married",
              "Widowed",
              "Divorced",
              "Separated",
              "Civil Union",
            ]}
            required
          />
          <TextField
            name="heightCm"
            label="Height (CM)"
            type="number"
            min={0}
            control={form.control}
          />
          <TextField
            name="weightKg"
            label="Weight (KG)"
            type="number"
            min={0}
            control={form.control}
          />
          <DatepickerField
            name="birthdate"
            label="Birthdate"
            control={form.control}
            required
          />
          <TextField
            name="birthplace"
            label="Birthplace"
            control={form.control}
          />
          <TextField
            name="nationality"
            label="Nationality"
            control={form.control}
            required
          />
          <DropdownField
            name="bloodType"
            label="Blood Type"
            control={form.control}
            options={[
              "A",
              "A+",
              "A-",
              "B",
              "B+",
              "B-",
              "AB",
              "AB+",
              "AB-",
              "O",
              "O+",
              "O-",
              "Unknown",
            ]}
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

export default EditPersonalDetailsDialog;
