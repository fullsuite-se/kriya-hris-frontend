import CustomDialog from "@/components/dialog/CustomDialog";
import getEmployeeTypesColumns from "@/components/table/columns/EmployeeTypesColumns";
import getEmploymentStatusColumns from "@/components/table/columns/EmploymentStatusColumns";
import getJobLevelsColumns from "@/components/table/columns/JobLevelsColumns";
import getSalaryTypesColumns from "@/components/table/columns/SalaryTypesColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddEmployeeTypeAPI,
  useAddEmploymentStatusAPI,
  useAddJobLevelAPI,
  useAddSalaryTypeAPI,
  useFetchEmployeeTypesAPI,
  useFetchEmploymentStatusAPI,
  useFetchJobLevelsAPI,
  useFetchSalaryTypesAPI,
} from "@/hooks/useJobSettingsAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export const JobSettingsTab = () => {
  //   const { systemCompanyId } = useAuthStore();

  //   const { deleteJob, loading: deleteLoading } = useDeleteJobAPI();
  //   const { editJob, loading: editLoading } = useEditJobAPI();

  const { allEmploymentStatuses, refetch: refetchAllEmploymentStatuses, loading, error } =
    useFetchEmploymentStatusAPI();
  const [employmentStatusDialogOpen, setEmploymentStatusDialogOpen] =
    useState(false);
  const { addEmploymentStatus, loading: employmentStatusLoading } =
    useAddEmploymentStatusAPI();

  const { allJobLevels, refetch: refetchAllJobLevels, loading: fetchJobLevelsLoading } = useFetchJobLevelsAPI();
  const [jobLevelsDialogOpen, setJobLevelsDialogOpen] = useState(false);
  const { addJobLevel, loading: jobLevelLoading } = useAddJobLevelAPI();

  const { allEmployeeTypes, refetch: refetchAllEmployeeTypes } =
    useFetchEmployeeTypesAPI();
  const [employeeTypesDialogOpen, setEmployeeTypesDialogOpen] = useState(false);
  const { addEmployeeType, loading: employeeTypeLoading } =
    useAddEmployeeTypeAPI();

  const { allSalaryTypes, refetch: refetchAllSalaryTypes } =
    useFetchSalaryTypesAPI();
  const [salaryTypesDialogOpen, setSalaryTypesDialogOpen] = useState(false);
  const { addSalaryType, loading: salaryTypeLoading } = useAddSalaryTypeAPI();
  const handleSaveEmploymentStatus = async (formData) => {
    const employmentStatus = formData.get("employment_status");
    try {
      await addEmploymentStatus(employmentStatus);
      setEmploymentStatusDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{employmentStatus}</span> status
            added successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllEmploymentStatuses();
    } catch (error) {
      glassToast({
        message: `Failed to add employment status. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditEmploymentStatus = async (
    formData,
    job_title_id,
    job_title
  ) => {
    // const updatedTitle = formData.get("job_title");
    // const previousTitle = job_title;
    // try {
    //   if (
    //     updatedTitle.trim().toLowerCase() === job_title.trim().toLowerCase() ||
    //     !updatedTitle.trim()
    //   ) {
    //     glassToast({
    //       message: (
    //         <>
    //           No changes made to{" "}
    //           <span style={{ color: "#008080" }}>{previousTitle}</span>
    //         </>
    //       ),
    //       icon: (
    //         <InformationCircleIcon className="text-[#636363] w-5 h-5 mt-0.5" />
    //       ),
    //       textColor: "black",
    //       bgColor: "rgba(255, 255, 255, 0.2)",
    //       blur: 12,
    //       duration: 3000,
    //     });
    //     return;
    //   }
    //   await editJob({
    //     company_id: systemCompanyId,
    //     job_title_id,
    //     new_job_title: updatedTitle,
    //   });
    //   glassToast({
    //     message: (
    //       <>
    //         Job <span style={{ color: "#008080" }}>{previousTitle}</span>{" "}
    //         updated to <span style={{ color: "#008080" }}>{updatedTitle}</span>
    //       </>
    //     ),
    //     icon: <CheckCircleIcon className="text-[#008080] w-5 h-5 mt-0.5" />,
    //     textColor: "black",
    //     bgColor: "rgba(255, 255, 255, 0.2)",
    //     blur: 12,
    //     duration: 5000,
    //     progressDuration: 5000,
    //     onUndo: () =>
    //       editJob({
    //         company_id: systemCompanyId,
    //         job_title_id,
    //         new_job_title: previousTitle,
    //       }).then(refetch),
    //   });
    //   refetch();
    // } catch {
    //   glassToast({
    //     message: `Failed to update job.`,
    //     icon: (
    //       <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
    //     ),
    //     textColor: "black",
    //     bgColor: "rgba(255, 255, 255, 0.2)",
    //     blur: 12,
    //     duration: 4000,
    //   });
    // }
  };

  const handleDeleteEmploymentStatus = async (job_title_id, job_title) => {
    // try {
    //   await deleteJob({ company_id: systemCompanyId, job_title_id });
    //   glassToast({
    //     message: (
    //       <>
    //         Job <span style={{ color: "#008080" }}>{job_title}</span> deleted
    //         successfully!
    //       </>
    //     ),
    //     icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
    //     textColor: "black",
    //     bgColor: "rgba(255, 255, 255, 0.2)",
    //     blur: 12,
    //     duration: 4000,
    //   });
    //   refetch();
    // } catch {
    //   glassToast({
    //     message: `Failed to delete job "${job_title}".`,
    //     icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
    //     textColor: "black",
    //     bgColor: "rgba(255, 255, 255, 0.2)",
    //     blur: 12,
    //     duration: 4000,
    //   });
    // }
  };

  const handleSaveJobLevel = async (formData) => {
    const { job_level_name, job_level_description } = Object.fromEntries(
      formData.entries()
    );
    try {
      await addJobLevel({ job_level_name, job_level_description });
      setJobLevelsDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{job_level_name}</span> job level
            added successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllJobLevels();
    } catch (error) {
      glassToast({
        message: `Failed to add job level. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditJobLevel = async () => {};

  const handleDeleteJobLevel = async () => {};

  const handleSaveEmployeeType = async (formData) => {
    const employeeType = formData.get("employment_type");
    try {
      await addEmployeeType(employeeType);
      setEmployeeTypesDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{employeeType}</span> employee
            type added successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllEmployeeTypes();
    } catch (error) {
      glassToast({
        message: `Failed to add employee type. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditEmployeeType = async () => {};

  const handleDeleteEmployeeType = async () => {};

  const handleSaveSalaryType = async (formData) => {
    const salaryType = formData.get("salary_adjustment_type");
    try {
      await addSalaryType(salaryType);
      setSalaryTypesDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{salaryType}</span> salary type
            added successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllSalaryTypes();
    } catch (error) {
      glassToast({
        message: `Failed to add salary type. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditSalaryType = async () => {};

  const handleDeleteSalaryType = async () => {};

  const employmentStatusColumns = getEmploymentStatusColumns({
    onEdit: handleEditEmploymentStatus,
    onDelete: handleDeleteEmploymentStatus,
  });

  const jobLevelsColumns = getJobLevelsColumns({
    onEdit: handleEditJobLevel,
    onDelete: handleDeleteJobLevel,
  });

  const employeeTypesColumns = getEmployeeTypesColumns({
    onEdit: handleEditEmployeeType,
    onDelete: handleDeleteEmployeeType,
  });

  const salaryTypesColumns = getSalaryTypesColumns({
    onEdit: handleEditSalaryType,
    onDelete: handleDeleteSalaryType,
  });


 if (loading || fetchJobLevelsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
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
    <div className="flex flex-col gap-10">
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Employment Status</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Employment Status"
            confirmLabel="Save Employment Status"
            description="Enter the details for the new employment status"
            onConfirm={handleSaveEmploymentStatus}
            loading={employmentStatusLoading}
            open={employmentStatusDialogOpen}
            onOpenChange={setEmploymentStatusDialogOpen}
          >
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="employment_status"
              >
                Employment Status
              </label>
              <Input
                name="employment_status"
                type="text"
                // className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
          </CustomDialog>
        </div>
        <DataTable
          columns={employmentStatusColumns}
          data={allEmploymentStatuses}
          searchKeys={["employment_status"]}
          cursorType="cursor-default"
          tableHeight="min-h-40 max-h-60"
        />
      </div>

      {/* job level */}
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Job Level</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Job Level"
            confirmLabel="Save Job Level"
            description="Enter the details for the new job level"
            onConfirm={handleSaveJobLevel}
            loading={jobLevelLoading}
            open={jobLevelsDialogOpen}
            onOpenChange={setJobLevelsDialogOpen}
          >
            <div className="flex flex-col gap-4">
              {" "}
              <div className="space-y-2">
                <label
                  className="text-xs font-medium block"
                  htmlFor="job_level_name"
                >
                  Job Level<span className="text-primary-color">*</span>
                </label>
                <Input
                  name="job_level_name"
                  type="text"
                  // className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>{" "}
              <div className="space-y-2">
                <label
                  className="text-xs font-medium block"
                  htmlFor="job_level_description"
                >
                  Description
                </label>
                <Input
                  name="job_level_description"
                  type="text"
                  // className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>
          </CustomDialog>
        </div>
        <DataTable
          columns={jobLevelsColumns}
          data={allJobLevels}
          searchKeys={["job_level_name", "job_level_description"]}
          cursorType="cursor-default"
          tableHeight="min-h-40 max-h-60"
        />
      </div>

      {/* employee type */}
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Employee Type</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Employee Type"
            confirmLabel="Save Employee Type"
            description="Enter the details for the new employee type"
            onConfirm={handleSaveEmployeeType}
            loading={employeeTypeLoading}
            open={employeeTypesDialogOpen}
            onOpenChange={setEmployeeTypesDialogOpen}
          >
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="employment_type"
              >
                Employee Type
              </label>
              <Input
                name="employment_type"
                type="text"
                // className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
          </CustomDialog>
        </div>
        <DataTable
          columns={employeeTypesColumns}
          data={allEmployeeTypes}
          searchKeys={["employment_type"]}
          cursorType="cursor-default"
          tableHeight="min-h-40 max-h-60"
        />
      </div>

      {/* salary tupe */}
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Salary Type</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Salary Type"
            confirmLabel="Save Salary Type"
            description="Enter the details for the new salary type"
            onConfirm={handleSaveSalaryType}
            loading={salaryTypeLoading}
            open={salaryTypesDialogOpen}
            onOpenChange={setSalaryTypesDialogOpen}
          >
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="salary_adjustment_type"
              >
                Salary Type
              </label>
              <Input
                name="salary_adjustment_type"
                type="text"
                // className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
          </CustomDialog>
        </div>
        <DataTable
          columns={salaryTypesColumns}
          data={allSalaryTypes}
          searchKeys={["salary_adjustment_type"]}
          cursorType="cursor-default"
          tableHeight="min-h-40 max-h-60"
        />
      </div>
    </div>
  );
};

export default JobSettingsTab;
