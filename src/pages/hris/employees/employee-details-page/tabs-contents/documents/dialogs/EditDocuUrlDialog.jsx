import CustomDialog from "@/components/dialog/CustomDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";

import { useState, useContext, useEffect } from "react";
import TextField from "@/components/forms/fields/TextField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeDocuURLFormSchema } from "@/components/forms/schemas/employeeSchema";
import DropdownField from "@/components/forms/fields/DropdownField";
import DatepickerField from "@/components/forms/fields/DatePickerField";
import { useEditEmployeeHr201urlAPI } from "@/hooks/useEmployeeAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { glassToast } from "@/components/ui/glass-toast";

const EditDocuUrlDialog = ({ trigger, isNew, refetch }) => {
  const [open, setOpen] = useState(false);
  const { personalInfo, user, hr201 } = useContext(EmployeeDetailsContext);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const { editEmployeeHr201url, loading, error } = useEditEmployeeHr201urlAPI();

  const form = useForm({
    resolver: zodResolver(employeeDocuURLFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      hr201_url: "",
    },
  });

  useEffect(() => {
    if (hr201 && user) {
      form.setValue("hr201_url", hr201.hr201_url || "");
    }
  }, [hr201, user, form]);

  const isEmpty = () => {
    const value = form.getValues("hr201_url");
    return !value || value.trim() === "";
  };

  const onSaveChanges = async (data) => {
    const user_id = user?.user_id;
    if (!user_id) return alert("User ID not found.");

    try {
      console.log("Raw HR201 URL data:", data);

      const normalize = (value) => {
        if (value === undefined || value === null) return null;
        if (typeof value === "string") return value.trim();
        return value;
      };

      const cleanValue = (value) => {
        if (value === undefined || value === null) return null;
        if (typeof value === "string" && value.trim() === "") return null;
        return value;
      };

      const changedFields = {};

      const fieldMap = {
        hr201_url: data.hr201_url,
      };

      Object.entries(fieldMap).forEach(([key, value]) => {
        const cleaned = cleanValue(value);
        const current = hr201?.[key] ?? null;

        if (normalize(cleaned) !== normalize(current)) {
          changedFields[key] = cleaned;
        }
      });

      console.log("Changed fields only:", changedFields);

      if (Object.keys(changedFields).length === 0) {
        glassToast({
          message: `No changes in HR201 URL.`,
          icon: <InformationCircleIcon className="text-gray-500 w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 3000,
        });
        setOpen(false);
        setConfirmSubmitOpen(false);
        form.reset(hr201_url);
        return;
      }

      console.log("Changed url:", changedFields);

      const updatedHr201 = await editEmployeeHr201url(user_id, changedFields);

      console.log("Updated HR201 URL:", updatedHr201);
      setOpen(false);
      setConfirmSubmitOpen(false);
      if (refetch) {
        await refetch();
      }
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Drive Folder Link</span>
            {isNew ? " set up successfully!" : " updated successfully!"}
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    } catch (err) {
      console.error("Error updating HR201 URL:", err);
      glassToast({
        message: `Failed to update Drive Folder Link. Please try again.`,
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
    form.reset(hr201);
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
              if (typeof value === "string") return value.trim();
              return String(value);
            };

            const currentValue = hr201?.hr201_url || "";
            if (
              normalize(formValues.hr201_url) !== normalize(currentValue) &&
              !isEmpty()
            ) {
              setConfirmCancelOpen(true);
            } else {
              setOpen(false);
              form.reset(hr201_url);
            }
          } else {
            setOpen(true);
          }
        }}
        trigger={trigger}
        title={isNew ? "Set up Drive Folder Link" : "Update Drive Folder Link"}
        width="md"
        height="full"
        confirmLabel={isNew ? "Save" : "Save Changes"}
        onConfirm={() => {
          if (isEmpty()) {
            setOpen(false);
            form.reset(hr201);
            glassToast({
              message: `No changes in HR201 URL.`,
              icon: <InformationCircleIcon className="text-gray-500 w-5 h-5" />,
              textColor: "black",
              bgColor: "rgba(255, 255, 255, 0.2)",
              blur: 12,
              duration: 3000,
            });
          } else {
            setConfirmSubmitOpen(true);
          }
        }}
      >
        <div>
          <TextField
            name="hr201_url"
            placeholder={"https://drive.google.com/..."}
            label="Document URL (Google Drive Folder Link)"
            type="url"
            control={form.control}
            required
          />
        </div>
      </CustomDialog>
      <CustomDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        title="Discard Changes?"
        description={
          isNew
            ? "Are you sure you want to cancel setting up the drive folder link?"
            : "Are you sure you want to cancel? Any unsaved changes will be lost."
        }
        confirmLabel="Yes, Discard"
        cancelLabel="Go Back"
        onConfirm={confirmCancel}
        isShownCloseButton={false}
        allowOutsideInteraction={true}
      />
      <CustomDialog
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        title={isNew ? "Set it up?" : "Save Changes?"}
        description={
          isNew
            ? "Are you sure you want to set up this Drive Folder link?"
            : "Are you sure you want to save the changes you made?"
        }
        confirmLabel={isNew ? "Yes, Set it up" : "Yes, Save changes"}
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

export default EditDocuUrlDialog;
