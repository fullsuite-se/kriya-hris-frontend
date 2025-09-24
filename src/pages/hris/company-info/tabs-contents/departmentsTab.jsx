import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getDepartmentsColumns from "@/components/table/columns/DepartmentsColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddDepartmentAPI,
  useDeleteDepartmentAPI,
  useEditDepartmentAPI,
  // useAddDepartmentAPI,
  // useDeleteDepartmentAPI,
  // useEditDepartmentAPI,
  useFetchDepartmentsAPI,
} from "@/hooks/useCompanyAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";

export const DepartmentsTab = () => {
  const {
    allDepartments,
    refetch: refetchAllDepartments,
    setAllDepartments,
    loading,
    error,
  } = useFetchDepartmentsAPI();
  const [departmentsDialogOpen, setDepartmentsDialogOpen] = useState(false);
  const { addDepartment, loading: addDepartmentLoading } =
    useAddDepartmentAPI();
  const { deleteDepartment, loading: deleteDepartmentLoading } =
    useDeleteDepartmentAPI();
  const { editDepartment, loading: editDepartmentLoading } =
    useEditDepartmentAPI();

  const removeLocalDepartment = (department_id) => {
    const departmentToRemove = allDepartments.find(
      (j) => j.department_id === department_id
    );
    setAllDepartments((prev) =>
      prev.filter((j) => j.department_id !== department_id)
    );
    return departmentToRemove; // store this for undo
  };

  const restoreLocalDepartment = (department) => {
    setAllDepartments((prev) =>
      [...prev, department].sort((a, b) =>
        a.department_name.localeCompare(b.department_name)
      )
    );
  };

  const updateLocalDepartment = (department_id, department_name) => {
    setAllDepartments((prevDepartment) =>
      prevDepartment.map((department) =>
        department.department_id === department_id
          ? { ...department, department_name }
          : department
      )
    );
  };

  const handleSaveDepartment = async (formData) => {
    const department = formData.get("department_name");

    try {
      await addDepartment(department);
      setDepartmentsDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{department}</span> added
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllDepartments();
    } catch (error) {
      glassToast({
        message: `Failed to add department. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditDepartment = async (
    formData,
    department_id,
    department_name
  ) => {
    const updatedDepartmentName = formData.get("department_name")?.trim();
    const previousDepartmentName = department_name?.trim();

    if (
      !updatedDepartmentName ||
      updatedDepartmentName.toLowerCase() ===
        previousDepartmentName.toLowerCase()
    ) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousDepartmentName}</span>.
          </>
        ),
        icon: (
          <InformationCircleIcon className="text-[#636363] w-5 h-5 mt-0.5" />
        ),
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 3000,
      });
      return;
    }

    updateLocalDepartment(department_id, updatedDepartmentName);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{previousDepartmentName}</span>{" "}
          updated to{" "}
          <span style={{ color: "#008080" }}>{updatedDepartmentName}</span>
        </>
      ),
      icon: <CheckCircleIcon className="text-[#008080] w-5 h-5 mt-0.5" />,
      textColor: "black",
      bgColor: "rgba(255, 255, 255, 0.2)",
      blur: 12,
      duration: 5000,
      progressDuration: 5000,
      onUndo: () => {
        undoCalled = true;
        updateLocalDepartment(department_id, previousDepartmentName);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editDepartment(department_id, updatedDepartmentName);
        refetchAllDepartments();
      } catch (err) {
        console.error("Failed to update department:", err);
        glassToast({
          message: `Failed to update department.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalDepartment(department_id, previousDepartmentName);
      }
    }, 5000);
  };

  const handleDeleteDepartment = async (department_id, department_name) => {
    const deletedDepartment = removeLocalDepartment(department_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{department_name}</span> deleted
          successfully!
        </>
      ),
      icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
      textColor: "black",
      bgColor: "rgba(255, 255, 255, 0.2)",
      blur: 12,
      duration: 5000,
      progressDuration: 5000,
      onUndo: () => {
        undoCalled = true;
        restoreLocalDepartment(deletedDepartment);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteDepartment(department_id);
        refetchAllDepartments();
      } catch (err) {
        console.error("Failed to delete department:", err);
        glassToast({
          message: `Failed to delete "${department_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalDepartment(deletedDepartment);
      }
    }, 5000);
  };

  const departmentsColumns = getDepartmentsColumns({
    onEdit: handleEditDepartment,
    onDelete: handleDeleteDepartment,
  });

   if (loading) {
    return (
      // <div className="flex items-center justify-center h-screen">
      //   <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
      // </div>
        <LoadingAnimation/>
    );
  }

  return (
    <div className=" p-5">
      <div className="justify-between items-center flex mb-8">
        <div>
          <h2 className="text-lg font-semibold">Departments</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
            </Button>
          }
          title="Add New Department"
          confirmLabel="Save Department"
          description="Enter the details for the new department"
          onConfirm={handleSaveDepartment}
          open={departmentsDialogOpen}
          onOpenChange={setDepartmentsDialogOpen}
        >
          <div className="space-y-2">
            <label
              className="text-xs font-medium block"
              htmlFor="department_name"
            >
              Department<span className="text-primary-color">*</span>
            </label>
            <Input name="department_name" type="text" required />
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={departmentsColumns}
        data={allDepartments}
        searchKeys={["department_name"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default DepartmentsTab;
