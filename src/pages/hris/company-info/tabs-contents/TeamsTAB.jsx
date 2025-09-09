import CustomDialog from "@/components/dialog/CustomDialog";
import getTeamsColumns from "@/components/table/columns/TeamsColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddTeamAPI,
  useDeleteTeamAPI,
  useEditTeamAPI,
  useFetchTeamsAPI,
} from "@/hooks/useCompanyAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";

export const TeamsTab = () => {
  const {
    allTeams,
    refetch: refetchAllTeams,
    setAllTeams,
  } = useFetchTeamsAPI();
  const [teamsDialogOpen, setTeamsDialogOpen] = useState(false);
  const { addTeam, loading: teamsLoading } = useAddTeamAPI();
  const { deleteTeam, loading: deleteTeamLoading } = useDeleteTeamAPI();
  const { editTeam, loading: editTeamLoading } = useEditTeamAPI();

  const removeLocalTeam = (team_id) => {
    const teamToRemove = allTeams.find((j) => j.team_id === team_id);
    setAllTeams((prev) => prev.filter((j) => j.team_id !== team_id));
    return teamToRemove; // store this for undo
  };

  const restoreLocalTeam = (team) => {
    setAllTeams((prev) =>
      [...prev, team].sort((a, b) => a.team_name.localeCompare(b.team_name))
    );
  };

  const updateLocalTeam = (team_id, team_name, team_description) => {
    setAllTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.team_id === team_id
          ? { ...team, team_name, team_description }
          : team
      )
    );
  };

  const handleSaveTeam = async (formData) => {
    const { team_name, team_description } = Object.fromEntries(
      formData.entries()
    );
    try {
      await addTeam({ team_name, team_description });
      setTeamsDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{team_name}</span> added
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllTeams();
    } catch (error) {
      glassToast({
        message: `Failed to add team. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditTeam = async (
    formData,
    team_id,
    team_name,
    team_description
  ) => {
    const updatedTeamName = formData.get("team_name")?.trim();
    const previousTeamName = team_name?.trim();
    const updatedTeamDescription = formData.get("team_description")?.trim();
    const previousTeamDescription = team_description?.trim();

    const isNameChanged =
      updatedTeamName &&
      updatedTeamName.toLowerCase() !== previousTeamName?.toLowerCase();
    const isDescriptionChanged =
      updatedTeamDescription &&
      updatedTeamDescription.toLowerCase() !==
        previousTeamDescription?.toLowerCase();

    if (!isNameChanged && !isDescriptionChanged) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousTeamName}</span>.
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

    updateLocalTeam(team_id, updatedTeamName, updatedTeamDescription);

    let undoCalled = false;
    let saveTimeout;

    let toastMessage;

    if (isNameChanged && isDescriptionChanged) {
      toastMessage = (
        <>
          Team <span style={{ color: "#008080" }}>{previousTeamName}</span> and
          its description updated to{" "}
          <span style={{ color: "#008080" }}>{updatedTeamName}</span>
        </>
      );
    } else if (isNameChanged) {
      toastMessage = (
        <>
          Team <span style={{ color: "#008080" }}>{previousTeamName}</span>{" "}
          updated to <span style={{ color: "#008080" }}>{updatedTeamName}</span>
        </>
      );
    } else if (isDescriptionChanged) {
      toastMessage = (
        <>
          Description of{" "}
          <span style={{ color: "#008080" }}>{previousTeamName}</span> updated
        </>
      );
    } else {
      toastMessage = "Please try again.";
    }

    if (toastMessage) {
      glassToast({
        message: toastMessage,
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5 mt-0.5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 5000,
        progressDuration: 5000,
        onUndo: () => {
          undoCalled = true;
          updateLocalTeam(team_id, previousTeamName, previousTeamDescription);
        },
      });
    }

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editTeam(team_id, updatedTeamName, updatedTeamDescription);
        refetchAllTeams();
      } catch (err) {
        console.error("Failed to update team:", err);
        glassToast({
          message: `Failed to update team.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalTeam(team_id, previousTeamName, previousTeamDescription);
      }
    }, 5000);
  };

  const handleDeleteTeam = async (team_id, team_name) => {
    const deletedTeam = removeLocalTeam(team_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{team_name}</span> deleted
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
        restoreLocalTeam(deletedTeam);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteTeam(team_id);
        refetchAllTeams();
      } catch (err) {
        console.error("Failed to delete team:", err);
        glassToast({
          message: `Failed to delete team "${team_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalTeam(deletedTeam);
      }
    }, 5000);
  };

  const teamsColumns = getTeamsColumns({
    onEdit: handleEditTeam,
    onDelete: handleDeleteTeam,
  });

  return (
    <div className=" p-5">
      <div className="justify-between items-center flex mb-8">
        <div>
          <h2 className="text-lg font-semibold">Teams</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
            </Button>
          }
          title="Add New Team"
          confirmLabel="Save Team"
          description="Enter the details for the new team"
          onConfirm={handleSaveTeam}
          open={teamsDialogOpen}
          onOpenChange={setTeamsDialogOpen}
        >
          {" "}
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium block" htmlFor="team_name">
                Team<span className="text-primary-color">*</span>
              </label>
              <Input name="team_name" type="text" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium block" htmlFor="team_name">
                Description
                <span className="text-primary-color">*</span>
              </label>
              <Input name="team_description" type="text" required />
            </div>{" "}
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={teamsColumns}
        data={allTeams}
        searchKeys={["team_name", "team_description"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default TeamsTab;
