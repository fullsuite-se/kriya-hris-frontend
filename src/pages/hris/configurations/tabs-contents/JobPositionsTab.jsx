import CustomDialog from "@/components/dialog/CustomDialog";
import LoadingAnimation from "@/components/Loading";
import getJobPositionColumns from "@/components/table/columns/JobPositionsColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddJobAPI,
  useDeleteJobAPI,
  useEditJobAPI,
  useFetchAllJobsAPI,
} from "@/hooks/useJobAPI";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const JobPositionsTab = () => {
  const { systemCompanyId } = useAuthStore();
  const { allJobs, refetch, setAllJobs, loading, error } =
    useFetchAllJobsAPI(systemCompanyId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addJob, loading: addLoading } = useAddJobAPI();
  const { deleteJob, loading: deleteLoading } = useDeleteJobAPI();
  const { editJob, loading: editLoading } = useEditJobAPI();

  const removeLocalJob = (job_title_id) => {
    const jobToRemove = allJobs.find((j) => j.job_title_id === job_title_id);
    setAllJobs((prev) => prev.filter((j) => j.job_title_id !== job_title_id));
    return jobToRemove;
  };

  const restoreLocalJob = (job) => {
    setAllJobs((prev) =>
      [...prev, job].sort((a, b) => a.job_title.localeCompare(b.job_title))
    );
  };

  const updateLocalJobTitle = (job_title_id, newTitle) => {
    setAllJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.job_title_id === job_title_id
          ? { ...job, job_title: newTitle }
          : job
      )
    );
  };

  const handleSave = async (formData) => {
    const jobTitle = formData.get("job_title");

    try {
      await addJob({ company_id: systemCompanyId, job_title: jobTitle });
      setDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{jobTitle}</span> added
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetch();
    } catch (error) {
      glassToast({
        message: `Failed to add job. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEdit = async (formData, job_title_id, job_title) => {
    const updatedTitle = formData.get("job_title")?.trim();
    const previousTitle = job_title?.trim();

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

    updateLocalJobTitle(job_title_id, updatedTitle);

    let undoCalled = false;
    let saveTimeout;

    glassToast({
      message: (
        <>
          Job <span style={{ color: "#008080" }}>{previousTitle}</span> updated
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
        updateLocalJobTitle(job_title_id, previousTitle);
      },
    });

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editJob({
          company_id: systemCompanyId,
          job_title_id,
          new_job_title: updatedTitle,
        });
        refetch();
      } catch (err) {
        console.error("Failed to update job:", err);
        glassToast({
          message: `Failed to update job title.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalJobTitle(job_title_id, previousTitle);
      }
    }, 5000);
  };

  const handleDelete = async (job_title_id, job_title) => {
    const deletedJob = removeLocalJob(job_title_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          Job <span style={{ color: "#008080" }}>{job_title}</span> deleted
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
        restoreLocalJob(deletedJob);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteJob({ company_id: systemCompanyId, job_title_id });
        refetch();
      } catch (err) {
        console.error("Failed to delete job:", err);
        glassToast({
          message: `Failed to delete job "${job_title}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalJob(deletedJob);
      }
    }, 5000);
  };

  const jobColumns = getJobPositionColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    editLoading: editLoading,
    deleteLoading: deleteLoading,
  });

  if (loading) {
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
    <div className=" bg-white shadow-xs rounded-lg p-5">
      <div className="justify-between items-center flex mb-8">
        <div>
          <h2 className="text-lg font-semibold">Job Positions</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +
              <span className=" hidden sm:inline text-xs text-xs">
                &nbsp;Add New Job
              </span>
            </Button>
          }
          title="Add New Job Position"
          confirmLabel="Save Job"
          description="Enter the details for the new job position"
          onConfirm={handleSave}
          loading={addLoading}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <div className="space-y-2">
            <label className="text-xs font-medium block" htmlFor="job_title">
              Job Position
            </label>
            <Input name="job_title" type="text" required />
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={jobColumns}
        data={allJobs}
        searchKeys={["job_title"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default JobPositionsTab;
