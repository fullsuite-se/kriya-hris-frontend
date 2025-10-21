import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getCompanyEmployersColumns from "@/components/table/columns/CompanyEmployersColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddCompanyEmployerAPI,
  useAddOfficeAPI,
  useDeleteCompanyEmployerAPI,
  useDeleteOfficeAPI,
  useEditCompanyEmployerAPI,
  useEditOfficeAPI,
  useFetchCompanyEmployersAPI,
  useFetchOfficesAPI,
} from "@/hooks/useCompanyAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";

export const CompanyEmployersTab = () => {
  const {
    allCompanyEmployers,
    refetch: refetchAllCompanyEmployers,
    setAllCompanyEmployers,
    loading,
  } = useFetchCompanyEmployersAPI();
  const [employersDialogOpen, setEmployersDialogOpen] = useState(false);
  const { addCompanyEmployer, loading: addCompanyEmployerLoading } =
    useAddCompanyEmployerAPI();
  const { deleteCompanyEmployer, loading: deleteCompanyEmployerLoading } =
    useDeleteCompanyEmployerAPI();
  const { editCompanyEmployer, loading: editCompanyEmployerLoading } =
    useEditCompanyEmployerAPI();

  const removeLocalCompanyEmployer = (company_employer_id) => {
    const companyEmployerToRemove = allCompanyEmployers.find(
      (j) => j.company_employer_id === company_employer_id
    );
    setAllCompanyEmployers((prev) =>
      prev.filter((j) => j.company_employer_id !== company_employer_id)
    );
    return companyEmployerToRemove; // store this for undo
  };

  const restoreLocalCompanyEmployer = (companyEmployer) => {
    setAllCompanyEmployers((prev) =>
      [...prev, companyEmployer].sort((a, b) =>
        a.company_employer_name.localeCompare(b.company_employer_name)
      )
    );
  };

  const updateLocalCompanyEmployer = (
    company_employer_id,
    company_employer_name
  ) => {
    setAllCompanyEmployers((prevCompanyEmployers) =>
      prevCompanyEmployers.map((companyEmployer) =>
        companyEmployer.company_employer_id === company_employer_id
          ? { ...companyEmployer, company_employer_name }
          : companyEmployer
      )
    );
  };

  const handleSaveCompanyEmployer = async (formData) => {
    const { company_employer_name } = Object.fromEntries(formData.entries());
    try {
      await addCompanyEmployer(company_employer_name);
      setEmployersDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{company_employer_name}</span>{" "}
            added successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllCompanyEmployers();
    } catch (error) {
      glassToast({
        message: `Failed to add company employer. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditCompanyEmployer = async (
    formData,
    company_employer_id,
    company_employer_name
  ) => {
    const updatedCompanyEmployerName = formData
      .get("company_employer_name")
      ?.trim();
    const previousCompanyEmployerName = company_employer_name?.trim();

    const isNameChanged =
      updatedCompanyEmployerName &&
      updatedCompanyEmployerName.toLowerCase() !==
        previousCompanyEmployerName?.toLowerCase();

    if (!isNameChanged) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>
              {previousCompanyEmployerName}
            </span>
            .
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

    updateLocalCompanyEmployer(company_employer_id, updatedCompanyEmployerName);

    let undoCalled = false;
    let saveTimeout;
    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>
            {previousCompanyEmployerName}
          </span>{" "}
          updated to{" "}
          <span style={{ color: "#008080" }}>{updatedCompanyEmployerName}</span>
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
        updateLocalCompanyEmployer(
          company_employer_id,
          previousCompanyEmployerName
        );
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editCompanyEmployer(
          company_employer_id,
          updatedCompanyEmployerName
        );
        refetchAllCompanyEmployers();
      } catch (err) {
        console.error("Failed to update company employer:", err);
        glassToast({
          message: `Failed to update company employer.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalCompanyEmployer(
          company_employer_id,
          previousCompanyEmployerName
        );
      }
    }, 5000);
  };

  const handleDeleteCompanyEmployer = async (
    company_employer_id,
    company_employer_name
  ) => {
    const deletedCompanyEmployer =
      removeLocalCompanyEmployer(company_employer_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{company_employer_name}</span>{" "}
          deleted successfully!
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
        restoreLocalCompanyEmployer(deletedCompanyEmployer);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteCompanyEmployer(company_employer_id);
        refetchAllCompanyEmployers();
      } catch (err) {
        console.error("Failed to delete company employer:", err);
        glassToast({
          message: `Failed to delete companyEmployer "${company_employer_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalCompanyEmployer(deletedCompanyEmployer);
      }
    }, 5000);
  };

  const companyEmployersColumns = getCompanyEmployersColumns({
    onEdit: handleEditCompanyEmployer,
    onDelete: handleDeleteCompanyEmployer,
    editLoading: editCompanyEmployerLoading,
    deleteLoading: deleteCompanyEmployerLoading,
  });

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className=" p-5">
      <div className="justify-between items-center flex mb-8">
        <div>
          <h2 className="text-lg font-semibold">Employers</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
            </Button>
          }
          height="md"
          loading={addCompanyEmployerLoading}
          title="Add New Employer"
          confirmLabel="Save Employer"
          description="Enter the details for the new employer"
          onConfirm={handleSaveCompanyEmployer}
          open={employersDialogOpen}
          onOpenChange={setEmployersDialogOpen}
        >
          {" "}
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="company_employer_name"
              >
                Employer<span className="text-primary-color">*</span>
              </label>
              <Input name="company_employer_name" type="text" required />
            </div>
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={companyEmployersColumns}
        data={allCompanyEmployers}
        searchKeys={["company_employer_name"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default CompanyEmployersTab;
