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
import {
  employeeDesignationFormSchema,
  employeeSalaryFormSchema,
} from "@/components/forms/schemas/employeeSchema";
import { useEditEmployeeSalaryAPI } from "@/hooks/useEmployeeAPI";
import { glassToast } from "@/components/ui/glass-toast";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { sanitizeData } from "@/utils/parsers/sanitizeData";
import OfficeSearchCombobox from "@/components/forms/fields/dynamic-fields/OfficeSearchCombobox";
import DepartmentSearchCombobox from "@/components/forms/fields/dynamic-fields/DepartmentSearchCombobox";
import DivisionSearchCombobox from "@/components/forms/fields/dynamic-fields/DivisionSearchCombobox";
import TeamSearchCombobox from "@/components/forms/fields/dynamic-fields/TeamSearchCombobox";
import JobPositionSearchCombobox from "@/components/forms/fields/dynamic-fields/JobPositionSearchCombobox";
import EmploymentStatusSearchCombobox from "@/components/forms/fields/dynamic-fields/EmploymentStatusSearchCombobox";
import JobLevelSearchCombobox from "@/components/forms/fields/dynamic-fields/JobLevelSearchCombobox";
import EmployeeTypeSearchCombobox from "@/components/forms/fields/dynamic-fields/EmployeeTypeSearchCombobox copy";
import ShiftTemplateSearchCombobox from "@/components/forms/fields/dynamic-fields/ShiftTemplateSearchCombobox";
import EmployeeSearchCombobox from "@/components/forms/fields/dynamic-fields/EmployeeSearchCombobox";
import SalaryTypeSearchCombobox from "@/components/forms/fields/dynamic-fields/SalaryTypeSearchCombobox";

const EditSalaryDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const { designations, user, salaryInfo, employmentInfo } = useContext(
    EmployeeDetailsContext
  );

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const { editEmployeeSalary, loading, error } = useEditEmployeeSalaryAPI();

  const form = useForm({
    resolver: zodResolver(employeeSalaryFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      base_pay: 0,
      salary_adjustment_type_id: "",
      date: new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
      ),
    },
  });

  useEffect(() => {
    if (salaryInfo && user) {
      form.reset(
        {
          base_pay: salaryInfo?.base_pay ? Number(salaryInfo.base_pay) : 0,
          salary_adjustment_type_id:
            salaryInfo?.salary_adjustment_type_id || "",
          date: new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
          ),
        },
        { keepDirty: false }
      );
    }
  }, [salaryInfo, user, form]);

  const onSaveChanges = async (data) => {
    console.log("Starting onSaveChanges", { data });

    const user_id = user?.user_id;
    const user_salary_id = salaryInfo?.user_salary_id;
    console.log("Retrieved user_id and user_salary_id", {
      user_id,
      user_salary_id,
    });

    if (!user_id || !user_salary_id) {
      console.log("Missing user_id or user_salary_id");
      return;
    }

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

      const payload = {
        base_pay: cleanValue(data.base_pay),
        salary_adjustment_type_id: cleanValue(data.salary_adjustment_type_id),
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : null,
      };

      const changedFields = {};
      Object.entries(payload).forEach(([key, value]) => {
        const current = salaryInfo?.[key] ?? null;
        if (normalize(value) !== normalize(current)) {
          changedFields[key] = value;
        }
      });

      console.log("Changed fields only:", changedFields);

      if (Object.keys(changedFields).length === 0) {
        glassToast({
          message: `No changes in Salary.`,
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

      console.log("Payload to be sent:", payload);

      const updatedSalary = await editEmployeeSalary(
        user_id,
        user_salary_id,
        payload
      );

      console.log("Updated Salary Details:", updatedSalary);

      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Salary</span> updated
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
      form.reset();
    } catch (err) {
      console.error("Failed to update:", err);
      console.log("Error details", { error: err.message, stack: err.stack });

      glassToast({
        message: `Failed to update Salary. Please try again.`,
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
        title="Update Salary"
        width="md"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            name="base_pay"
            label="Salary Base Pay"
            type="number"
            min={0}
            control={form.control}
          />
          <SalaryTypeSearchCombobox
            name="salary_adjustment_type_id"
            control={form.control}
            initialValue={salaryInfo?.salary_adjustment_type_id}
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

export default EditSalaryDialog;
