import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
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
  useDeleteEmployeeTypeAPI,
  useDeleteEmploymentStatusAPI,
  useDeleteJobLevelAPI,
  useDeleteSalaryTypeAPI,
  useEditEmployeeTypeAPI,
  useEditEmploymentStatusAPI,
  useEditJobLevelAPI,
  useEditSalaryTypeAPI,
  useFetchEmployeeTypesAPI,
  useFetchEmploymentStatusAPI,
  useFetchJobLevelsAPI,
  useFetchSalaryTypesAPI,
} from "@/hooks/useJobSettingsAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export const JobSettingsTab = () => {
  // Employment Status
  const {
    allEmploymentStatuses,
    refetch: refetchEmploymentStatus,
    setAllEmploymentStatuses,
    loading: employmentStatusLoading,
    error,
  } = useFetchEmploymentStatusAPI();

  const [employmentStatusDialogOpen, setEmploymentStatusDialogOpen] =
    useState(false);

  const { addEmploymentStatus, loading: addStatusLoading } =
    useAddEmploymentStatusAPI();
  const { editEmploymentStatus, loading: editStatusLoading } =
    useEditEmploymentStatusAPI();
  const { deleteEmploymentStatus, loading: deleteStatusLoading } =
    useDeleteEmploymentStatusAPI();

  // Job Levels
  const {
    allJobLevels,
    refetch: refetchJobLevels,
    setAllJobLevels,
    loading: jobLevelsLoading,
  } = useFetchJobLevelsAPI();
  
  const [jobLevelsDialogOpen, setJobLevelsDialogOpen] = useState(false);
  const { addJobLevel, loading: addLevelLoading } = useAddJobLevelAPI();
  const { editJobLevel, loading: editLevelLoading } = useEditJobLevelAPI();
  const { deleteJobLevel, loading: deleteLevelLoading } =
    useDeleteJobLevelAPI();

  // Employee Types
  const {
    allEmployeeTypes,
    refetch: refetchEmployeeTypes,
    setAllEmployeeTypes,
    loading: employeeTypesLoading,
  } = useFetchEmployeeTypesAPI();
  
  const [employeeTypesDialogOpen, setEmployeeTypesDialogOpen] = useState(false);
  const { addEmployeeType, loading: addEmployeeTypeLoading } =
    useAddEmployeeTypeAPI();
  const { editEmployeeType, loading: editEmployeeTypeLoading } =
    useEditEmployeeTypeAPI();
  const { deleteEmployeeType, loading: deleteEmployeeTypeLoading } =
    useDeleteEmployeeTypeAPI();

  // Salary Types
  const {
    allSalaryTypes,
    refetch: refetchSalaryTypes,
    setAllSalaryTypes,
    loading: salaryTypesLoading,
  } = useFetchSalaryTypesAPI();
  
  const [salaryTypesDialogOpen, setSalaryTypesDialogOpen] = useState(false);
  const { addSalaryType, loading: addSalaryTypeLoading } = useAddSalaryTypeAPI();
  const { editSalaryType, loading: editSalaryTypeLoading } =
    useEditSalaryTypeAPI();
  const { deleteSalaryType, loading: deleteSalaryTypeLoading } =
    useDeleteSalaryTypeAPI();

  // Employment Status Handlers
  const removeLocalEmploymentStatus = (employment_status_id) => {
    const statusToRemove = allEmploymentStatuses.find(
      (s) => s.employment_status_id === employment_status_id
    );
    setAllEmploymentStatuses((prev) =>
      prev.filter((s) => s.employment_status_id !== employment_status_id)
    );
    return statusToRemove;
  };

  const restoreLocalEmploymentStatus = (status) => {
    setAllEmploymentStatuses((prev) =>
      [...prev, status].sort((a, b) => a.employment_status.localeCompare(b.employment_status))
    );
  };

  const updateLocalEmploymentStatus = (employment_status_id, newStatus) => {
    setAllEmploymentStatuses((prev) =>
      prev.map((status) =>
        status.employment_status_id === employment_status_id
          ? { ...status, employment_status: newStatus }
          : status
      )
    );
  };

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
      refetchEmploymentStatus();
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
    employment_status_id,
    employment_status
  ) => {
    const updatedTitle = formData.get("employment_status")?.trim();
    const previousTitle = employment_status?.trim();

    if (
      !updatedTitle ||
      updatedTitle.toLowerCase() === previousTitle.toLowerCase()
    ) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousTitle}</span>.
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

    updateLocalEmploymentStatus(employment_status_id, updatedTitle);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          Employment Status <span style={{ color: "#008080" }}>{previousTitle}</span> updated
          to <span style={{ color: "#008080" }}>{updatedTitle}</span>
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
        updateLocalEmploymentStatus(employment_status_id, previousTitle);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editEmploymentStatus({
          employment_status_id,
          employment_status: updatedTitle,
        });
        refetchEmploymentStatus();
      } catch (err) {
        console.error("Failed to update employment status:", err);
        glassToast({
          message: `Failed to update employment status.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalEmploymentStatus(employment_status_id, previousTitle);
      }
    }, 5000);
  };

  const handleDeleteEmploymentStatus = async (
    employment_status_id,
    employment_status
  ) => {
    const deletedStatus = removeLocalEmploymentStatus(employment_status_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          Employment Status{" "}
          <span style={{ color: "#008080" }}>{employment_status}</span> deleted
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
        restoreLocalEmploymentStatus(deletedStatus);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteEmploymentStatus( employment_status_id );
        refetchEmploymentStatus();
      } catch (err) {
        console.error("Failed to delete employment status:", err);
        glassToast({
          message: `Failed to delete employment status "${employment_status}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalEmploymentStatus(deletedStatus);
      }
    }, 5000);
  };

  // Job Levels Handlers

  const removeLocalJobLevel = (job_level_id) => {
  const levelToRemove = allJobLevels.find(
    (l) => l.job_level_id === job_level_id
  );
  setAllJobLevels((prev) =>
    prev.filter((l) => l.job_level_id !== job_level_id)
  );
  return levelToRemove;
};

const restoreLocalJobLevel = (level) => {
  setAllJobLevels((prev) =>
    [...prev, level].sort((a, b) => a.job_level_name.localeCompare(b.job_level_name))
  );
};

const updateLocalJobLevel = (job_level_id, newData) => {
  setAllJobLevels((prev) =>
    prev.map((level) =>
      level.job_level_id === job_level_id
        ? { ...level, ...newData }
        : level
    )
  );
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
    refetchJobLevels();
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

const handleEditJobLevel = async (
  formData,
  job_level_id,
  job_level_name,
  job_level_description
) => {
  const { job_level_name: updatedName, job_level_description: updatedDescription } = 
    Object.fromEntries(formData.entries());
  
  const previousName = job_level_name?.trim();
  const previousDescription = job_level_description?.trim() || '';

  // Check if both fields are empty or unchanged
  const isNameUnchanged = updatedName.trim().toLowerCase() === previousName.toLowerCase();
  const isDescriptionUnchanged = updatedDescription.trim() === previousDescription;
  
  if ((!updatedName.trim() && !updatedDescription.trim()) || (isNameUnchanged && isDescriptionUnchanged)) {
    glassToast({
      message: (
        <>
          No changes made to{" "}
          <span style={{ color: "#008080" }}>{previousName}</span>.
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

  const newData = {
    job_level_name: updatedName,
    job_level_description: updatedDescription,
  };

  updateLocalJobLevel(job_level_id, newData);

  let undoCalled = false;
  let saveTimeout;

  // Create appropriate success message based on what changed
  let successMessage;
  if (!isNameUnchanged && !isDescriptionUnchanged) {
    successMessage = (
      <>
        Job Level <span style={{ color: "#008080" }}>{previousName}</span> updated
        to <span style={{ color: "#008080" }}>{updatedName}</span>
      </>
    );
  } else if (!isNameUnchanged) {
    successMessage = (
      <>
        Job Level <span style={{ color: "#008080" }}>{previousName}</span> updated
        to <span style={{ color: "#008080" }}>{updatedName}</span>
      </>
    );
  } else {
    successMessage = (
      <>
        Job Level <span style={{ color: "#008080" }}>{previousName}</span> description updated
      </>
    );
  }

  glassToast({
    message: successMessage,
    icon: <CheckCircleIcon className="text-[#008080] w-5 h-5 mt-0.5" />,
    textColor: "black",
    bgColor: "rgba(255, 255, 255, 0.2)",
    blur: 12,
    duration: 5000,
    progressDuration: 5000,
    onUndo: () => {
      undoCalled = true;
      updateLocalJobLevel(job_level_id, {
        job_level_name: previousName,
        job_level_description: previousDescription,
      });
    },
  });

  saveTimeout = setTimeout(async () => {
    if (undoCalled) return;

    try {
      await editJobLevel({
        job_level_id,
        job_level_name: updatedName,
        job_level_description: updatedDescription,
      });
      refetchJobLevels();
    } catch (err) {
      console.error("Failed to update job level:", err);
      glassToast({
        message: `Failed to update job level.`,
        icon: (
          <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
        ),
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });

      // Restore previous data on error
      updateLocalJobLevel(job_level_id, {
        job_level_name: previousName,
        job_level_description: previousDescription,
      });
    }
  }, 5000);
};

const handleDeleteJobLevel = async (job_level_id, job_level_name) => {
  const deletedLevel = removeLocalJobLevel(job_level_id);

  let undoCalled = false;

  glassToast({
    message: (
      <>
        Job Level{" "}
        <span style={{ color: "#008080" }}>{job_level_name}</span> deleted
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
      restoreLocalJobLevel(deletedLevel);
    },
  });

  setTimeout(async () => {
    if (undoCalled) return;

    try {
      await deleteJobLevel(job_level_id );
      refetchJobLevels();
    } catch (err) {
      console.error("Failed to delete job level:", err);
      glassToast({
        message: `Failed to delete job level "${job_level_name}".`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });

      restoreLocalJobLevel(deletedLevel);
    }
  }, 5000);
};

  // Employee Types Handlers
  const removeLocalEmployeeType = (employment_type_id) => {
    const typeToRemove = allEmployeeTypes.find(
      (t) => t.employment_type_id === employment_type_id
    );
    setAllEmployeeTypes((prev) =>
      prev.filter((t) => t.employment_type_id !== employment_type_id)
    );
    return typeToRemove;
  };

  const restoreLocalEmployeeType = (type) => {
    setAllEmployeeTypes((prev) =>
      [...prev, type].sort((a, b) => a.employment_type.localeCompare(b.employment_type))
    );
  };

  const updateLocalEmployeeType = (employment_type_id, newType) => {
    setAllEmployeeTypes((prev) =>
      prev.map((type) =>
        type.employment_type_id === employment_type_id
          ? { ...type, employment_type: newType }
          : type
      )
    );
  };

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
      refetchEmployeeTypes();
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

  const handleEditEmployeeType = async (
    formData,
    employment_type_id,
    employment_type
  ) => {
    const updatedTitle = formData.get("employment_type")?.trim();
    const previousTitle = employment_type?.trim();

    if (
      !updatedTitle ||
      updatedTitle.toLowerCase() === previousTitle.toLowerCase()
    ) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousTitle}</span>.
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

    updateLocalEmployeeType(employment_type_id, updatedTitle);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          Employee Type <span style={{ color: "#008080" }}>{previousTitle}</span> updated
          to <span style={{ color: "#008080" }}>{updatedTitle}</span>
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
        updateLocalEmployeeType(employment_type_id, previousTitle);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editEmployeeType({
          employment_type_id,
          employment_type: updatedTitle,
        });
        refetchEmployeeTypes();
      } catch (err) {
        console.error("Failed to update employee type:", err);
        glassToast({
          message: `Failed to update employee type.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalEmployeeType(employment_type_id, previousTitle);
      }
    }, 5000);
  };

  const handleDeleteEmployeeType = async (employment_type_id, employment_type) => {
    const deletedType = removeLocalEmployeeType(employment_type_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          Employee Type{" "}
          <span style={{ color: "#008080" }}>{employment_type}</span> deleted
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
        restoreLocalEmployeeType(deletedType);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteEmployeeType( employment_type_id );
        refetchEmployeeTypes();
      } catch (err) {
        console.error("Failed to delete employee type:", err);
        glassToast({
          message: `Failed to delete employee type "${employment_type}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalEmployeeType(deletedType);
      }
    }, 5000);
  };

  // Salary Types Handlers
  const removeLocalSalaryType = (salary_adjustment_type_id) => {
    const typeToRemove = allSalaryTypes.find(
      (t) => t.salary_adjustment_type_id === salary_adjustment_type_id
    );
    setAllSalaryTypes((prev) =>
      prev.filter((t) => t.salary_adjustment_type_id !== salary_adjustment_type_id)
    );
    return typeToRemove;
  };

  const restoreLocalSalaryType = (type) => {
    setAllSalaryTypes((prev) =>
      [...prev, type].sort((a, b) => a.salary_adjustment_type.localeCompare(b.salary_adjustment_type))
    );
  };

  const updateLocalSalaryType = (salary_adjustment_type_id, newType) => {
    setAllSalaryTypes((prev) =>
      prev.map((type) =>
        type.salary_adjustment_type_id === salary_adjustment_type_id
          ? { ...type, salary_adjustment_type: newType }
          : type
      )
    );
  };

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
      refetchSalaryTypes();
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

  const handleEditSalaryType = async (
    formData,
    salary_adjustment_type_id,
    salary_adjustment_type
  ) => {
    const updatedTitle = formData.get("salary_adjustment_type")?.trim();
    const previousTitle = salary_adjustment_type?.trim();

    if (
      !updatedTitle ||
      updatedTitle.toLowerCase() === previousTitle.toLowerCase()
    ) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousTitle}</span>.
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

    updateLocalSalaryType(salary_adjustment_type_id, updatedTitle);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          Salary Type <span style={{ color: "#008080" }}>{previousTitle}</span> updated
          to <span style={{ color: "#008080" }}>{updatedTitle}</span>
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
        updateLocalSalaryType(salary_adjustment_type_id, previousTitle);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editSalaryType({
          salary_adjustment_type_id,
          salary_adjustment_type: updatedTitle,
        });
        refetchSalaryTypes();
      } catch (err) {
        console.error("Failed to update salary type:", err);
        glassToast({
          message: `Failed to update salary type.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalSalaryType(salary_adjustment_type_id, previousTitle);
      }
    }, 5000);
  };

  const handleDeleteSalaryType = async (salary_adjustment_type_id, salary_adjustment_type) => {
    const deletedType = removeLocalSalaryType(salary_adjustment_type_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          Salary Type{" "}
          <span style={{ color: "#008080" }}>{salary_adjustment_type}</span> deleted
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
        restoreLocalSalaryType(deletedType);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteSalaryType(salary_adjustment_type_id);
        refetchSalaryTypes();
      } catch (err) {
        console.error("Failed to delete salary type:", err);
        glassToast({
          message: `Failed to delete salary type "${salary_adjustment_type}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalSalaryType(deletedType);
      }
    }, 5000);
  };

  // Columns
  const employmentStatusColumns = getEmploymentStatusColumns({
    onEdit: handleEditEmploymentStatus,
    onDelete: handleDeleteEmploymentStatus,
    editLoading: editStatusLoading,
    deleteLoading: deleteStatusLoading,
  });

  const jobLevelsColumns = getJobLevelsColumns({
    onEdit: handleEditJobLevel,
    onDelete: handleDeleteJobLevel,
    editLoading: editLevelLoading,
    deleteLoading: deleteLevelLoading,
  });

  const employeeTypesColumns = getEmployeeTypesColumns({
    onEdit: handleEditEmployeeType,
    onDelete: handleDeleteEmployeeType,
    editLoading: editEmployeeTypeLoading,
    deleteLoading: deleteEmployeeTypeLoading,
  });

  const salaryTypesColumns = getSalaryTypesColumns({
    onEdit: handleEditSalaryType,
    onDelete: handleDeleteSalaryType,
    editLoading: editSalaryTypeLoading,
    deleteLoading: deleteSalaryTypeLoading,
  });

  if (employmentStatusLoading || jobLevelsLoading || employeeTypesLoading || salaryTypesLoading) {
    return <LoadingAnimation />;
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
      {/* Employment Status */}
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Employment Status</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +
                <span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Employment Status"
            confirmLabel="Save Employment Status"
            description="Enter the details for the new employment status"
            onConfirm={handleSaveEmploymentStatus}
            loading={addStatusLoading}
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

      {/* Job Level */}
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Job Level</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +
                <span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Job Level"
            height="md"
            confirmLabel="Save Job Level"
            description="Enter the details for the new job level"
            onConfirm={handleSaveJobLevel}
            loading={addLevelLoading}
            open={jobLevelsDialogOpen}
            onOpenChange={setJobLevelsDialogOpen}
          >
            <div className="flex flex-col gap-4">
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
                  required
                />
              </div>
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

      {/* Employee Type */}
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Employee Type</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +
                <span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Employee Type"
            confirmLabel="Save Employee Type"
            description="Enter the details for the new employee type"
            onConfirm={handleSaveEmployeeType}
            loading={addEmployeeTypeLoading}
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

      {/* Salary Type */}
      <div className=" bg-white shadow-xs rounded-lg p-5">
        <div className="justify-between items-center flex mb-8">
          <div>
            <h2 className="text-lg font-semibold">Salary Type</h2>
          </div>
          <CustomDialog
            trigger={
              <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
                +
                <span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
              </Button>
            }
            title="Add New Salary Type"
            confirmLabel="Save Salary Type"
            description="Enter the details for the new salary type"
            onConfirm={handleSaveSalaryType}
            loading={addSalaryTypeLoading}
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