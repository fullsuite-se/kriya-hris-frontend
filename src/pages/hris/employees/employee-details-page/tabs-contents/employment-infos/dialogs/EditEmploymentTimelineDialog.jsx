import CustomDialog from "@/components/dialog/CustomDialog";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";

import { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatepickerField from "@/components/forms/fields/DatePickerField";
import { employeeTimelineFormSchema } from "@/components/forms/schemas/employeeSchema";
import { useEditEmployeeTimelineAPI } from "@/hooks/useEmployeeAPI";
import { glassToast } from "@/components/ui/glass-toast";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { sanitizeData } from "@/utils/parsers/sanitizeData";
import { toYMDLocal } from "@/utils/formatters/dateFormatter";

const EditEmploymentTimelineDialog = ({ trigger, refetch }) => {
  const [open, setOpen] = useState(false);
  const { user, employmentInfo } = useContext(EmployeeDetailsContext);

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const { editEmployeeTimeline, loading, error } = useEditEmployeeTimelineAPI();

  const form = useForm({
    resolver: zodResolver(employeeTimelineFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      date_hired: undefined,
      date_regularization: undefined,
      date_offboarding: undefined,
      date_separated: undefined,
    },
  });

  useEffect(() => {
    if (employmentInfo && user) {
      form.reset(
        {
          date_hired: employmentInfo?.date_hired
            ? new Date(employmentInfo.date_hired)
            : null,
          date_regularization: employmentInfo?.date_regularization
            ? new Date(employmentInfo.date_regularization)
            : null,
          date_offboarding: employmentInfo?.date_offboarding
            ? new Date(employmentInfo.date_offboarding)
            : null,
          date_separated: employmentInfo?.date_separated
            ? new Date(employmentInfo.date_separated)
            : null,
        },
        { keepDirty: false }
      );
    }
  }, [employmentInfo, user, form]);

  const onSaveChanges = async (data) => {
    const user_id = user?.user_id;
    if (!user_id) return alert("User ID not found.");

    try {
      console.log("user_id: ", user_id);

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
        date_hired: toYMDLocal(data?.date_hired),
        date_regularization: toYMDLocal(data?.date_regularization),
        date_offboarding: toYMDLocal(data?.date_offboarding),
        date_separated: toYMDLocal(data?.date_separated),
      };

      Object.entries(fieldMap).forEach(([key, value]) => {
        const cleaned = cleanValue(value);
        const current = employmentInfo?.[key] ?? null;
        if (normalize(cleaned) !== normalize(current)) {
          changedFields[key] = cleaned;
        }
      });

      console.log("Changed fields only: ", changedFields);

      if (Object.keys(changedFields).length === 0) {
        glassToast({
          message: `No changes in Employment Timeline.`,
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
      const cleanData = sanitizeData(fieldMap);
      const updatedEmploymentTimeline = await editEmployeeTimeline(
        user_id,
        cleanData
      );

      console.log("Updated Employment Timeline:", updatedEmploymentTimeline);
      setOpen(false);
      setConfirmSubmitOpen(false);
      if (refetch) {
        await refetch();
      }
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Employment Timeline</span>{" "}
            updated successfully!
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
        message: `Failed to update Employment Timeline. Please try again.`,
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
            if (form.formState.isDirty) {
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
        title="Update Employment Timeline"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
          <DatepickerField
            name="date_hired"
            label="Date Hired"
            control={form.control}
            required
          />
          <DatepickerField
            name="date_regularization"
            label="Date Regularized"
            control={form.control}
            allowAllDates
          />
          <DatepickerField
            name="date_offboarding"
            label="Date Offboarded"
            control={form.control}
            allowAllDates
          />
          <DatepickerField
            name="date_separated"
            label="Date Separated"
            control={form.control}
            allowAllDates
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

export default EditEmploymentTimelineDialog;
