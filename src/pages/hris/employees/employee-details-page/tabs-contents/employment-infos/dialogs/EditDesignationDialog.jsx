import CustomDialog from "@/components/dialog/CustomDialog";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeDesignationFormSchema } from "@/components/forms/schemas/employeeSchema";
import { useEditEmployeeDesignationAPI } from "@/hooks/useEmployeeAPI";
import { glassToast } from "@/components/ui/glass-toast";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import OfficeSearchComboBox from "@/components/forms/fields/dynamic-fields/OfficeSearchComboBox";
import DepartmentSearchComboBox from "@/components/forms/fields/dynamic-fields/DepartmentSearchComboBox";
import DivisionSearchComboBox from "@/components/forms/fields/dynamic-fields/DivisionSearchComboBox";
import TeamSearchComboBox from "@/components/forms/fields/dynamic-fields/TeamSearchComboBox";
import JobPositionSearchComboBox from "@/components/forms/fields/dynamic-fields/JobPositionSearchComboBox";
import EmploymentStatusSearchComboBox from "@/components/forms/fields/dynamic-fields/EmploymentStatusSearchComboBox";
import JobLevelSearchComboBox from "@/components/forms/fields/dynamic-fields/JobLevelSearchComboBox";
import EmployeeTypeSearchComboBox from "@/components/forms/fields/dynamic-fields/EmployeeTypeSearchComboBox";
import ShiftTemplateSearchComboBox from "@/components/forms/fields/dynamic-fields/ShiftTemplateSearchComboBox";
import EmployeeSearchComboBox from "@/components/forms/fields/dynamic-fields/EmployeeSearchComboBox";
import CompanyEmployerSearchComboBox from "@/components/forms/fields/dynamic-fields/CompanyEmployerSearchComboBox";

const EditDesignationDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const { designations, user, employmentInfo } = useContext(
    EmployeeDetailsContext
  );

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const { editEmployeeDesignation, loading, error } =
    useEditEmployeeDesignationAPI();
  const form = useForm({
    resolver: zodResolver(employeeDesignationFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      company_employer: "",
      office: "",
      division: "",
      department: "",
      team: "",
      jobTitle: "",
      employmentStatus: "",
      jobLevel: "",
      employeeType: "",
      shift: "",
      supervisor: "",
    },
  });

  useEffect(() => {
    if (
      designations &&
      Object.keys(designations).length > 0 &&
      employmentInfo &&
      Object.keys(employmentInfo).length > 0 &&
      user
    ) {
      console.log("Resetting form with initial values", {
        designations,
        employmentInfo,
      });
      form.reset(
        {
          company_employer: designations?.company_employer_id || "",
          office: designations?.office_id || "",
          division: designations?.division_id || "",
          department: designations?.department_id || "",
          team: designations?.team_id || "",
          jobTitle: designations?.job_title_id || "",
          employmentStatus: employmentInfo?.employment_status_id || "",
          jobLevel: employmentInfo?.job_level_id || "",
          employeeType: employmentInfo?.employment_type_id || "",
          shift: employmentInfo?.shift_template_id || "",
          supervisor: designations?.upline_id || "",
        },
        { keepDirty: false }
      );
    }
  }, [designations, employmentInfo, user, form]);

  const onSaveChanges = async (data) => {
    console.log("Starting onSaveChanges", { data });
    const user_id = user?.user_id;
    console.log("Retrieved user_id", { user_id });

    if (!user_id) {
      console.log("User ID not found");
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

      const fieldMap = {
        company_employer_id: data.company_employer,
        office_id: data.office,
        division_id: data.division,
        department_id: data.department,
        team_id: data.team,
        job_title_id: data.jobTitle,
        upline_id: data.supervisor,
        employment_status_id: data.employmentStatus,
        job_level_id: data.jobLevel,
        employment_type_id: data.employeeType,
        shift_template_id: data.shift,
      };

      const designationFields = {};
      const employmentFields = {};
      Object.entries(fieldMap).forEach(([key, value]) => {
        const cleaned = cleanValue(value);
        let current = null;

        if (designations && designations[key] !== undefined) {
          current = designations[key];
        } else if (employmentInfo && employmentInfo[key] !== undefined) {
          current = employmentInfo[key];
        }

        if (normalize(cleaned) !== normalize(current)) {
          if (
            [
              "company_employer_id",
              "office_id",
              "division_id",
              "department_id",
              "team_id",
              "job_title_id",
              "upline_id",
            ].includes(key)
          ) {
            designationFields[key] = cleaned;
          } else {
            employmentFields[key] = cleaned;
          }
        }
      });
      console.log("Changed fields calculated", {
        designationFields,
        employmentFields,
      });

      if (
        Object.keys(designationFields).length === 0 &&
        Object.keys(employmentFields).length === 0
      ) {
        glassToast({
          message: `No changes in Designation.`,
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

      console.log("Calling editEmployeeDesignation with", {
        user_id,
        designation: { designationFields, employmentFields },
      });
      const updatedInfo = await editEmployeeDesignation(user_id, {
        designationFields,
        employmentFields,
      });
      console.log("Received updated info", { updatedInfo });

      console.log("Current designations state after update", { designations });

      form.reset(
        {
          company_employer: updatedInfo.designation?.company_employer_id || "",
          office: updatedInfo.designation?.office_id || "",
          division: updatedInfo.designation?.division_id || "",
          department: updatedInfo.designation?.department_id || "",
          team: updatedInfo.designation?.team_id || "",
          jobTitle: updatedInfo.designation?.job_title_id || "",
          employmentStatus: updatedInfo.employment?.employment_status_id || "",
          jobLevel: updatedInfo.employment?.job_level_id || "",
          employeeType: updatedInfo.employment?.employment_type_id || "",
          shift: updatedInfo.employment?.shift_template_id || "",
          supervisor: updatedInfo.designation?.upline_id || "",
        },
        { keepDirty: false }
      );

      setOpen(false);
      setConfirmSubmitOpen(false);

      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Designation</span> updated
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
      console.error("Failed to update:", err);
      console.log("Error details", { error: err.message, stack: err.stack });
      console.log("Showing error toast");
      glassToast({
        message: `Failed to update Designation. Please try again.`,
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
        title="Update Designation"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CompanyEmployerSearchComboBox
            name="company_employer"
            control={form.control}
          />
          <OfficeSearchComboBox name="office" control={form.control} />
          <DivisionSearchComboBox
            name="division"
            control={form.control}
          />
          <DepartmentSearchComboBox name="department" control={form.control} />
          <TeamSearchComboBox
            name="team"
            control={form.control}
          />
          <JobPositionSearchComboBox
            name="jobTitle"
            control={form.control}
            required
          />
          <EmploymentStatusSearchComboBox
            name="employmentStatus"
            control={form.control}
            initialValue={employmentInfo?.employment_status_id}
            required
          />
          <JobLevelSearchComboBox
            name="jobLevel"
            control={form.control}
            initialValue={employmentInfo?.job_level_id}
            required
          />
          <EmployeeTypeSearchComboBox
            name="employeeType"
            control={form.control}
            initialValue={employmentInfo?.employment_type_id}
            required
          />
          <ShiftTemplateSearchComboBox
            name="shift"
            control={form.control}
            initialValue={employmentInfo?.shift_template_id}
            required
          />
          <EmployeeSearchComboBox
            name="supervisor"
            control={form.control}
            initialValue={designations?.upline_id}
            required
          />{" "}
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

export default EditDesignationDialog;
